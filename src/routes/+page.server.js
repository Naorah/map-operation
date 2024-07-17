import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Chargement des interventions
export async function load() {
  try {
    const interventions = await prisma.Intervention.findMany();
    return { interventions };
  } catch (error) {
    console.error('Error fetching interventions:', error);
    return {};
  }
}