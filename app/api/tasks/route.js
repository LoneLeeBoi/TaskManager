import { db } from "../../lib/db"; // ✅ adjust if needed

// ✅ GET all tasks (with optional search + filter)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");
    const status = searchParams.get("status");

    let query = "SELECT * FROM tasks WHERE 1=1";
    const values = [];

    if (keyword) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      values.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      query += " AND status = ?";
      values.push(status);
    }

    const [rows] = await db.query(query, values);

    return Response.json(rows);
  } catch (err) {
    console.error("GET /tasks error:", err);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// ✅ CREATE a new task
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, status } = body;

    if (!title || !description) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Insert into DB
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
      [title, description, status || "pending"]
    );

    // Return created task
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);

    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /tasks error:", err);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
