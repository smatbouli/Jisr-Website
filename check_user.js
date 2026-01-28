const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'buyer1@sinaa.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });
    console.log(user ? `User found: ${JSON.stringify(user)}` : 'User not found');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
