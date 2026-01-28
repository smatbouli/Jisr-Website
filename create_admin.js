
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@jisr.com';
    const password = 'Admin123!';

    console.log(`Creating/Updating Admin User: ${email}...`);

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            // Optional: Update password if you want to reset it
            // password: hashedPassword 
        },
        create: {
            email,
            password: hashedPassword,
            role: 'ADMIN'
        },
    });

    console.log('------------------------------------------------');
    console.log('Admin User Ready:');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('Role:     ' + user.role);
    console.log('------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
