import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { imageId } = await req.json();
    console.log(imageId);

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: "imageId is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY; // server-side API key
    const deleteUrl = `https://api.imgbb.com/1/delete?key=${apiKey}&image=${imageId}`;

    const res = await axios.get(deleteUrl);
    console.log(res);

    if (res.data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to delete image" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Delete image error:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
