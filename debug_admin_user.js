const { PrismaClient } = require("@prisma/client");
const { compare } = require("bcryptjs");

const prisma = new PrismaClient();

async function inspectAdmin() {
    console.log("--- Inspecting Admin User ---");
    const email = "admin@jisr.com";
    const passwordInput = "Admin123!";

    // Find exact match
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log("❌ User NOT FOUND by exact email match.");

        // Try fuzzy search
        const allUsers = await prisma.user.findMany();
        const potential = allUsers.find(u => u.email.trim().toLowerCase() === email.toLowerCase());
        if (potential) {
            console.log(`⚠️ Found similar user: '${potential.email}' (ID: ${potential.id})`);
            console.log(`   Whitespace difference? '${potential.email}' vs '${email}'`);
        } else {
            console.log("❌ No similar user found.");
        }
        return;
    }

    console.log("✅ User FOUND:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: '${user.email}'`); // Quotes to reveal whitespace
    console.log(`   Role: ${user.role}`);
    console.log(`   IsBanned: ${user.isBanned}`);
    console.log(`   Password Hash: ${user.password.substring(0, 10)}...`);

    const isMatch = await compare(passwordInput, user.password);
    console.log(`\n🔑 Password Check for '${passwordInput}': ${isMatch ? "MATCHED ✅" : "FAILED ❌"}`);

    if (!isMatch) {
        console.log("   Attempting to update password to ensure it works...");
        const { hash } = require("bcryptjs");
        const newHash = await hash(passwordInput, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash }
        });
        console.log("   ✅ Password has been RESET to 'Admin123!'");
    }
}

inspectAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
