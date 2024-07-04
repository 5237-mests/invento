"use server";

import PostModel from "@/models/postModel";
import connectDB from "@/config/database";

export async function getPosts() {
  try {
    await connectDB();

    return { msg: "success GET" };
  } catch (error) {
    return { msg: "failed GET" };
  }
}
// export async function POST(request: Request) {
//   const { title, content } = await request.json();
//   const post = new PostModel({
//     title,
//     content
//   });
//   await connectDB();
//   await post.save();
//   return new Response(JSON.stringify(post), { status: 201 });
// }
