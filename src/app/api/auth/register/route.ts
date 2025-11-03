import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

    // create a new user in Firebase db
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // get user token from data
    const token = await userCredential?.user?.getIdToken();

    // create response with user data and token
    const response = NextResponse.json(
      {
        user: {
          uid: userCredential?.user?.uid,
          email: userCredential?.user?.email,
          emailVerified: userCredential?.user?.emailVerified,
        },
        token,
      },
      { status: 201 }
    );

    // set httpOnly cookie here, to be later used for authentication in middleware
    response?.cookies?.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Registration error:", error);

    // handle specific Firebase errors
    let errorMessage = "Failed to create account";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "An account with this email already exists";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password accounts are not enabled";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please use a stronger password";
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
