import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        { message: "Missing Google credential" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid Google token payload" },
        { status: 401 }
      );
    }

    if (payload.email_verified !== true) {
      return NextResponse.json(
        { message: "Google account email not verified" },
        { status: 401 }
      );
    }

    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    return NextResponse.json({
      message: "Google login successful",
      user,
    });
  } catch (error) {
    console.error("Google verification error:", error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    );
  }
}
