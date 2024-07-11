import itemModel from '@/models/itemModel';
import storeModel from '@/models/storeModel';
import itemStoreRelation from '@/models/itemStoreRelation';
import connectDB from '@/config/database';
import { NextResponse } from 'next/server';

// get all relationships or get relationship by id
export async function GET(request: Request) {
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const itemId = searchParams.get('itemId');
  const storeId = searchParams.get('storeId');
  await connectDB();

  if (itemId && storeId) {
    const item = await itemStoreRelation
      .find({ store: storeId, item: itemId })
      .populate('item');
    return NextResponse.json({ item }, { status: 200 });
  } else {
    const items = await itemStoreRelation
      .find({ store: storeId })
      .populate('item');
    return NextResponse.json({ items }, { status: 200 });
  }
}

// add items to store
// if quantity is less than 0, dispatch items
export async function POST(request: Request) {
  const body = await request.json();
  const { itemId, storeId, quantity } = body;

  await connectDB();

  // Check if the relationship exists
  let relationship = await itemStoreRelation.findOne({
    item: itemId,
    store: storeId,
  });

  if (relationship) {
    // If relationship exists, update the quantity
    relationship.quantity += Number(quantity);
    await relationship.save();
  } else {
    // Create a new relationship
    relationship = new itemStoreRelation({
      item: itemId,
      store: storeId,
      quantity: quantity,
    });
    await relationship.save();

    // Update item with the referenced store
    await itemModel.findByIdAndUpdate(itemId, {
      $push: { stores: storeId },
    });

    // Update store with the referenced item
    await storeModel.findByIdAndUpdate(storeId, {
      $push: { items: itemId },
    });
  }

  return NextResponse.json(
    { msg: 'Relationship created or updated successfully', relationship },
    { status: 200 },
  );
}
