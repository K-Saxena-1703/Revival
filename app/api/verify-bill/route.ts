// e:/Revival/app/api/verify-bill/route.ts
import { verifyBillFromText } from "@/backend/billVerifier";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Read JSON body from client
    const body = await req.json();
    const { extractedText } = body;

    if (!extractedText) {
      return NextResponse.json({ 
        status: "Fake Bill", 
        reason: "No text extracted from image" 
      }, { status: 200 }); // We return 200 so the frontend can show the "Fake Bill" message
    }

    // Call logic from backend
    const result = await verifyBillFromText(extractedText);

    return NextResponse.json(result);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ 
      status: "Error", 
      reason: "Internal server error" 
    }, { status: 500 });
  }
}
