import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET interventions endpoint
export async function GET() {
  try {
    const interventions = await prisma.Intervention.findMany();
    return new Response(JSON.stringify({interventions}), {status: 200});
  } catch (error) {
    return new Response({ error: 'Could not fetch interventions' }, {status: 500});
  }
}

// POST intervention endpoint
export async function POST({request}) {
  let current_step = "";
  try {
    current_step = "fetching parameters";
    const { address, date, description, status, type } = await request.json();
    
    current_step = "setting default values";
    if (!status || date == null) {
      status = 'À planifier';
    }
    if (!date || date == null) {
      date = new Date();
    }
    current_step = "checking mandatory fields";
    if (!address || !type || !description) {
      return new Response(JSON.stringify({ error: 'address, type & description are mandatory fields' }), { status: 400 });
    }

    current_step = "creating the new record";
    const newIntervention = await prisma.Intervention.create({
      data: {
        address: address,
        type: type,
        description: description,
        status: status,
        date: date,
      },
    });

    return new Response(JSON.stringify(newIntervention), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error while "+current_step}), { status: 500 });
  }
}