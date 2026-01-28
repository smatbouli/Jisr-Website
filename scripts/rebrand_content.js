const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function rebrandContent() {
    console.log('Starting rebranding of site content...');

    try {
        const aboutContent = await prisma.siteContent.findUnique({
            where: { key: 'about_page' }
        });

        if (aboutContent) {
            let data = JSON.parse(aboutContent.content);
            let updated = false;

            // Simple replace recursive or just known keys
            const keysToFix = ['story_title_en', 'story_p2_en', 'description_en'];

            for (const key of keysToFix) {
                if (data[key] && data[key].includes('Sinaa')) {
                    console.log(`Fixing ${key}: ${data[key]}`);
                    data[key] = data[key].replace(/Sinaa/g, 'Jisr');
                    updated = true;
                }
            }

            // Also check Arabic keys for transliterated 'Sinaa' if any, but user complained about English 'The story of sanaa'
            // The Arabic title was 'قصة جسر' in defaults but might be 'قصة صناع' in DB.
            if (data.story_title_ar && data.story_title_ar.includes('صناع')) {
                data.story_title_ar = data.story_title_ar.replace(/صناع/g, 'جسر');
                updated = true;
            }

            if (updated) {
                await prisma.siteContent.update({
                    where: { key: 'about_page' },
                    data: { content: JSON.stringify(data) }
                });
                console.log('Successfully updated about_page content.');
            } else {
                console.log('No "Sinaa" content found in about_page to fix.');
            }
        } else {
            console.log('No about_page content found in DB.');
        }

    } catch (error) {
        console.error('Error rebranding content:', error);
    } finally {
        await prisma.$disconnect();
    }
}

rebrandContent();
