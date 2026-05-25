import { verifyBill } from "@/backend/billVerifier";

export async function POST(req: Request) {

  try {

    const data = await req.formData();

    const file = data.get("bill") as File;

    const result = await verifyBill(file);

    return Response.json(result);

  } catch (error) {

    console.log(error);

    return Response.json({
      status: "Error",
    });
  }
}