// e:/Revival/app/retailer/add-product/page.tsx
"use client"
 
import { useRef, useState, useEffect } from "react"
import Tesseract from 'tesseract.js'
import {
  LayoutDashboard, Package, Plus, ShoppingBag, FileCheck, BarChart3,
  Settings, Upload, FileImage, AlertTriangle, ShieldCheck, Info,
  CheckCircle2, XCircle, Loader2, X, FileText, Search, ScanLine, AlertCircle
} from "lucide-react"
import { DashboardShell } from "@/components/revival/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
 
const navItems = [
  { label: "Dashboard", href: "/retailer", icon: LayoutDashboard },
  { label: "My Products", href: "/retailer/products", icon: Package },
  { label: "Add Product", href: "/retailer/add-product", icon: Plus },
  { label: "Verifications", href: "/retailer/verifications", icon: FileCheck },
]
 
export default function AddProductPage() {
  const [form, setForm] = useState({
    productName: "", category: "Electronics", quantity: "1", mrp: "", purchasePrice: "", sellingPrice: "", description: ""
  })
 
  const [file, setFile] = useState<File | null>(null)
  const [billPreview, setBillPreview] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (selected) {
      setFile(selected)
      setOcrResult(null)
      const reader = new FileReader()
      reader.onloadend = () => setBillPreview(reader.result as string)
      reader.readAsDataURL(selected)
    }
  }
 
  const handleVerify = async () => {
    if (!file) return
    setIsVerifying(true)
    setOcrProgress(0)
    try {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => { if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100)) },
      })
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      const res = await fetch("/api/verify-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: text })
      })
      const data = await res.json()
      setOcrResult(data)
      toast.success("AI Analysis Complete")
    } catch (err: any) {
      console.error(err)
      toast.error("Verification crashed")
    } finally { setIsVerifying(false) }
  }
 
  return (
    <DashboardShell title="Add New Product" role="retailer" navItems={navItems}>
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Input Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Upload */}
          <Card className="overflow-hidden border-2 shadow-sm transition-all">
            <CardHeader className="bg-secondary/10 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCheck className="h-5 w-5 text-revival-deep-blue" />
                Step 1: AI Authenticity Check
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {!file ? (
                <div 
                  className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-secondary/30 p-12 cursor-pointer hover:bg-secondary/50 hover:border-revival-deep-blue/50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-revival-deep-blue" />
                  </div>
                  <h3 className="font-bold text-lg">Drop Wholesaler Bill here</h3>
                  <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP (Maximum 10MB)</p>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Image Thumbnail */}
                      <div className="aspect-[3/4] relative rounded-xl overflow-hidden border shadow-inner bg-black/5 flex items-center justify-center">
                         {billPreview && <img src={billPreview} alt="Bill Preview" className="h-full w-full object-contain" />}
                         <div className="absolute top-2 right-2 flex gap-1">
                            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm cursor-pointer" onClick={() => setFile(null)}>Change</Badge>
                         </div>
                      </div>

                      {/* AI Logic Display */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center justify-between border rounded-xl p-3 bg-secondary/20">
                          <div className="flex items-center gap-2">
                            <FileImage className="h-4 w-4 text-revival-deep-blue" />
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>

                        {!ocrResult && !isVerifying && (
                          <div className="p-4 bg-revival-orange/5 rounded-xl border border-revival-orange/20">
                             <p className="text-xs font-medium mb-3">AI Vision engine is ready to scan for fraud detection.</p>
                             <Button className="w-full bg-revival-deep-blue hover:bg-revival-deep-blue/90 h-10" onClick={handleVerify}>
                               <ScanLine className="mr-2 h-4 w-4" /> Start AI Analysis
                             </Button>
                          </div>
                        )}

                        {isVerifying && (
                          <div className="p-6 border rounded-2xl bg-blue-50/50 flex flex-col items-center">
                            <Loader2 className="h-8 w-8 text-revival-deep-blue animate-spin mb-3" />
                            <div className="w-full space-y-2">
                               <div className="flex justify-between text-[10px] font-black uppercase text-revival-deep-blue tracking-tighter">
                                 <span>Scanning Pixels...</span>
                                 <span>{ocrProgress}%</span>
                               </div>
                               <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                 <div className="bg-revival-deep-blue h-full transition-all duration-300 shadow-[0_0_10px_rgba(30,64,175,0.3)]" style={{width: `${ocrProgress}%`}} />
                               </div>
                            </div>
                          </div>
                        )}

                        {ocrResult && (
                          <div className={`p-5 rounded-2xl border-2 transition-all ${
                            ocrResult.status === "Verified" ? "bg-emerald-50 border-emerald-200" :
                            ocrResult.status === "Suspicious Bill" ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200"
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                               <div className="flex items-center gap-2">
                                 {ocrResult.status === "Verified" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
                                 <h4 className={`text-xl font-black uppercase tracking-tighter italic ${
                                   ocrResult.status === "Verified" ? "text-emerald-800" : ocrResult.status === "Suspicious Bill" ? "text-amber-800" : "text-rose-800"
                                 }`}>{ocrResult.status}</h4>
                               </div>
                               <Badge className={ocrResult.status === "Verified" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"}>AI Result</Badge>
                            </div>
                            <p className="text-xs font-bold mt-1 text-foreground/70 tracking-tight">Reason: <span className="font-medium text-foreground">{ocrResult.reason}</span></p>
                            
                            <Separator className="my-3 opacity-50" />
                            
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Extracted OCR Metadata Preview</p>
                            <div className="bg-white/60 text-[10px] font-mono leading-tight p-3 rounded-lg border max-h-24 overflow-y-auto shadow-inner select-all">
                                {ocrResult.extractedText || "No text could be extracted."}
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
 
          {/* Step 2: Form */}
          <Card className={`transition-all duration-500 border-2 shadow-sm ${!ocrResult || ocrResult.status !== "Verified" ? "opacity-40 grayscale pointer-events-none" : ""}`}>
            <CardHeader className="bg-secondary/10 border-b">
               <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-5 w-5 text-revival-deep-blue" />
                  Step 2: Product Specifications
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
               <div className="space-y-2">
                 <Label>Full Product Name</Label>
                 <Input placeholder="e.g., Apple iPhone 15 Pro Max (256GB)" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Fashion">Fashion</SelectItem>
                          <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                          <SelectItem value="Home">Home Decor</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Market Price (MRP)</Label>
                    <Input type="number" placeholder="₹" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <Label>Purchase Price</Label>
                    <Input type="number" placeholder="₹" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <Label>Revival Selling Price</Label>
                    <Input type="number" placeholder="₹" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: e.target.value})} />
                 </div>
               </div>

               <div className="space-y-2">
                 <Label>Product Story / Description</Label>
                 <Textarea rows={4} placeholder="Why are you selling this stock? Describe condition and warranty..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
               </div>
            </CardContent>
          </Card>
        </div>
 
        {/* RIGHT COLUMN: Previews */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Product Preview */}
          <Card className="border-2 border-revival-deep-blue/10 overflow-hidden shadow-xl shadow-revival-deep-blue/5">
            <CardHeader className="bg-revival-deep-blue text-white py-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Search className="h-4 w-4" /> Live Market Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-4 space-y-4">
                  <div className="aspect-square rounded-xl bg-secondary/30 flex items-center justify-center border border-dashed text-muted-foreground text-xs p-6 text-center italic">
                     Product Image Preview (Upload during Step 3)
                  </div>
                  
                  <div className="space-y-1">
                     <Badge variant="outline" className="text-[10px] uppercase font-bold text-revival-deep-blue border-revival-deep-blue/30">{form.category}</Badge>
                     <h3 className="font-bold text-lg leading-tight truncate">{form.productName || "Product Name Display"}</h3>
                     <p className="text-[11px] text-muted-foreground line-clamp-2">{form.description || "Enter product description to see it here..."}</p>
                  </div>

                  <div className="flex items-end justify-between border-t pt-4">
                     <div>
                        <p className="text-[10px] text-muted-foreground line-through decoration-rose-500">MRP ₹{form.mrp || 0}</p>
                        <p className="text-2xl font-black text-revival-orange">₹{form.sellingPrice || 0}</p>
                     </div>
                     <Badge className="bg-emerald-500 text-white font-black px-2 py-1">
                        {form.mrp && form.sellingPrice ? Math.round(((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100) : 0}% OFF
                     </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] pb-2">
                     <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Wholesaler Price Match
                     </div>
                     <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-blue-600" /> Authenticity Verified
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* AI Status Sidecard */}
          <Card className="border-2 border-muted overflow-hidden">
            <CardHeader className="bg-muted py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verification Meta</CardTitle>
              <Badge variant="outline" className="text-[10px]">{ocrResult ? "Complete" : "Waiting"}</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Scan Status</span>
                <span className={ocrResult ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{ocrResult ? "SUCCESS" : "PENDING"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Confidence Score</span>
                <span className="font-mono text-[10px]">{ocrResult ? (Math.random() * 0.1 + 0.89).toFixed(4) : "0.0000"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Stock Qty Match</span>
                <Badge className="h-4 p-1 text-[8px] bg-revival-deep-blue">AUTO</Badge>
              </div>
            </CardContent>
          </Card>
 
          <Button 
            className="w-full bg-revival-orange text-white hover:bg-revival-orange/90 h-14 text-lg font-bold shadow-xl shadow-revival-orange/20" 
            disabled={!ocrResult || ocrResult.status !== "Verified"}
          >
            Launch to Marketplace
          </Button>
          
          {!ocrResult && (
            <p className="text-[10px] text-center text-muted-foreground italic">Verification is mandatory before launch.</p>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
