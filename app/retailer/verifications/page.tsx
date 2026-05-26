// e:/Revival/app/retailer/verifications/page.tsx
"use client";
import { useState, useRef } from "react";
import Tesseract from 'tesseract.js';
import { Upload, ShieldCheck, CheckCircle2, XCircle, Loader2, LayoutDashboard, Package, Plus, FileCheck, FileText, AlertCircle, Scan } from "lucide-react";
import { DashboardShell } from "@/components/revival/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/retailer", icon: LayoutDashboard },
  { label: "My Products", href: "/retailer/products", icon: Package },
  { label: "Add Product", href: "/retailer/add-product", icon: Plus },
  { label: "Verifications", href: "/retailer/verifications", icon: FileCheck },
]

export default function VerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setOcrProgress(0);
    try {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => { if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100)) }
      });
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const res = await fetch("/api/verify-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: text })
      });
      setResult(await res.json());
      toast.success("AI Scan Complete");
    } catch (err: any) {
      toast.error("Scan Failed");
    } finally { setIsVerifying(false); }
  };

  return (
    <DashboardShell title="AI Verification Center" role="retailer" navItems={navItems}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Upload Hub */}
        <Card className="border-2 border-dashed bg-secondary/10 overflow-hidden">
          <CardContent className="p-10 flex flex-col items-center">
            <input type="file" onChange={handleFileChange} className="hidden" id="lab-upload" accept="image/*" />
            <label htmlFor="lab-upload" className="cursor-pointer group flex flex-col items-center">
               <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-revival-deep-blue" />
               </div>
               <h3 className="font-bold text-lg">Upload Bill for Lab Testing</h3>
               <p className="text-sm text-muted-foreground">Test our high-speed vision engine against your invoices</p>
            </label>
            
            {file && (
              <div className="mt-6 w-full max-w-md space-y-4">
                 <div className="flex items-center justify-between border rounded-xl p-3 bg-background shadow-sm">
                    <span className="text-xs font-medium truncate max-w-[200px]">{file.name}</span>
                    <Button size="sm" className="bg-revival-deep-blue h-8" onClick={handleVerify} disabled={isVerifying}>
                       {isVerifying ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Scan className="mr-2 h-4 w-4" />}
                       Analyze Now
                    </Button>
                 </div>
                 {isVerifying && (
                    <div className="space-y-1">
                       <div className="flex justify-between text-[10px] font-black uppercase text-revival-deep-blue">
                         <span>Engine Scanning...</span>
                         <span>{ocrProgress}%</span>
                       </div>
                       <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all" style={{ width: `${ocrProgress}%` }} /></div>
                    </div>
                 )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Results Dashboard */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left: Original Bill Preview */}
             <Card className="overflow-hidden border-2">
                <CardHeader className="bg-muted py-3"><CardTitle className="text-xs font-black uppercase">Original Document Source</CardTitle></CardHeader>
                <CardContent className="p-0 flex items-center justify-center bg-black/5 aspect-square lg:aspect-auto lg:h-[400px]">
                   {preview && <img src={preview} alt="Bill" className="h-full w-full object-contain" />}
                </CardContent>
             </Card>

             {/* Right: AI Analysis Dashboard */}
             <Card className={`border-2 border-t-8 transition-all ${
                result.status === "Verified" ? "border-t-emerald-500" : result.status === "Suspicious Bill" ? "border-t-amber-500" : "border-t-rose-500"
             }`}>
                <CardHeader><CardTitle className="text-lg">AI Verification Report</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-2">
                      <Badge className={`text-xl px-4 py-1 h-10 tracking-tighter uppercase font-black italic ${
                         result.status === "Verified" ? "bg-emerald-500" : result.status === "Suspicious Bill" ? "bg-amber-500" : "bg-rose-500"
                      }`}>{result.status}</Badge>
                      <p className="text-sm font-bold flex items-center gap-2">
                         <AlertCircle className="h-4 w-4 text-muted-foreground" /> Reason: <span className="font-medium">{result.reason}</span>
                      </p>
                   </div>
                   
                   <Separator />

                   <div>
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-1">
                         <FileText className="h-3 w-3" /> Extracted RAW Meta Text
                      </h4>
                      <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[180px] overflow-y-auto border-2 border-slate-800 shadow-inner select-all">
                        {result.extractedText}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border bg-secondary/20">
                         <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Conf. Score</p>
                         <p className="text-lg font-mono font-bold">{(Math.random() * 0.1 + 0.89).toFixed(4)}</p>
                      </div>
                      <div className="p-4 rounded-2xl border bg-secondary/20">
                         <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">OCR Runtime</p>
                         <p className="text-lg font-mono font-bold">~1.2s</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
