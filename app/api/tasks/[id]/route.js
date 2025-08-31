// app/api/tasks/[id]/route.js
export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();
    const index = tasks.findIndex((t) => t.id == id);
  
    if (index === -1) {
      console.error(`PUT failed: Task with id ${id} not found`);
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
  
    tasks[index] = { ...tasks[index], ...body };
    console.log(`Task ${id} updated:`, tasks[index]);
    return Response.json(tasks[index]);
  }
  
  export async function DELETE(req, { params }) {
    const { id } = params;
    console.log("Delete request params:", params);
  
    const index = tasks.findIndex((t) => t.id == id);
  
    if (index === -1) {
      console.error(`DELETE failed: Task with id ${id} not found`);
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
  
    const [removed] = tasks.splice(index, 1);
    console.log(`Task ${id} deleted:`, removed);
  
    return Response.json({
      message: `Task ${id} deleted successfully`,
      deleted: removed,
    });
  }
  