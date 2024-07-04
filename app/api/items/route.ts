// create item API
import connectDB from '@/config/database';
import itemModel from '@/models/itemModel';
import itemShopRelation from '@/models/itemShopRelation';
import itemStoreRelation from '@/models/itemStoreRelation';
import { NextResponse } from 'next/server';

// create item
export async function POST(request: Request) {
  const body = await request.json();
  await connectDB();

  // check if item exists
  // const item_exists = await itemModel.findOne({ productCode: body.productCode });

  // if item already exist update the store stock
  // if (item_exists) {
  //   const updatedItem = await itemModel.findByIdAndUpdate(item_exists._id, {
  //     $inc: {
  //       'stockQuantity.store': Number(body.stockQuantity.store)
  //     }
  //   }, { new: true });
  //   return NextResponse.json({ updatedItem }, { status: 200 });
  // }

  const item = await itemModel.create(body);
  return NextResponse.json({ item }, { status: 200 });
}

// get all items or get item by id
export async function GET(request: Request) {
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const id = searchParams.get('id');
  const productCode = searchParams.get('productCode');
  await connectDB();

  if (id) {
    const item = await itemModel
      .findById(id)
      .populate('stores')
      .populate('shops');

    // fetch quantity for an item in the shop and store
    const itemQuantity = await itemShopRelation.find({ item: id });
    const itemQuantityInStore = await itemStoreRelation.find({ item: id });

    // send item quantity with item response
    const itemsWithQuantity = {
      ...item.toObject(),
      shopQuantity: itemQuantity[0]?.quantity || 0,
      storeQuantity: itemQuantityInStore[0]?.quantity || 0,
    };

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item: itemsWithQuantity }, { status: 200 });
  } else if (productCode) {
    const item = await itemModel
      .findOne({ productCode })
      .populate('stores')
      .populate('shops');
    return NextResponse.json({ data: item }, { status: 200 });
  } else {
    const items = await itemModel.find().populate('stores').populate('shops');

    // fetch quantity for an item in the shop and store
    const itemsWithQuantity = await Promise.all(
      items.map(async (item) => {
        const itemQuantity = await itemShopRelation.find({ item: item._id });
        const itemQuantityInStore = await itemStoreRelation.find({
          item: item._id,
        });
        return {
          ...item.toObject(),
          shopQuantity: itemQuantity[0]?.quantity || 0,
          storeQuantity: itemQuantityInStore[0]?.quantity || 0,
        };
      }),
    );

    // send item quantity with item response
    return NextResponse.json({ items: itemsWithQuantity }, { status: 200 });
    // return NextResponse.json({ data: items }, { status: 200 });
  }
}

// update item
export async function PATCH(request: Request) {
  const body = await request.json();
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const id = searchParams.get('id');

  await connectDB();

  // check if item exists
  const item = await itemModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  const updatedItem = await itemModel.findByIdAndUpdate(id, body, {
    new: true,
  });
  return NextResponse.json({ updatedItem }, { status: 200 });
}

// delete item
export async function DELETE(request: Request) {
  const searchParams = new URLSearchParams(request.url.split('?')[1]);
  const id = searchParams.get('id');

  await connectDB();
  const item = await itemModel.findByIdAndDelete(id);
  return NextResponse.json({ item }, { status: 200 });
}
