// app/api/tasks/route.js
let tasks = [
    { id: 1, title: "Learn Next.js", description: "Study the basics", status: "pending" },
    { id: 2, title: "Build CRUD API", description: "Practice coding", status: "in-progress" },
  ];
  
  export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");
    const status = searchParams.get("status");
  
    let filtered = tasks;
  
    if (keyword) {
      const lower = keyword.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower)
      );
    }
  
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
  
    console.log("GET tasks:", { keyword, status, results: filtered.length });
    return Response.json(filtered);
  }
  
  export async function POST(req) {
    try {
      const body = await req.json();
  
      if (!body.title || !body.description) {
        return Response.json({ error: "Title and description are required" }, { status: 400 });
      }
  
      const newTask = {
        id: Date.now(),
        title: body.title,
        description: body.description,
        status: body.status || "pending",
      };
  
      tasks.push(newTask);
  
      console.log("Task created:", newTask);
      return Response.json(newTask, { status: 201 });
    } catch (err) {
      console.error("POST /tasks error:", err);
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
  }
  