import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // validate input for required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // sign in using Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get user token from data
    const token = await userCredential?.user?.getIdToken();

    // Return user data and token
    return NextResponse.json(
      {
        user: {
          uid: userCredential?.user?.uid,
          email: userCredential?.user?.email,
          emailVerified: userCredential?.user?.emailVerified,
        },
        token,
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error);
    // Handle specific Firebase errors
    let errorMessage = "Failed to sign in";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "This account has been disabled";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed login attempts. Please try again later";
    }

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
