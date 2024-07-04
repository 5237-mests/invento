import itemModel from "@/models/itemModel";
import itemShopRelation from "@/models/itemShopRelation";
import shopModel from "@/models/shopModel";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

// add items to shop
// if quantity is less than 0, dispatch items
export async function POST(request: Request) {
  const body = await request.json();
  const { itemId, shopId, quantity } = body;

  await connectDB();

  // Check if the relationship exists
  let relationship = await itemShopRelation.findOne({
    item: itemId,
    shop: shopId,
  });

  if (relationship) {
    // If relationship exists, update the quantity
    relationship.quantity += quantity;
    await relationship.save();
  } else {
    // Create a new relationship
    relationship = new itemShopRelation({
      item: itemId,
      shop: shopId,
      quantity: quantity,
    });
    await relationship.save();

    // update items and shop
    await itemModel.findByIdAndUpdate(itemId, {
      $push: { shops: shopId },
    });
    await shopModel.findByIdAndUpdate(shopId, {
      $push: { items: itemId },
    });
  }

  return NextResponse.json(
    { msg: "Relationship created or updated successfully", relationship },
    { status: 200 },
  );
}

// get all relationships or get relationship by id
export async function GET(request: Request) {
  const searchParams = new URLSearchParams(request.url.split("?")[1]);
  const id = searchParams.get("id");
  await connectDB();

  if (id) {
    const relationship = await itemShopRelation.findById(id);
    return NextResponse.json({ relationship }, { status: 200 });
  } else {
    const relationships = await itemShopRelation.find();
    return NextResponse.json({ relationships }, { status: 200 });
  }
}
