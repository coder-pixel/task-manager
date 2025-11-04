import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// GET - Fetch a project by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params?.id;

    // get user id
    const authHeader = request?.headers?.get("authorization");
    const userId = authHeader?.split("Bearer ")[1];

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // get the project
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap?.data();

    // verify ownership
    if (projectData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this project" },
        { status: 403 }
      );
    }

    const project = {
      id: projectSnap?.id,
      ...projectData,
      tasks: projectData?.tasks || [],
    };

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch project";
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
