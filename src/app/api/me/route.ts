import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized: invalid token" },
      { status: 401 }
    );
  }
}
