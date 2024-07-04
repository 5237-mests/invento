// import itemModel from "@/models/itemModel";
// import shopModel from "@/models/shopModel";
// import itemShopRelation from "@/models/itemShopRelation";
// import connectDB from "@/config/database";
// import { NextResponse } from "next/server";

// // get all relationships or get relationship by id
// export async function GET(request: Request) {
//   const searchParams = new URLSearchParams(request.url.split('?')[1])
//   const id = searchParams.get('id')
//   await connectDB();

//   if (id) {
//     const relationship = await itemShopRelation.findById(id);
//     return NextResponse.json({ relationship }, { status: 200 });
//   } else {
//     const relationships = await itemShopRelation.find();
//     return NextResponse.json({ relationships }, { status: 200 });
//   }
// }

// // add items to shop
// // if quantity is less than 0, dispatch items
// export async function POST(request : Request) {
//   const body = await request.json();
//   const { itemId, shopId, quantity } = body;

//   await connectDB();

//   // Check if the relationship exists
//   let relationship = await itemShopRelation.findOne({ item: itemId, shop: shopId });

//   if (relationship) {
//     // If relationship exists, update the quantity
//     relationship.quantity += Number(quantity);
//     await relationship.save();
//   } else {
//     // Create a new relationship
//     relationship = new itemShopRelation({
//       item: itemId,
//       shop: shopId,
//       quantity: quantity,
//     });
//     await relationship.save();

//     // Update item with the referenced shop
//     await itemModel.findByIdAndUpdate(itemId, {
//       $push: { shops: shopId },
//     });

//     // Update shop with the referenced item
//     await shopModel.findByIdAndUpdate(shopId, {
//       $push: { items: itemId },
//     });
//   }

//   return NextResponse.json({ msg: 'Relationship created or updated successfully', relationship }, { status: 200 });
// }

import itemModel from '@/models/itemModel';
import shopModel from '@/models/shopModel';
import itemShopRelation from '@/models/itemShopRelation';
import connectDB from '@/config/database';
import { NextResponse } from 'next/server';

// get all relationships or get relationship by id
export async function GET(request: Request) {
  try {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id');
    await connectDB();

    if (id) {
      const relationship = await itemShopRelation.findById(id);
      if (!relationship) {
        return NextResponse.json(
          { error: 'Relationship not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ relationship }, { status: 200 });
    } else {
      const relationships = await itemShopRelation.find();
      return NextResponse.json({ relationships }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// add items to shop
// if quantity is less than 0, dispatch items
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, shopId, quantity } = body;

    if (!itemId || !shopId || quantity == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if the relationship exists
    let relationship = await itemShopRelation.findOne({
      item: itemId,
      shop: shopId,
    });

    if (relationship) {
      // If relationship exists, update the quantity
      relationship.quantity += Number(quantity);
      await relationship.save();
    } else {
      // Create a new relationship
      relationship = new itemShopRelation({
        item: itemId,
        shop: shopId,
        quantity: quantity,
      });
      await relationship.save();

      // Update item with the referenced shop
      await itemModel.findByIdAndUpdate(itemId, {
        $push: { shops: shopId },
      });

      // Update shop with the referenced item
      await shopModel.findByIdAndUpdate(shopId, {
        $push: { items: itemId },
      });
    }

    return NextResponse.json(
      { msg: 'Relationship created or updated successfully', relationship },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating/updating relationship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
