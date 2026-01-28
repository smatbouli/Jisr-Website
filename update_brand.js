
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating brand name in database...');

    // 1. Update SiteContent for Header
    const headerKey = 'site_header';
    const headerContent = {
        logoText: 'Jisr',
        logoUrl: null // or keep existing if managing checks
    };

    await prisma.siteContent.upsert({
        where: { key: headerKey },
        update: { content: JSON.stringify(headerContent) },
        create: {
            key: headerKey,
            content: JSON.stringify(headerContent)
        }
    });

    console.log('Updated site_header to Jisr');

    // 2. Check if there are other content blocks with "Sinaa"
    const contents = await prisma.siteContent.findMany();
    for (const c of contents) {
        if (c.content.includes('Sinaa')) {
            const newContent = c.content.replace(/Sinaa'/g, 'Jisr').replace(/Sinaa/g, 'Jisr');
            await prisma.siteContent.update({
                where: { id: c.id },
                data: { content: newContent }
            });
            console.log(`Updated content for key: ${c.key}`);
        }
    }

    // 3. Update Factory descriptions if they contain "Sinaa"
    const factories = await prisma.factoryProfile.findMany({
        where: {
            description: {
                contains: 'Sinaa'
            }
        }
    });

    for (const f of factories) {
        const newDesc = f.description.replace(/Sinaa'/g, 'Jisr').replace(/Sinaa/g, 'Jisr');
        await prisma.factoryProfile.update({
            where: { id: f.id },
            data: { description: newDesc }
        });
        console.log(`Updated factory description: ${f.businessName}`);
    }

    console.log('Database update complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
