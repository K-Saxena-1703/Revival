// e:/Revival/app/retailer/add-product/page.tsx
"use client"
 
import { useRef, useState, useEffect } from "react"
import Tesseract from 'tesseract.js'
import {
  LayoutDashboard, Package, Plus, ShoppingBag, FileCheck, BarChart3,
  Settings, Upload, FileImage, AlertTriangle, ShieldCheck, Info,
  CheckCircle2, XCircle, Loader2, X, FileText, Search, ScanLine, AlertCircle,
  Zap, Cpu, TrendingUp, ShieldAlert, BadgeCheck, ClipboardCheck
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
import { Progress } from "@/components/ui/progress"
 
const navItems = [
  { label: "Dashboard", href: "/retailer", icon: LayoutDashboard },
  { label: "My Products", href: "/retailer/products", icon: Package },
  { label: "Add Product", href: "/retailer/add-product", icon: Plus },
  { label: "Verifications", href: "/retailer/verifications", icon: FileCheck },
]
 
export default function AddProductPage() {
  const [form, setForm] = useState({
    productName: "", 
    category: "Unknown Category", 
    quantity: "1", 
    mrp: "", 
    purchasePrice: "", 
    sellingPrice: "", 
    description: ""
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
 
  const preprocessImage = async (imageFile: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Pass 1: Standard Balanced
        ctx.filter = "grayscale(100%) contrast(250%) brightness(110%)";
        ctx.drawImage(img, 0, 0);
        const pass1 = canvas.toDataURL("image/jpeg", 1.0);
        
        // Pass 2: High Contrast Sharpened
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "grayscale(100%) contrast(400%) brightness(120%)";
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const avg = (d[i] + d[i+1] + d[i+2]) / 3;
          const val = avg > 140 ? 255 : 0; // Aggressive thresholding
          d[i] = d[i+1] = d[i+2] = val;
        }
        ctx.putImageData(imageData, 0, 0);
        const pass2 = canvas.toDataURL("image/jpeg", 1.0);

        // Pass 3: Inverted High Detail
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "grayscale(100%) invert(100%) contrast(300%)";
        ctx.drawImage(img, 0, 0);
        const pass3 = canvas.toDataURL("image/jpeg", 1.0);

        resolve([pass1, pass2, pass3]);
      };
    });
  };

  function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
            else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
    }
    return matrix[b.length][a.length];
  }

  function getFuzzyMatch(text: string, target: string): number {
    const words = text.split(/\s+/);
    let maxSimilarity = 0;
    words.forEach(word => {
        if (word.length < 3) return;
        const dist = levenshteinDistance(word, target);
        const sim = 1 - dist / Math.max(word.length, target.length);
        if (sim > maxSimilarity) maxSimilarity = sim;
    });
    return maxSimilarity;
  }

  async function rotateImage(imageSrc: string, degrees: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        if (degrees % 180 === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
        } else {
            canvas.width = img.height;
            canvas.height = img.width;
        }
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
    });
  }

  async function cropImage(imageSrc: string, yPercent: number, heightPercent: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height * (heightPercent / 100);
        ctx.drawImage(img, 0, img.height * (yPercent / 100), img.width, canvas.height, 0, 0, img.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
    });
  }

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setOcrProgress(0);
    try {
      console.log("[VISION] Preprocessing & Rotation Detection...");
      const processedImages = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => { if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100)) },
      });

      // 1. ROTATION DETECTION (Fast Pass)
      const rotations = [0, 90, 180, 270];
      let bestRot = { deg: 0, confidence: 0 };
      for (let deg of rotations) {
        const rotated = await rotateImage(processedImages[1], deg);
        const result: any = await worker.recognize(rotated);
        if (result.data.confidence > bestRot.confidence) {
          bestRot = { deg, confidence: result.data.confidence };
        }
      }
      console.log("[ORIENTATION] Selected Angle:", bestRot.deg);

      // 2. ZONAL OCR (Header Priority)
      const orientedImg = await rotateImage(processedImages[1], bestRot.deg);
      const headerImg = await cropImage(orientedImg, 0, 25); // Top 25%
      const bodyImg = await cropImage(orientedImg, 25, 75);  // Rest
      
      console.log("[ZONAL] Processing Header (Merchant Area)...");
      let headerText = "";
      let bestHeaderConf = 0;
      const modes = [Tesseract.PSM.AUTO, Tesseract.PSM.SPARSE_TEXT, Tesseract.PSM.SINGLE_BLOCK];
      
      for (let mode of modes) {
        await worker.setParameters({ tessedit_pageseg_mode: mode });
        const result: any = await worker.recognize(headerImg);
        if (result.data.confidence > bestHeaderConf) {
          bestHeaderConf = result.data.confidence;
          headerText = result.data.text;
        }
      }

      console.log("[ZONAL] Processing Body (Item Area)...");
      await worker.setParameters({ tessedit_pageseg_mode: Tesseract.PSM.AUTO });
      const bodyResult: any = await worker.recognize(bodyImg);
      
      await worker.terminate();

      const combinedText = `[HEADER_START]\n${headerText}\n[HEADER_END]\n[BODY_START]\n${bodyResult.data.text}\n[BODY_END]`;
      
      console.log("RAW HEADER OCR:", headerText);
      console.log("[API] Calling Verification with Zonal Data...");

      const startTime = Date.now();
      const res = await fetch("/api/verify-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            extractedText: combinedText,
            imageBase64: orientedImg 
        })
      });
      console.log("[API] Request Status:", res.status, res.statusText);
      console.log("[API] Latency:", Date.now() - startTime, "ms");

      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        data = { error: "Invalid JSON response" };
      }
      
      if (!res.ok) {
        console.error("[API] Error Status:", res.status);
        const errMsg = data.error || `API Error: ${res.status}`;
        throw new Error(errMsg);
      }

      setOcrResult(data)
      
      if (data.verdict !== "invalid") {
        const primaryItem = data.extracted.line_items[0];
        const itemLabel = primaryItem?.item?.toUpperCase() || "";
        setForm({
          category: itemLabel.includes("JEWELLERY") ? "Jewellery" : 
                    itemLabel.includes("ELECTRONICS") ? "Electronics" : 
                    itemLabel.includes("KURTI") || itemLabel.includes("FASHION") || itemLabel.includes("SHIRT") ? "Fashion" :
                    itemLabel.includes("GROCERY") || itemLabel.includes("OIL") || itemLabel.includes("RICE") ? "Grocery" : 
                    itemLabel.includes("SAREE") || itemLabel.includes("TEXTILE") ? "Fashion" : "Unknown Category",
          productName: primaryItem?.item ? `${primaryItem.item}` : "Wholesale Stock",
          quantity: primaryItem?.qty?.toString() || "1",
          mrp: (parseFloat(data.extracted.total) * 1.2).toFixed(0),
          purchasePrice: data.extracted.subtotal || "",
          sellingPrice: data.extracted.total || "",
          description: data.whatsapp_message || ""
        })
        toast.success(`Audit Complete: ${data.verdict.toUpperCase()} status detected`)
      }
    } catch (err: any) {
      console.error("[VISION_CRITICAL_FAILURE]", err);
      toast.error(err.message);
    } finally { setIsVerifying(false) }
  }
 
  const authenticityRisk = ocrResult ? (ocrResult.trust_score > 85 ? "LOW" : ocrResult.trust_score > 40 ? "MEDIUM" : "HIGH") : "UNKNOWN";

  return (
    <DashboardShell title="Indian Wholesale Registry" role="retailer" navItems={navItems}>
      <div className="grid gap-6 lg:grid-cols-12 max-w-[1500px] mx-auto">
        
        {/* LEFT COMPONENT: AI DATA CAPTURE */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden border-2 shadow-2xl bg-white/40 backdrop-blur-2xl border-slate-200">
            <CardHeader className="bg-slate-900 text-white p-5 border-b">
              <div className="flex justify-between items-center">
                 <CardTitle className="flex items-center gap-3 text-lg font-black tracking-tighter italic">
                   <ClipboardCheck className="h-6 w-6 text-emerald-400" />
                   Indian Wholesale Auditor (v20.0)
                 </CardTitle>
                 <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 font-mono text-[10px]">EXPERT SYSTEM ACTIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              {!file ? (
                <div 
                  className="group relative flex flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-slate-200 bg-slate-50/50 p-20 cursor-pointer hover:bg-white hover:border-revival-deep-blue/40 transition-all duration-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-all duration-700">
                    <Upload className="h-14 w-14 text-revival-deep-blue" />
                  </div>
                  <h3 className="font-black text-3xl tracking-tighter text-slate-900 mb-2">Upload Bill/Estimate Slip</h3>
                  <p className="text-sm text-slate-500 text-center font-medium">Supports Pakka GST Bills & Kachha Estimate Slips</p>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="aspect-[3/4] relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-950 flex items-center justify-center">
                         {billPreview && <img src={billPreview} alt="Doc view" className="h-full w-full object-cover opacity-80" />}
                      </div>
 
                      <div className="md:col-span-2 space-y-5">
                        {!ocrResult && !isVerifying && (
                          <Button className="w-full bg-slate-900 hover:bg-black text-white h-20 rounded-3xl shadow-2xl group relative overflow-hidden" onClick={handleVerify}>
                            <span className="relative z-10 flex items-center justify-center gap-3 font-black italic tracking-[0.2em] text-lg">
                               <ScanLine className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                               RUN WHOSESALE AUDIT
                            </span>
                          </Button>
                        )}
 
                        {isVerifying && (
                          <div className="p-12 border-4 border-dashed rounded-[3rem] bg-white/50 flex flex-col items-center justify-center space-y-6 shadow-2xl">
                             <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
                             <div className="w-full max-w-[320px] space-y-4 text-center">
                               <div className="flex justify-between text-[11px] font-black uppercase text-slate-900 tracking-[0.3em]">
                                 <span>Auditing Stream...</span>
                                 <span>{ocrProgress}%</span>
                               </div>
                               <Progress value={ocrProgress} className="h-3 bg-slate-100" />
                            </div>
                          </div>
                        )}
 
                        {ocrResult && (
                          <div className={`p-8 rounded-[3rem] border-4 transition-all shadow-2xl relative overflow-hidden bg-white/90 backdrop-blur-xl ${
                            ocrResult.verdict === "valid" ? "border-emerald-500/50" :
                            ocrResult.verdict === "caution" ? "border-amber-500/50" : "border-rose-500/50"
                          }`}>
                            <div className="relative z-10 space-y-7">
                               {/* HEADER: STATUS & SCORE */}
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-5">
                                     <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl ${
                                       ocrResult.verdict === "valid" ? "bg-emerald-500" : ocrResult.verdict === "caution" ? "bg-amber-500" : "bg-rose-500"
                                     }`}>
                                        <ShieldCheck className="h-10 w-10 text-white" />
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Audit Consensus</p>
                                        <h4 className="text-4xl font-black uppercase italic leading-none">{ocrResult.verdict}</h4>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trust Score</p>
                                     <div className="flex items-center gap-2">
                                       <span className="text-4xl font-black tracking-tighter">{ocrResult.trust_score}%</span>
                                     </div>
                                  </div>
                               </div>

                               {/* VERIFICATION CHECKLIST */}
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                    { label: "Calculation Check", mod: ocrResult.modules.math_verifier },
                                    { label: "GST/Subtotal Check", mod: ocrResult.modules.gst_validator },
                                    { label: "Total Verification", mod: ocrResult.modules.total_verifier },
                                    { label: "Duplicate Detection", mod: ocrResult.modules.fraud_detector },
                                  ].map((check, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 italic font-bold">
                                      {check.mod.status === 'ok' ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                      ) : check.mod.status === 'warn' ? (
                                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="text-sm text-slate-900 leading-tight">{check.label}</span>
                                        <span className={`text-[10px] uppercase font-black tracking-tighter ${
                                          check.mod.status === 'ok' ? 'text-emerald-600' : check.mod.status === 'warn' ? 'text-amber-600' : 'text-rose-600'
                                        }`}>
                                          {check.mod.status.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                               </div>
                               
                               {/* ISSUES & RECOMMENDATION */}
                               <div className="space-y-4">
                                  {ocrResult.issues.length > 0 && (
                                    <div className="p-6 bg-rose-50 rounded-[2rem] border-2 border-rose-100">
                                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4" />
                                        Audit Red Flags ({ocrResult.issues.length})
                                      </p>
                                      <ul className="space-y-2">
                                        {ocrResult.issues.map((issue: string, i: number) => (
                                          <li key={i} className="text-[11px] font-bold text-rose-900 flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                                            {issue}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                       <Zap className="h-16 w-16 text-white" />
                                     </div>
                                     <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2 underline underline-offset-4">Registry Recommendation</p>
                                     <p className="text-sm text-white font-black italic leading-snug">{ocrResult.recommendation}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
 
          {/* Registry Module */}
          <Card className={`transition-all duration-1000 border-2 shadow-2xl bg-white/40 backdrop-blur-2xl border-slate-200 mt-6 ${!ocrResult ? "opacity-20 blur-lg grayscale pointer-events-none translate-y-8" : "translate-y-0"}`}>
            <CardHeader className="bg-slate-100 border-b py-6 px-10">
               <CardTitle className="text-sm flex items-center gap-3 font-black uppercase italic tracking-[0.3em] text-slate-600">
                  <Package className="h-6 w-6 text-revival-deep-blue" />
                  Product Registry (Post-Audit)
               </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Product Title</Label>
                    <Input className="h-16 text-2xl font-black bg-white shadow-2xl border-2 rounded-2xl" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Market Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                       <SelectTrigger className="h-16 font-black text-xl text-slate-800 bg-white shadow-2xl border-2 rounded-2xl"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Electronics">ELECTRONICS</SelectItem>
                          <SelectItem value="Fashion">FASHION</SelectItem>
                          <SelectItem value="Jewellery">JEWELLERY</SelectItem>
                          <SelectItem value="Grocery">GROCERY</SelectItem>
                          <SelectItem value="Unknown Category">UNKNOWN</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pricing (MRP)</Label>
                    <Input className="h-14 font-black text-xl bg-white rounded-2xl border-2" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})} />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Wholesale Cost</Label>
                    <Input className="h-14 font-black text-xl bg-slate-100 rounded-2xl border-2 opacity-50" readOnly value={form.purchasePrice} />
                 </div>
               </div>

               <div className="space-y-3">
                 <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Marketplace AI Description</Label>
                 <Textarea className="min-h-[160px] text-lg font-bold bg-white shadow-2xl border-2 rounded-[2rem] p-8" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
               </div>
            </CardContent>
          </Card>
        </div>
 
        {/* RIGHT COMPONENT: PREVIEW */}
        <div className="lg:col-span-4 space-y-6">
          <Card className={`border-0 transition-all duration-1000 overflow-hidden shadow-2xl relative rounded-[3rem] bg-white group/card ${!ocrResult ? "opacity-50 blur-sm scale-95" : ""}`}>
            <div className="aspect-[4/5] relative bg-slate-950 overflow-hidden">
               {billPreview && <img src={billPreview} alt="Neural Preview" className="h-full w-full object-cover opacity-60" />}
               <div className="absolute inset-x-0 bottom-0 z-20 p-10 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                   <Badge className="w-fit mb-3 bg-white/20 backdrop-blur-md text-white border-0">{form.category || "SCANNING..."}</Badge>
                   <h3 className="text-4xl font-black text-white leading-none tracking-tighter border-l-8 border-sky-500 pl-6">
                      {form.productName || "Deciphering..."}
                   </h3>
               </div>
            </div>

            <CardContent className="p-10 bg-white">
               <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 mb-8">
                  <p className="text-sm text-slate-600 font-black italic">"{form.description || "Synthesizing product story..."}"</p>
               </div>

               <div className="flex items-end justify-between border-b pb-8 mb-8">
                  <div className="space-y-1">
                     <p className="text-[11px] font-black text-slate-400 uppercase">Valuation</p>
                     <p className="text-6xl font-black text-slate-900 tracking-tighter">₹{form.sellingPrice || "---"}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-5">
                  <div className="p-5 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex flex-col gap-2">
                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
                     <p className="text-[10px] font-bold text-emerald-800 leading-tight">Audited via Wholesale Protocol</p>
                  </div>
                  <div className="p-5 rounded-[2rem] bg-sky-50 border-2 border-sky-100 flex flex-col gap-2">
                     <Zap className="h-4 w-4 text-sky-500" />
                     <p className="text-[10px] font-bold text-sky-800 leading-tight">Post-Scan Registry Active</p>
                  </div>
               </div>
            </CardContent>
          </Card>
 
          <Button 
            className="w-full bg-revival-orange text-white hover:bg-revival-orange/90 h-24 rounded-[3rem] text-3xl font-black italic shadow-2xl disabled:grayscale" 
            disabled={!ocrResult || (ocrResult.authenticityRisk === "HIGH")}
          >
            REGISTER PRODUCT
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
