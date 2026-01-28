
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Admin
    try {
        const admin = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                password,
                role: 'ADMIN',
            },
        });
        console.log('Created Admin:', admin.email);
    } catch (e) { console.log('Admin probably exists or error:', e.message) }

    // Factory
    try {
        const factory = await prisma.user.create({
            data: {
                email: 'factory3@test.com',
                password,
                role: 'FACTORY',
                factoryProfile: {
                    create: {
                        businessName: 'Test Factory 3',
                        verificationStatus: 'UNVERIFIED'
                    }
                }
            },
        });
        console.log('Created Factory:', factory.email);
    } catch (e) { console.log('Factory probably exists or error:', e.message) }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
