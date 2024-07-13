// create customer api
import connectDB from '@/config/database';
import customerModel from '@/models/customerModel';
import { NextResponse } from 'next/server';

// Connect to the database once
connectDB();

// Create customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const customer = await customerModel.create(body);
    customer.save();
    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Get customer
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    connectDB();

    // get customer by id
    if (id) {
      const customer = await customerModel.findById(id);
      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ customer }, { status: 200 });
    } else {
      // get all customers
      const customers = await customerModel.find();
      return NextResponse.json({ customers }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
  }
}

// Update customer
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 },
      );
    }

    await connectDB();
    const customer = await customerModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 },
      );
    }
    customer.save();
    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Delete customer
export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 },
      );
    }
    await connectDB();
    const customer = await customerModel.findByIdAndDelete(id);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 },
      );
    }
    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
