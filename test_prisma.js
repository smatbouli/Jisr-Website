
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const queue = await prisma.factoryProfile.findMany({
            where: {
                OR: [
                    { verificationStatus: { not: 'VERIFIED' } },
                    { pendingChanges: { not: null } }
                ]
            },
            orderBy: { updatedAt: 'desc' }
        });
        console.log("Success! Queue length:", queue.length);
        if (queue.length > 0) {
            console.log("First item status:", queue[0].verificationStatus);
        }
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

check();
