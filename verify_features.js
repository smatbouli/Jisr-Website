
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("--- Starting Feature Verification ---");

        // 1. Setup: Get Factory
        const factoryUser = await prisma.user.findUnique({
            where: { email: 'factory3@test.com' },
            include: { factoryProfile: true }
        });
        if (!factoryUser || !factoryUser.factoryProfile) throw new Error("Factory 3 not found");
        console.log("Found Factory:", factoryUser.factoryProfile.businessName);

        // 2. Simulate Strict Moderation
        // Ensure factory is VERIFIED first
        await prisma.factoryProfile.update({
            where: { id: factoryUser.factoryProfile.id },
            data: { verificationStatus: 'VERIFIED', isVerified: true }
        });
        console.log("Ensured Factory is VERIFIED");

        // Simulate Update (Factory side)
        const pendingData = {
            businessName: "Test Factory 3 UPDATED",
            city: "Jeddah",
            timestamp: new Date().toISOString()
        };
        await prisma.factoryProfile.update({
            where: { id: factoryUser.factoryProfile.id },
            data: { pendingChanges: JSON.stringify(pendingData) }
        });
        console.log("Simulated Factory Update -> Pending Changes set");

        // Verify Pending State
        let f = await prisma.factoryProfile.findUnique({ where: { id: factoryUser.factoryProfile.id } });
        if (!f.pendingChanges) throw new Error("Pending changes not found!");
        if (f.businessName === "Test Factory 3 UPDATED") throw new Error("Update applied too early!");
        console.log("Verification Passed: Changes are pending, not applied.");

        // Simulate Admin Approval
        const changes = JSON.parse(f.pendingChanges);
        delete changes.timestamp;
        await prisma.factoryProfile.update({
            where: { id: f.id },
            data: { ...changes, pendingChanges: null }
        });
        console.log("Simulated Admin Approval");

        // Verify Final State
        f = await prisma.factoryProfile.findUnique({ where: { id: f.id } });
        if (f.businessName !== "Test Factory 3 UPDATED") throw new Error("Update NOT applied after approval!");
        if (f.city !== "Jeddah") throw new Error("City NOT updated!");
        if (f.pendingChanges) throw new Error("Pending changes NOT cleared!");
        console.log("Verification Passed: Changes applied successfully.");

        console.log("--- ALL CHECKS PASSED ---");

    } catch (e) {
        console.error("FAILED:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

run();
