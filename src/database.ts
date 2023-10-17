import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const truncateStories = async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE;`;
}
