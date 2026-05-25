"use client"
 
import { useRef, useState } from "react"
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingBag,
  FileCheck,
  BarChart3,
  Settings,
  Upload,
  FileImage,
  AlertTriangle,
  ShieldCheck,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
} from "lucide-react"
import { DashboardShell } from "@/components/revival/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
 
const navItems = [
  { label: "Dashboard", href: "/retailer", icon: LayoutDashboard },
  { label: "My Products", href: "/retailer/products", icon: Package },
  { label: "Add Product", href: "/retailer/add-product", icon: Plus },
  { label: "Orders", href: "/retailer/orders", icon: ShoppingBag },
  { label: "Verifications", href: "/retailer/verifications", icon: FileCheck },
  { label: "Analytics", href: "/retailer/analytics", icon: BarChart3 },
  { label: "Settings", href: "/retailer/settings", icon: Settings },
]
 
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
 
export default function AddProductPage() {
  const [form, setForm] = useState({
    productName: "",
    category: "",
    quantity: "",
    mrp: "",
    purchasePrice: "",
    sellingPrice: "",
    description: "",
  })
 
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<"Verified" | "Fake Bill" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
 
    if (!selected) return
 
    if (!ALLOWED_TYPES.includes(selected.type)) {
      toast.error("Invalid file type. Please upload PDF, JPG, PNG, or WEBP.")
      e.target.value = ""
      return
    }
 
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 10MB.")
      e.target.value = ""
      return
    }
 
    setFile(selected)
    setResult(null) // Reset result when a new file is chosen
  }
 
  const handleRemoveFile = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }
 
  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a purchase bill before submitting.")
      return
    }
 
    setIsSubmitting(true)
    setResult(null)
 
    try {
      const formData = new FormData()
      formData.append("bill", file)
 
      const res = await fetch("/api/verify-bill", {
        method: "POST",
        body: formData,
      })
 
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Verification failed.")
      }
 
      const data: { status: "Verified" | "Fake Bill"; reason?: string } = await res.json()
 
      setResult(data.status)
 
      if (data.status === "Verified") {
        toast.success("Bill verified successfully! Submitted for manager approval.")
      } else {
        toast.error(`Verification Failed: ${data.reason ?? "Suspicious bill detected."}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }
 
  return (
    <DashboardShell title="Add New Product" role="retailer" navItems={navItems}>
      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-revival-deep-blue/20 bg-revival-deep-blue/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-revival-deep-blue" />
        <div>
          <p className="text-sm font-medium text-foreground">
            AI-Powered Verification Process
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Upload your wholesaler/shopkeeper bill along with product details. Our AI will verify
            the bill using OCR, detect any manipulation, and a local manager will give final
            approval.
          </p>
        </div>
      </div>
 
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCheck className="h-4 w-4 text-revival-deep-blue" />
                Step 1: Upload Purchase Bill
              </CardTitle>
              <CardDescription>
                Upload the original bill from your wholesaler or shopkeeper (PDF, JPG, PNG, WEBP)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Drop zone */}
              <div
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 transition-colors hover:border-revival-deep-blue/40 hover:bg-revival-deep-blue/5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drop your bill here or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports PDF, JPG, PNG, WEBP (max 10MB)
                </p>
 
                {/* Hidden real input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
 
                {/* Visible styled button */}
                <div
                  className="mt-4 flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  <FileImage className="h-4 w-4" />
                  Choose File
                </div>
              </div>
 
              {/* Selected file display */}
              {file && (
                <div className="mt-3 flex items-center justify-between rounded-lg border bg-secondary/50 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileImage className="h-4 w-4 shrink-0 text-revival-deep-blue" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 shrink-0 rounded-full p-0.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
 
              {/* Warning */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-revival-orange/5 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-revival-orange" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Important:</p>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    <li>Bill must be original, not AI-generated</li>
                    <li>Product name and price must match the bill</li>
                    <li>Fake bills will result in account suspension</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
 
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-revival-deep-blue" />
                Step 2: Product Details
              </CardTitle>
              <CardDescription>
                Enter accurate product information matching your purchase bill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., boAt Rockerz 450 Bluetooth Headphone"
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  />
                </div>
 
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Kitchen</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="sports">Sports & Fitness</SelectItem>
                      <SelectItem value="books">Books & Stationery</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
 
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 50"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
              </div>
 
              <Separator />
 
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP ({"₹"})</Label>
                  <Input
                    id="mrp"
                    type="number"
                    placeholder="e.g., 3990"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  />
                </div>
 
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ({"₹"})</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="As on bill"
                    value={form.purchasePrice}
                    onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">Must match the bill amount</p>
                </div>
 
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price on Revival ({"₹"})</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="Your selling price"
                    value={form.sellingPrice}
                    onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
 
             {/* Product Images */}

<div className="space-y-2">

  <Label>Product Images</Label>

  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">

    <input
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={(e) => {
        console.log(e.target.files)
      }}
    />

    <Plus className="h-8 w-8 text-muted-foreground" />

    <p className="mt-2 text-sm text-muted-foreground">
      Upload Product Images
    </p>

  </label>

</div>
            </CardContent>
          </Card>
        </div>
 
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="text-foreground truncate max-w-[140px] text-right">
                    {form.productName || "Not entered"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-foreground capitalize">
                    {form.category || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-foreground">{form.quantity || "0"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MRP</span>
                  <span className="text-foreground">{"₹"}{form.mrp || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="text-foreground">{"₹"}{form.purchasePrice || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selling Price</span>
                  <span className="font-medium text-revival-orange">
                    {"₹"}{form.sellingPrice || "0"}
                  </span>
                </div>
                {form.mrp && form.sellingPrice && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-bold text-revival-badge-green">
                        {Math.round(
                          ((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100
                        )}
                        % OFF
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
 
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-revival-badge-green" />
                <span className="font-medium text-foreground">AI Verification</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>OCR bill reading</li>
                <li>Fake bill detection</li>
                <li>Price anomaly check</li>
                <li>Fraud score generation</li>
              </ul>
            </CardContent>
          </Card>
 
          {/* Submit button */}
          <Button
            className="w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90 disabled:opacity-60"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
 
          {/* Verification result */}
          {result && (
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                result === "Verified"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {result === "Verified" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
              )}
              <div>
                <p className="text-sm font-bold">{result}</p>
                <p className="text-xs mt-0.5 opacity-80">
                  {result === "Verified"
                    ? "Bill accepted. Awaiting manager approval."
                    : "Bill rejected. Please upload a valid original bill."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}