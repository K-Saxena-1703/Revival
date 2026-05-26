// e:/Revival/backend/billVerifier.ts

/**
 * AI-powered analysis for bill text content.
 * Prioritizes detection of GST, Invoice No, Amount, and Fraud keywords.
 */
export async function verifyBillFromText(text: string) {
  const normalizedText = text.toLowerCase();
  const trimmedText = text.trim();

  // 1. Fundamental Checks for FAKE BILL
  if (trimmedText.length < 50) {
    return {
      status: "Fake Bill",
      reason: "Insufficient text content detected (Empty or unrelated image)",
      extractedText: text
    };
  }

  // 1.1 Detection Patterns for Invoice Existence
  const hasGst = /gstin|gst no|gst\s*number/i.test(normalizedText) || 
                 /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/i.test(normalizedText);
  
  const hasInvoiceNo = /invoice\s*no|bill\s*no|inv\s*no|bill\s*number|receipt\s*id/i.test(normalizedText);
  
  const hasAmount = /total|amount|grand\s*total|net\s*payable|rs\.?\s*\d+/i.test(normalizedText);

  const hasShopHeader = /pvt\s*ltd|limited|address|store|shop|mall|enterprise|inc\.|co\.|contact/i.test(normalizedText);

  const hasInvoiceStructure = /description|hsn|sac|qty|quantity|rate|taxable|cgst|sgst|igst/i.test(normalizedText);

  // 2. DETECTION FOR FAKE BILL (Unrelated content)
  // If no business/invoice keywords are found at all, it's likely a selfie or random photo
  const invoiceKeywordsCount = [hasGst, hasInvoiceNo, hasAmount, hasInvoiceStructure, hasShopHeader].filter(Boolean).length;
  
  if (invoiceKeywordsCount === 0) {
    return {
      status: "Fake Bill",
      reason: "No invoice metrics detected (Unrelated image or random photo)",
      extractedText: text
    };
  }

  // 3. DETECTION FOR SUSPICIOUS BILL
  const suspiciousKeywords = [
    "duplicate copy", 
    "sample", 
    "edited", 
    "estimate", 
    "thermal receipt", 
    "training copy", 
    "handwritten",
    "temporary"
  ];
  
  const foundSuspicious = suspiciousKeywords.filter(word => normalizedText.includes(word));

  if (foundSuspicious.length > 0) {
    return {
      status: "Suspicious Bill",
      reason: `Fraud indicators detected: ${foundSuspicious.join(", ")}`,
      extractedText: text
    };
  }

  // Check for incomplete details
  if (invoiceKeywordsCount > 0 && invoiceKeywordsCount < 3) {
    return {
      status: "Suspicious Bill",
      reason: "Incomplete invoice data (Missing GST, Invoice No, or proper Store Header)",
      extractedText: text
    };
  }

  // 4. DETECTION FOR VERIFIED
  // Needs all primary invoice components and clean structure
  if (hasGst && hasAmount && (hasInvoiceNo || hasInvoiceStructure) && hasShopHeader) {
    return {
      status: "Verified",
      reason: "Valid GST invoice detected with complete details",
      extractedText: text
    };
  }

  // Fallback for bills that look like bills but miss 1-2 small strict patterns
  return {
    status: "Suspicious Bill",
    reason: "Document detected as bill but missing verified GST/Taxation headers",
    extractedText: text
  };
}
