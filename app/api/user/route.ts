import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/config/database';
import UserModel from '@/models/userModel';
import { cookies } from 'next/headers';

// Create a new user
export async function POST(request: Request) {
  try {
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

    await connectDB();

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { msg: 'Email already registered', field: 'email' },
        { status: 409 },
      );
    }

    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { msg: 'Username already registered', field: 'username' },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}

// Get user by ID or all users
export async function GET(request: Request) {
  try {
    const session = cookies().get('session')?.value;
    const role = cookies().get('role')?.value;
    if (!session || role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    await connectDB();

    if (id) {
      const user = await UserModel.findById(id);
      if (!user) {
        return NextResponse.json({ msg: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(
        { msg: 'Successfully retrieved user', user },
        { status: 200 },
      );
    } else {
      const users = await UserModel.find();
      return NextResponse.json(
        { msg: 'Successfully retrieved all users', total: users.length, users },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log('Error retrieving user(s):', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a user by ID
export async function DELETE(request: Request) {
  try {
    const session = cookies().get('session')?.value;
    const role = cookies().get('role')?.value;
    if (!session || role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    await connectDB();
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'User deleted successfully', user },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}

// Update a user by ID
export async function PATCH(request: Request) {
  try {
    const session = cookies().get('session')?.value;
    const role = cookies().get('role')?.value;
    if (!session || role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    const body = await request.json();

    if (body.password && body.password.length < 6) {
      return NextResponse.json(
        { msg: 'Password must be at least 6 characters', field: 'password' },
        { status: 400 },
      );
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    await connectDB();
    const user = await UserModel.findByIdAndUpdate(id, body, { new: true });
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'User updated successfully', user },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
