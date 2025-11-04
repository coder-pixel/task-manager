import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// GET - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    // get user id
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // fetch projects from firestore (db)
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot?.docs?.map((doc) => {
      const data = doc?.data();
      return {
        id: doc?.id,
        ...data,
        tasks: data?.tasks || [], // ensure tasks array is always present
        totalTasks: data?.tasks?.length || 0,
      };
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch projects";
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    const { projectName, description } = await request.json();

    // validate input for required fields
    if (!projectName || !description) {
      return NextResponse.json(
        { error: "Project name and description are required" },
        { status: 400 }
      );
    }

    // get user data
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // create project in firestore (db)
    const projectsRef = collection(db, "projects");
    const newProject = {
      projectName: projectName?.trim(),
      description: description?.trim(),
      userId,
      tasks: [], // initialize empty tasks array
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(projectsRef, newProject);

    const project = {
      id: docRef?.id,
      ...newProject,
    };

    return NextResponse.json(
      {
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create project";
    console.error("Error creating project:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
