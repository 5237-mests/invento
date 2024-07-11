import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import requestModel from '@/models/requestModel';
import { checkAuth } from '@/lib/authMiddleWare';
import shopModel from '@/models/shopModel';
import axios from 'axios';

// Connect to the database once
connectDB();

export async function POST(request: Request) {
  const isAuth = checkAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const req_id = body.id;

    if (!req_id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 },
      );
    }

    // Check if request exists
    const req = await requestModel.findById(req_id);
    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // If req is not approved, stop
    if (!req.approved) {
      return NextResponse.json(
        { error: 'Request not approved' },
        { status: 400 },
      );
    }

    // If req completed or cancelled, stop
    if (req.status === 'completed' || req.status === 'cancelled') {
      return NextResponse.json({
        error: 'Request already completed or cancelled',
      });
    }

    // Add list of items to shop
    const shop = await shopModel.findById(req.shop);
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Helper function to add item to shop
    const addItemToShop = async (
      item: string,
      shop: string,
      quantity: number,
    ) => {
      try {
        const res = await axios.post(`http://localhost:3000/api/shop/items`, {
          itemId: item,
          shopId: shop,
          quantity: quantity,
        });
        return res.data;
      } catch (error) {
        console.error('Error adding item to shop:', error);
        throw error;
      }
    };

    // List of items from request
    const items = req.items.map((item: Item) =>
      addItemToShop(item.item, shop._id.toString(), item.quantity),
    );
    await Promise.all(items);

    // Update store by deducting items from store
    const storeId = '66819e7c954d3862e992cb9e';
    const deductItemFromStore = async (
      item: string,
      store: string,
      quantity: number,
    ) => {
      try {
        const res = await axios.post(`http://localhost:3000/api/store/items`, {
          itemId: item,
          storeId: store,
          quantity: -quantity,
        });
        return res.data;
      } catch (error) {
        console.error('Error deducting item from store:', error);
        throw error;
      }
    };

    const stores = req.items.map((item: Item) =>
      deductItemFromStore(item.item, storeId, item.quantity),
    );
    await Promise.all(stores);

    // Update request status to completed
    req.status = 'completed';
    await req.save();

    return NextResponse.json(
      { msg: 'Request approved', req: req.toJSON() },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

interface Item {
  _id: string;
  item: string;
  quantity: number;
}
