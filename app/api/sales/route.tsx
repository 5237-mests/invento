import connectDB from '@/config/database';
import Sale from '@/models/saleModel';
import SoldItem from '@/models/soldItemModel';
import Item from '@/models/itemModel';
import Shop from '@/models/shopModel';
import { NextResponse } from 'next/server';

// connect to db
connectDB();

// create sale
export async function POST(req: Request) {
  // const { shopId, items } = req.body;
  const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const shopId = searchParams.get('shopId');
  const items = searchParams.get('items'); // array of { itemId, quantity }

  try {
    await connectDB();

    if (!shopId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Create new sale
    const soldItems = await Promise.all(
      items.map(async (soldItem: { itemId: string; quantity: number }) => {
        const item = await Item.findById(soldItem.itemId);
        if (!item) {
          throw new Error(`Item with ID ${soldItem.itemId} not found`);
        }

        const newSoldItem = new SoldItem({
          item: item._id,
          quantity: soldItem.quantity,
          price: item.price,
        });

        await newSoldItem.save();
        return newSoldItem;
      }),
    );

    const totalAmount = soldItems.reduce((sum, soldItem) => {
      return sum + soldItem.price * soldItem.quantity;
    }, 0);

    const sale = new Sale({
      shop: shop._id,
      items: soldItems.map((soldItem) => soldItem._id),
      totalAmount,
    });

    await sale.save();

    // Update the SoldItems with the sale ID
    await Promise.all(
      soldItems.map(async (soldItem) => {
        soldItem.sale = sale._id;
        await soldItem.save();
      }),
    );

    return NextResponse.json({ message: 'Sale created successfully', sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// get all sales or get sale by id
export async function GET(req: Request) {
  const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const id = searchParams.get('id');
  const date = searchParams.get('date');
  const shopId = searchParams.get('shopId');

  try {
    await connectDB();

    if (shopId) {
      const sales = await Sale.find({ shop: shopId });
      return NextResponse.json({ sales }, { status: 200 });
    }
    if (date) {
      const sales = await Sale.find({ saleDate: new Date(date) });
      return NextResponse.json({ sales }, { status: 200 });
    }
    if (id) {
      const sale = await Sale.findById(id);
      if (!sale) {
        return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
      }
      return NextResponse.json({ sale }, { status: 200 });
    } else {
      const sales = await Sale.find();
      return NextResponse.json({ sales }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
