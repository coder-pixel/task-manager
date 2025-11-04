import { NextResponse } from "next/server";

export async function POST() {
  try {
    // create response
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // clear the auth-token cookie
    response?.cookies?.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // expire immediately
      path: "/",
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
