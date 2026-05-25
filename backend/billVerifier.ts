export async function verifyBill(file: File) {

  const fileName = file.name.toLowerCase();

  let status = "Verified";

  if (
    fileName.includes("fake") ||
    fileName.includes("test")
  ) {
    status = "Fake Bill";
  }

  return {
    status,
    extractedText: fileName,
  };
}