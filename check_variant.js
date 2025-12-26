
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const variantId = 'cme8vozzo0004778oae5uo4y7';
    console.log(`Checking for variant ID: ${variantId}`);
    try {
        const variant = await prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        console.log('Variant found:', variant);

        if (!variant) {
            console.log('Variant not found. Listing 5 random variants:');
            const variants = await prisma.productVariant.findMany({ take: 5 });
            console.log(variants);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
