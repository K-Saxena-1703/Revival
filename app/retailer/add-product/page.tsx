"use client"

import { useState } from "react"
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

  const handleSubmit = () => {
    toast.success("Product submitted for verification! Our AI system will analyze your bill and a local manager will review it.")
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
            Upload your wholesaler/shopkeeper bill along with product details. Our AI will verify the bill using OCR, detect any manipulation, and a local manager will give final approval.
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
                Upload the original bill from your wholesaler or shopkeeper (PDF or Image)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8">
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drop your bill here or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports PDF, JPG, PNG (max 10MB)
                </p>
                <Button variant="outline" className="mt-4">
                  <FileImage className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>

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
                    onChange={(e) =>
                      setForm({ ...form, productName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, purchasePrice: e.target.value })
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must match the bill amount
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price on Revival ({"₹"})</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="Your selling price"
                    value={form.sellingPrice}
                    onChange={(e) =>
                      setForm({ ...form, sellingPrice: e.target.value })
                    }
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* Product Images */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 transition-colors hover:border-revival-deep-blue/30"
                    >
                      <div className="text-center">
                        <Plus className="mx-auto h-5 w-5 text-muted-foreground" />
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          Image {i}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <span className="text-foreground">
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
                  <span className="text-foreground">
                    {form.quantity || "0"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MRP</span>
                  <span className="text-foreground">
                    {"₹"}{form.mrp || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="text-foreground">
                    {"₹"}{form.purchasePrice || "0"}
                  </span>
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
                          ((Number(form.mrp) - Number(form.sellingPrice)) /
                            Number(form.mrp)) *
                            100
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

          <Button
            className="w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
            size="lg"
            onClick={handleSubmit}
          >
            Submit for Verification
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
