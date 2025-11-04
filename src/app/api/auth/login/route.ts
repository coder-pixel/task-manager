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

    // get user token
    const token = await userCredential?.user?.getIdToken();

    // create response
    const response = NextResponse.json(
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

    // set httpOnly cookie, to be later used for authentication in middleware
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
    console.error("Login error:", error);
    // handle specific firebase errors
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
