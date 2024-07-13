import connectDB from '@/config/database';
import SoldItem from '@/models/soldItemModel';
import Sale from '@/models/saleModel';
import { NextResponse } from 'next/server';

// connect to db
connectDB();

export async function GET(req: Request) {
  const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const itemId = searchParams.get('itemId');
  const shopId = searchParams.get('shopId');
  const customerId = searchParams.get('customerId');

  try {
    await connectDB();

    // if no itemId, shopId, or customerId, return all soldItems
    if (!itemId && !shopId && !customerId) {
      const soldItems = await SoldItem.find()
        .populate('item')
        .populate('sale')
        .populate({
          path: 'sale',
          populate: { path: 'shop' },
        });
      return NextResponse.json({ soldItems }, { status: 200 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (itemId) {
      filter.item = itemId;
    }
    if (shopId) {
      const sales = await Sale.find({ shop: shopId });
      const saleIds = sales.map((sale) => sale._id);
      filter.sale = { $in: saleIds };
    }
    if (customerId) {
      const sales = await Sale.find({ customer: customerId });
      const saleIds = sales.map((sale) => sale._id);
      filter.sale = { $in: saleIds };
    }

    const soldItems = await SoldItem.find(filter)
      .populate('item')
      .populate('sale')
      .populate({
        path: 'sale',
        populate: { path: 'shop' },
      });

    return NextResponse.json({ soldItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sold items:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// delete sold item
export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    await connectDB();
    const deletedSoldItem = await SoldItem.findByIdAndDelete(id);
    if (!deletedSoldItem) {
      return NextResponse.json(
        { error: 'Sold item not found' },
        { status: 404 },
      );
    }
    return NextResponse.json({ deletedSoldItem }, { status: 200 });
  } catch (error) {
    console.error('Error deleting sold item:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
