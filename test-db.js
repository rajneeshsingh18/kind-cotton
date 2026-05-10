const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const products = await prisma.product.findMany({ take: 1 });
    console.log('Connected successfully, found products:', products.length);
  } catch (error) {
    console.error('Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();