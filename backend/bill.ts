// ============================================================
// types/bill.ts
// Defines the shape of all data used in bill verification
// ============================================================

/**
 * A single item/product on the bill
 */
export interface BillItem {
  productName: string;   // Name of the product (e.g., "Rice 1kg")
  quantity: number;      // How many units purchased
  price: number;         // Price per unit (in ₹, before GST)
  total: number;         // Total amount charged for this item
  gstPercentage: number; // GST rate applied (e.g., 5, 12, 18, 28)
}

/**
 * The full bill sent by the frontend for verification
 */
export interface Bill {
  retailerName: string;  // Name of the shop/retailer
  billDate: string;      // Date of the bill (ISO string or readable date)
  items: BillItem[];     // List of products on the bill
}

/**
 * The response returned after verifying the bill
 */
export interface VerificationResult {
  status: "Valid Bill" | "Incorrect Bill"; // Overall verdict
  errors: string[];                        // List of detected problems
  suggestions: string[];                   // Helpful advice for the user
}
