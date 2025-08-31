import { db } from "../../../lib/db"; // ✅ adjust path to where you placed your db.js

// ✅ UPDATE a task by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, status } = body;

    // Update query
    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // Return updated task
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    return Response.json(rows[0]);
  } catch (err) {
    console.error("PUT error:", err);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// ✅ DELETE a task by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Find the task before deleting (so we can return it)
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
    const deletedTask = rows[0];

    // Delete query
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({
      message: `Task ${id} deleted successfully`,
      deleted: deletedTask,
    });
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
