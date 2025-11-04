import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Task } from "@/store/projectStore";

// POST - Add a new task to a project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, dueDate, status } = await request.json();
    const projectId = params?.id;

    // Validate input
    if (!title || !status) {
      return NextResponse.json(
        { error: "Title and status are required" },
        { status: 400 }
      );
    }

    // Get user ID from auth header
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // Get the project to verify ownership
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap?.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap?.data();
    if (projectData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this project" },
        { status: 403 }
      );
    }

    // Create new task
    const newTask = {
      id: `task_${Date.now()}_${Math.random()?.toString(36)?.substring(2, 9)}`,
      title: title?.trim(),
      dueDate: dueDate ?? null,
      status: status?.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add task to project's tasks array
    await updateDoc(projectRef, {
      tasks: arrayUnion(newTask),
    });

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: newTask,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = (error as Error)?.message ?? "Failed to create task";
    console.error("Error creating task:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { taskId, status, title, dueDate } = await request.json();
    const projectId = params?.id;

    // Validate input
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Get user ID from auth header
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // Get the project
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap?.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap?.data();
    if (projectData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this project" },
        { status: 403 }
      );
    }

    // Get current tasks and update the specific task
    const tasks = projectData?.tasks || [];
    const taskIndex = tasks?.findIndex((t: Task) => t?.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task properties
    const updatedTask = {
      ...tasks?.[taskIndex],
      ...(status !== undefined && { status: status?.trim() }),
      ...(title !== undefined && { title: title?.trim() }),
      ...(dueDate !== undefined && { dueDate }),
    };

    tasks[taskIndex] = updatedTask;

    // Update the project document
    await updateDoc(projectRef, {
      tasks: tasks,
    });

    return NextResponse.json(
      {
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update task";
    console.error("Error updating task:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams?.get("taskId");
    const projectId = params?.id;

    // Validate input
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Get user ID from auth header
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // Get the project
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap?.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap?.data();
    if (projectData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this project" },
        { status: 403 }
      );
    }

    // Get current tasks and remove the specific task
    const tasks = projectData?.tasks || [];
    const taskToDelete =
      tasks?.find((t: Task) => t?.id === taskId) ?? undefined;

    if (!taskToDelete) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Remove task from array
    await updateDoc(projectRef, {
      tasks: arrayRemove(taskToDelete),
    });

    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = (error as Error)?.message ?? "Failed to delete task";
    console.error("Error deleting task:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
