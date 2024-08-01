import connectDB from '@/config/database';
import Sale from '@/models/saleModel';
import SoldItem from '@/models/soldItemModel';
import Item from '@/models/itemModel';
import Shop from '@/models/shopModel';
import { NextResponse } from 'next/server';
import axios from 'axios';

// connect to db
connectDB();

// create sale
export async function POST(req: Request) {
  const { items, shop, customer } = await req.json();

  // const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const shopId = shop;

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
      customer: customer ? customer : null,
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

    // Update the Shop with the sale ID
    // deduct items from shop items
    const deductItemFromShop = async (
      item: string,
      shop: string,
      quantity: number,
    ) => {
      try {
        const baseUrl =
          process.env.NODE_ENV === 'development'
            ? process.env.BASE_URL_LOCAL
            : process.env.BASE_URL_LIVE;
        const res = await axios.post(`${baseUrl}/api/shop/items`, {
          itemId: item,
          shopId: shop,
          quantity: -quantity,
        });
        return res.data;
      } catch (error) {
        console.error('Error deducting item from store:', error);
        throw error;
      }
    };

    const itemsInShop = items.map((item) =>
      deductItemFromShop(item.itemId, shopId, item.quantity),
    );
    await Promise.all(itemsInShop);

    return NextResponse.json(
      { message: 'Sale created successfully.' },
      {
        status: 201,
      },
    );
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
      // fetch all sales
      // populate the soldItems and shop and customer
      // sort by date from newest to oldest
      // populate items
      // items is array of objects of soldItems

      const sales = await Sale.find()
        .populate('customer')
        .populate('shop', 'name shopCode')
        .populate({
          path: 'items',
          populate: {
            path: 'item',
          },
        })
        .sort({ saleDate: -1 });
      return NextResponse.json({ sales }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// delete sale
export async function DELETE(req: Request) {
  const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const id = searchParams.get('id');
  try {
    await connectDB();
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (!deletedSale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }
    return NextResponse.json({ deletedSale }, { status: 200 });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
