import connectDB from '@/config/database';
import itemModel from '@/models/itemModel';
import itemShopRelation from '@/models/itemShopRelation';
import itemStoreRelation from '@/models/itemStoreRelation';
import { NextResponse } from 'next/server';
import { checkAdmin, checkShopkeeper } from '@/lib/authMiddleWare';

// Connect to the database once
connectDB();

// Create item
export async function POST(request: Request) {
  const isAdmin = checkAdmin();
  const isStorekeeper = checkShopkeeper();
  if (!isAdmin && !isStorekeeper)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const item = await itemModel.create(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create item', details: error },
      { status: 500 },
    );
  }
}

// Get item(s)
export async function GET(request: Request) {
  const isAdmin = checkAdmin();
  if (!isAdmin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');
    const productCode = searchParams.get('productCode');

    if (id) {
      const item = await itemModel
        .findById(id)
        .populate('stores')
        .populate('shops');

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      // Fetch quantity for the item in shops and stores
      const itemQuantity = await itemShopRelation.find({ item: id });
      const itemQuantityInStore = await itemStoreRelation.find({ item: id });

      // Send item quantity along with item details
      const itemWithQuantity = {
        ...item.toObject(),
        shopQuantity: itemQuantity[0]?.quantity || 0,
        storeQuantity: itemQuantityInStore[0]?.quantity || 0,
      };

      return NextResponse.json({ item: itemWithQuantity }, { status: 200 });
    } else if (productCode) {
      const item = await itemModel
        .findOne({ productCode })
        .populate('stores')
        .populate('shops');

      return NextResponse.json({ item }, { status: 200 });
    } else {
      const items = await itemModel
        .find({})
        .populate('stores')
        .populate('shops');

      // Fetch quantity for each item in shops and stores
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

      return NextResponse.json({ items: itemsWithQuantity }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error },
      { status: 500 },
    );
  }
}

// Update item
export async function PATCH(request: Request) {
  const isAdmin = checkAdmin();
  if (isAdmin) return isAdmin;

  try {
    const body = await request.json();
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 },
      );
    }

    const updatedItem = await itemModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ updatedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item', details: error },
      { status: 500 },
    );
  }
}

// Delete item
export async function DELETE(request: Request) {
  const isAdmin = checkAdmin();
  if (isAdmin) return isAdmin;

  try {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 },
      );
    }

    const item = await itemModel.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item', details: error },
      { status: 500 },
    );
  }
}
