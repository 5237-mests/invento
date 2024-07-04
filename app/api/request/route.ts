// crud for request
import connectDB from "@/config/database";
import requestModel from "@/models/requestModel";
import { NextResponse } from "next/server";

// create request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const req = await requestModel.create(body);
    return NextResponse.json({ msg: "request created", req }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// get request
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      await connectDB();
      const req = await requestModel
        .findById(id)
        .populate("item")
        .populate("shop");
      return NextResponse.json({ req }, { status: 200 });
    } else {
      await connectDB();
      // const req = await requestModel.find().populate('item').populate('shop');
      const req = await requestModel.find().populate("items").populate("shop");
      return NextResponse.json({ req }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// delete request
export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");
    await connectDB();
    const req = await requestModel.findByIdAndDelete(id);
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Request deleted successfully", req },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete request", details: error },
      { status: 500 },
    );
  }
}

// update request
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");
    await connectDB();
    const req = await requestModel.findByIdAndUpdate(id, body, { new: true });
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Request updated successfully", req },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update request", details: error },
      { status: 500 },
    );
  }
}
