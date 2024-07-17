import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE({ params }) {
  try {
    const id = params.id;
  
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }
  
    const deletedIntervention = await prisma.Intervention.delete({
      where: { id: Number(id) },
    });
  
    return new Response(JSON.stringify(deletedIntervention), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Could not delete intervention' }), { status: 500 });
  }
}

// PUT intervention endpoint
export async function PUT({ params, request }) {
  let current_step = "";
  try {
    current_step = "fetching parameters";
    const { id } = params;
    const { address, date, description, status, type } = await request.json();

    current_step = "checking mandatory fields";
    if (!address || !type || !description || !status || !date) {
      return new Response(JSON.stringify({ error: 'all fields are mandatory fields' }), { status: 400 });
    }
    // ${id}, ${address}, ${type}, ${description}, ${status}, ${date}
    current_step = `updating the record`;
    const updatedIntervention = await prisma.Intervention.update({
      where: {
        id: parseInt(id),
      },
      data: {
        address: address,
        type: type,
        description: description,
        status: status,
        date: date,
      },
    });

    return new Response(JSON.stringify(updatedIntervention), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error while " + current_step }), { status: 500 });
  }
}