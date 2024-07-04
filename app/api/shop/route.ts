import connectDB from '@/config/database';
import shopModel from '@/models/shopModel';
import { NextResponse } from 'next/server';
import itemShopRelation from '@/models/itemShopRelation';

// Create shop
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const shop = await shopModel.create(body);
    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Get all shops or a single shop by ID
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    await connectDB();

    if (id) {
      const shop = await shopModel.findById(id).populate('items');
      if (!shop) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      }

      // fetch quantity for an item in the shop
      const itemQuantity = await itemShopRelation
        .find({ shop: id })
        .populate('item');
      const itemsWithQuantity = itemQuantity.map((relation) => ({
        ...relation.item.toObject(),
        quantity: relation.quantity,
      }));
      const shopWithQuantity = { ...shop.toObject(), items: itemsWithQuantity };
      return NextResponse.json({ shop: shopWithQuantity }, { status: 200 });
    } else {
      const shops = await shopModel.find();

      // fetch quantity for an item in the shop
      // const shopsWithQuantity = await Promise.all(shops.map(async (shop) => {
      //   const itemQuantity = await itemShopRelation.find({ shop: shop._id }).populate('item');
      //   const itemsWithQuantity = itemQuantity.map((relation) => ({
      //     ...relation.item.toObject(),
      //     quantity: relation.quantity
      //   }));
      //   return { ...shop.toObject(), items: itemsWithQuantity };
      // }))
      return NextResponse.json({ shops }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch shops', details: error },
      { status: 500 },
    );
  }
}

// Update shop
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    await connectDB();

    //check if shop exists
    const shop = await shopModel.findById(id);
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    //update shop
    const updatedShop = await shopModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json({ updatedShop }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update shop', details: error },
      { status: 500 },
    );
  }
}

// Delete shop
export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    await connectDB();
    const shop = await shopModel.findByIdAndDelete(id);
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    return NextResponse.json(
      { msg: 'Shop deleted successfully', shop },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete shop', details: error },
      { status: 500 },
    );
  }
}
