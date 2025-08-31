// app/api/tasks/[id]/route.js
export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();
    const index = tasks.findIndex((t) => t.id == id);
  
    if (index === -1) return Response.json({ error: "Task not found" }, { status: 404 });
  
    tasks[index] = { ...tasks[index], ...body };
    return Response.json(tasks[index]);
  }
  
  export async function DELETE(req, { params }) {
    const { id } = params;
    const index = tasks.findIndex((t) => t.id == id);
  
    if (index === -1) return Response.json({ error: "Task not found" }, { status: 404 });
  
    const removed = tasks.splice(index, 1);
    return Response.json(removed[0]);
  }
  