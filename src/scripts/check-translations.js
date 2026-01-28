const fs = require('fs');
const path = require('path');
// const glob = require('glob'); // Removed to avoid dependency

// Simple recursive directory walker if glob isn't available
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.match(/\.(js|jsx|ts|tsx)$/)) {
                results.push(file);
            }
        }
    });
    return results;
}

// Regex to find t('key') or t("key")
const T_REGEX = /[^a-zA-Z0-9]t\(['"`](.*?)['"`]\)/g;

async function checkTranslations() {
    console.log('🔍 Starting Translation Audit...');

    // 1. Load Locales
    // We strictly read the file content to avoid needing babel/import issues with ES modules in node script
    const readLocaleFile = (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        // Hacky parse for ES export const en = { ... }
        // We assume the strict structure I just wrote: export const [lang] = { ... };
        const match = content.match(/export const \w+ = ({[\s\S]*?});/);
        if (!match) {
            console.error(`❌ Could not parse locale file: ${filePath}`);
            return {};
        }
        try {
            // Relaxed JSON parse (allow single quotes and trailing commas)
            // This is dangerous but simplest without a parser library. 
            // Better strategy: evaluate strictly or use regex to find keys.
            // Let's use regex to extract keys to be safe against syntax errors in eval.

            const keys = [];
            const keyRegex = /['"](.*?)['"]:\s*['"`](.*?)['"`]/g;
            let keyMatch;
            // Iterate over lines or matching pairs
            // The content block is match[1]
            const objectBody = match[1];

            // Simple key extractor
            const lines = objectBody.split('\n');
            const map = {};
            lines.forEach(line => {
                const kv = line.match(/^\s*['"](.+?)['"]:\s*['"`](.*?)['"`],?/);
                if (kv) {
                    map[kv[1]] = kv[2];
                }
            });
            return map;
        } catch (e) {
            console.error('Error parsing locale:', e);
            return {};
        }
    };

    const enPath = path.join(process.cwd(), 'src/locales/en.js');
    const arPath = path.join(process.cwd(), 'src/locales/ar.js');

    const en = readLocaleFile(enPath);
    const ar = readLocaleFile(arPath);

    console.log(`📊 Found ${Object.keys(en).length} English keys`);
    console.log(`📊 Found ${Object.keys(ar).length} Arabic keys`);

    // 2. Identify Missing in Arabic
    const missingInAr = [];
    Object.keys(en).forEach(key => {
        if (!ar[key]) {
            missingInAr.push(key);
        }
    });

    if (missingInAr.length > 0) {
        console.log(`\n⚠️  Found ${missingInAr.length} keys missing in Arabic:`);
        missingInAr.forEach(k => console.log(`   - ${k}`));

        // AUTO FIX
        console.log('\n🛠  Attempting auto-fix for missing Arabic keys...');
        let arContent = fs.readFileSync(arPath, 'utf8');
        // Find the last closing brace
        const lastBraceIndex = arContent.lastIndexOf('};');

        let newEntries = '';
        missingInAr.forEach(key => {
            // Use English value as placeholder
            const val = en[key].replace(/'/g, "\\'"); // escape single quotes
            newEntries += `    '${key}': '[AR] ${val}',\n`;
        });

        if (lastBraceIndex !== -1) {
            const newContent = arContent.slice(0, lastBraceIndex) + newEntries + arContent.slice(lastBraceIndex);
            fs.writeFileSync(arPath, newContent);
            console.log('✅ Added missing keys to src/locales/ar.js');
        } else {
            console.error('❌ Could not safely edit ar.js');
        }
    } else {
        console.log('\n✅ Arabic translations are in sync with English dictionary.');
    }

    // 3. Scan Code for Used Keys (Optional but requested "check whole website")
    console.log('\nscanner: Scanning src/ for usage of t()...');
    const files = walk(path.join(process.cwd(), 'src'));
    const usedKeys = new Set();

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = T_REGEX.exec(content)) !== null) {
            usedKeys.add(match[1]);
        }
    });

    console.log(`Found ${usedKeys.size} unique used keys in code.`);
    const missingInEn = [];
    usedKeys.forEach(key => {
        if (!en[key]) {
            missingInEn.push(key);
        }
    });

    if (missingInEn.length > 0) {
        console.log(`\n⚠️  Found ${missingInEn.length} keys used in code but missing in en.js (Potential hardcoded strings treated as keys?):`);
        missingInEn.forEach(k => console.log(`   - ${k}`));
        // We don't auto-add these to EN because they might be dynamic or garbage
    } else {
        console.log('✅ All used keys exist in English dictionary.');
    }

    console.log('\nAudit Complete.');
}

checkTranslations().catch(console.error);
