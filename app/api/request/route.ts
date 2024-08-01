import connectDB from '@/config/database';
import requestModel from '@/models/requestModel';
import { NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import store from '@/models/storeModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import shop from '@/models/shopModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Item from '@/models/itemModel';

// Connect to the database once
connectDB();

// Create request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const req = await requestModel.create(body);
    return NextResponse.json({ msg: 'Request created', req }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create request', details: error },
      { status: 500 },
    );
  }
}

// Get request(s)
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    const shopId = searchParams.get('shopId');

    if (id) {
      const req = await requestModel
        .findById(id)
        .populate('items.item')
        .populate('shop');
      if (!req) {
        return NextResponse.json(
          { error: 'Request not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ req }, { status: 200 });
    } else if (shopId) {
      const reqs = await requestModel
        .find({ shop: shopId })
        .populate('items.item')
        .populate('shop');
      return NextResponse.json({ reqs }, { status: 200 });
    } else {
      const reqs = await requestModel
        .find()
        .populate('shop')
        .populate('items.item');
      return NextResponse.json({ reqs }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch requests', details: error },
      { status: 500 },
    );
  }
}

// Delete request
export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 },
      );
    }

    const req = await requestModel.findByIdAndDelete(id);
    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'Request deleted successfully', req },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete request', details: error },
      { status: 500 },
    );
  }
}

// Update request
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 },
      );
    }

    const req = await requestModel.findByIdAndUpdate(id, body, { new: true });
    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'Request updated successfully', req },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update request', details: error },
      { status: 500 },
    );
  }
}
