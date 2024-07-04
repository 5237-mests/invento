import bcrypt from "bcrypt";
import UserModel from "@/models/userModel";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// login user
export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ msg: "Missing fields" }, { status: 400 });
  }

  // connect to db
  await connectDB();

  // check if email exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ msg: "Incorrect credentials" }, { status: 401 });
  }

  // generate token
  const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "1h",
  });

  return NextResponse.json(
    { msg: "Login successful", token, user },
    { status: 200 },
  );
}
