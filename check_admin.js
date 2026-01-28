
const { PrismaClient } = require('@prisma/client');
const { compare } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@jisr.com';
    const password = 'Admin123!';

    console.log(`Checking Admin User: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('User NOT found!');
        return;
    }

    console.log('User found:');
    console.log(`ID: ${user.id}`);
    console.log(`Role: ${user.role}`);
    console.log(`Hash: ${user.password.substring(0, 10)}...`);

    console.log('Testing password comparison...');
    const valid = await compare(password, user.password);
    console.log(`Password Valid: ${valid}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
