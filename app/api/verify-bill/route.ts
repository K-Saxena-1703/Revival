// e:/Revival/app/api/verify-bill/route.ts
import { verifyBill } from "@/backend/billVerifier";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // CRITICAL RUNTIME VERIFICATION
  console.log("=========================================");
  console.log("ROUTE FILE EXECUTED: /api/verify-bill");
  console.log("TIMESTAMP:", new Date().toISOString());
  console.log("=========================================");

  try {
    let body: any;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ success: false, error: "MALFORMED_JSON_REQUEST" }, { status: 400 });
    }

    const { extractedText, imageBase64 } = body;
    
    // DETAILED RUNTIME AUDIT
    console.log("API RECEIVED TEXT:", extractedText || "[EMPTY]");
    console.log("TEXT LENGTH:", extractedText?.length || 0);
    console.log("IMAGE PRESENT:", !!imageBase64);

    if (!process.env.GOOGLE_API_KEY) {
        console.error("VISION API KEY MISSING");
        return NextResponse.json({ success: false, error: "VISION API KEY MISSING" }, { status: 401 });
    }
    
    try {
        const result = await verifyBill(extractedText || "", imageBase64);
        console.log("EXECUTION SUCCESS");
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("EXECUTION ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error("CRITICAL_FAULT:", error);
    return NextResponse.json({ success: false, error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
