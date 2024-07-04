"use server";

import UserModel from "@/models/userModel";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { firstName, lastName, username, email, password } =
    await request.json();
  const user = new UserModel({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  await connectDB();
  await user.save();
  return NextResponse.json({ msg: "success POST" });
}
