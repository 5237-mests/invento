import connectDB from '@/config/database';
import itemStoreRelation from '@/models/itemStoreRelation';
import storeModel from '@/models/storeModel';
import { NextResponse } from 'next/server';

// Create store
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const store = await storeModel.create(body);
    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

// Get all stores or get store by ID
export async function GET(request: Request) {
  try {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');
    await connectDB();

    if (id) {
      // get store with name of items in the store
      const store = await storeModel.findById(id).populate('items');
      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }

      // fetch quantity for an item in the store
      const itemQuantity = await itemStoreRelation
        .find({ store: id })
        .populate('item');

      // send item quantity with store response
      const itemsWithQuantity = itemQuantity.map((relation) => ({
        ...relation.item.toObject(),
        quantity: relation.quantity,
      }));

      const storeWithQuantity = {
        ...store.toObject(),
        items: itemsWithQuantity,
      };
      return NextResponse.json({ store: storeWithQuantity }, { status: 200 });
    } else {
      const stores = await storeModel.find().populate('items');

      // fetch quantity for an item in the store
      const storesWithQuantity = await Promise.all(
        stores.map(async (store) => {
          const itemQuantity = await itemStoreRelation
            .find({ store: store._id })
            .populate('item');
          const itemsWithQuantity = itemQuantity.map((relation) => ({
            ...relation.item.toObject(),
            quantity: relation.quantity,
          }));
          return { ...store.toObject(), items: itemsWithQuantity };
        }),
      );

      return NextResponse.json({ stores: storesWithQuantity }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// Update store
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');

    await connectDB();
    const store = await storeModel.findByIdAndUpdate(id, body, { new: true });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

// Delete store
export async function DELETE(request: Request) {
  try {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');

    await connectDB();
    const store = await storeModel.findByIdAndDelete(id);
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
