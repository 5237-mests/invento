// create usermodel
import UserModel from '@/models/userModel';
import connectDB from '@/config/database';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

//registration of user
export async function POST(request: Request) {
  const { firstName, lastName, username, email, password, phone, role } =
    await request.json();

  if (!firstName || !lastName || !username || !email || !password || !phone) {
    return NextResponse.json({ msg: 'Missing fields' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { msg: 'Password must be at least 6 characters', field: 'password' },
      { status: 400 },
    );
  }

  // connect to db
  await connectDB();

  // check if email already exists
  const emailExists = await UserModel.findOne({ email });
  if (emailExists) {
    return NextResponse.json(
      { msg: 'Email already registered', field: 'email' },
      { status: 409 },
    );
  }

  // check if username already exists
  const usernameExists = await UserModel.findOne({ username });
  if (usernameExists) {
    return NextResponse.json(
      { msg: 'Username already registered', field: 'username' },
      { status: 409 },
    );
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = new UserModel({
    firstName,
    lastName,
    username,
    email,
    phone,
    password: hashedPassword,
    role,
  });
  await user.save();
  return NextResponse.json(
    { msg: 'User created successfully', user },
    { status: 201 },
  );
}

// get user by id
export async function GET(request: Request) {
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const id = searchParams.get('id');

  await connectDB();

  if (id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'successfully retrieved user', user },
      { status: 200 },
    );
  } else {
    const users = await UserModel.find();
    return NextResponse.json(
      { msg: 'successfully retrieved all users', total: users.length, users },
      { status: 200 },
    );
  }
}

// delete user
// take id from params and delete user
export async function DELETE(request: Request) {
  // const searchParams = new URLSearchParams(request.url.split('?')[1])
  // const id = searchParams.get('id')

  const { id } = await request.json();

  await connectDB();
  const user = await UserModel.findByIdAndDelete(id);
  return NextResponse.json(
    { msg: 'User deleted successfully', user },
    { status: 200 },
  );
}

// update user
// take id from params and update user
export async function PATCH(request: Request) {
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const id = searchParams.get('id');

  const body = await request.json();

  // console.log(body)
  // check if password changed and hash it and atleast 6 characters
  if (body.password) {
    if (body.password.length < 6) {
      return NextResponse.json(
        { msg: 'Password must be at least 6 characters', field: 'password' },
        { status: 400 },
      );
    }
    body.password = await bcrypt.hash(body.password, 10);
  }

  await connectDB();

  const user = await UserModel.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(
    { msg: 'User updated successfully', user },
    { status: 200 },
  );
}
