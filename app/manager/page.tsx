"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileCheck,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  IndianRupee,
} from "lucide-react"
import { DashboardShell } from "@/components/revival/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { verifications, retailers, formatPrice } from "@/lib/data"
import type { Verification } from "@/lib/data"
import { toast } from "sonner"

const navItems = [
  { label: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { label: "Verifications", href: "/manager", icon: FileCheck },
  { label: "Retailers", href: "/manager", icon: Users },
  { label: "Fraud Alerts", href: "/manager", icon: AlertTriangle },
  { label: "Analytics", href: "/manager", icon: BarChart3 },
  { label: "Settings", href: "/manager", icon: Settings },
]

export default function ManagerDashboard() {
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const pending = verifications.filter((v) => v.status === "pending")
  const approved = verifications.filter((v) => v.status === "approved")
  const rejected = verifications.filter((v) => v.status === "rejected")

  const handleApprove = (v: Verification) => {
    toast.success(`"${v.productName}" has been approved! AI voice call will notify the retailer.`)
    setSelectedVerification(null)
  }

  const handleReject = (v: Verification) => {
    toast.error(`"${v.productName}" has been rejected. Retailer will be notified.`)
    setSelectedVerification(null)
    setRejectionReason("")
  }

  const getFraudColor = (score: number) => {
    if (score <= 20) return "text-revival-badge-green"
    if (score <= 50) return "text-revival-orange"
    return "text-revival-badge-red"
  }

  const getFraudBg = (score: number) => {
    if (score <= 20) return "bg-revival-badge-green/10"
    if (score <= 50) return "bg-revival-orange/10"
    return "bg-revival-badge-red/10"
  }

  return (
    <DashboardShell title="Local Manager Panel" role="manager" navItems={navItems}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manager Dashboard</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Assigned Area: Mumbai (400001 - 400099)
            </div>
          </div>
          <Badge className="bg-revival-deep-blue text-primary-foreground">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Verified Manager
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Reviews", value: pending.length, icon: Clock, color: "text-revival-orange" },
          { label: "Approved Today", value: approved.length, icon: CheckCircle2, color: "text-revival-badge-green" },
          { label: "Rejected Today", value: rejected.length, icon: XCircle, color: "text-revival-badge-red" },
          { label: "Retailers Managed", value: retailers.length, icon: Users, color: "text-revival-deep-blue" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color === "text-revival-orange" ? "bg-revival-orange/10" : stat.color === "text-revival-badge-green" ? "bg-revival-badge-green/10" : stat.color === "text-revival-badge-red" ? "bg-revival-badge-red/10" : "bg-revival-deep-blue/10"}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Verifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-revival-orange" />
            Pending Verifications
          </CardTitle>
          <CardDescription>
            Review product listings with AI fraud analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-revival-badge-green" />
              <p className="font-medium text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                >
                  {/* Bill Preview */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileCheck className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground">{v.productName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {v.retailerName} &middot; {v.city} &middot; {v.category}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getFraudBg(v.fraudScore)} ${getFraudColor(v.fraudScore)}`}>
                        Fraud: {v.fraudScore}%
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>MRP: {formatPrice(v.mrp)}</span>
                      <span>Purchase: {formatPrice(v.purchasePrice)}</span>
                      <span className="font-medium text-revival-orange">
                        Selling: {formatPrice(v.sellingPrice)}
                      </span>
                      <span>Qty: {v.quantity}</span>
                    </div>

                    <div className="rounded-md bg-secondary/50 p-2 text-xs text-muted-foreground">
                      <strong className="text-foreground">AI Analysis:</strong>{" "}
                      {v.aiNotes}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:flex-col">
                    <Button
                      size="sm"
                      className="flex-1 bg-revival-badge-green text-primary-foreground hover:bg-revival-badge-green/90"
                      onClick={() => handleApprove(v)}
                    >
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-revival-badge-red text-revival-badge-red hover:bg-revival-badge-red/10"
                      onClick={() => setSelectedVerification(v)}
                    >
                      <ThumbsDown className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Processed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...approved, ...rejected].slice(0, 5).map((v) => (
                <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${v.status === "approved" ? "bg-revival-badge-green/10" : "bg-revival-badge-red/10"}`}>
                    {v.status === "approved" ? (
                      <CheckCircle2 className="h-4 w-4 text-revival-badge-green" />
                    ) : (
                      <XCircle className="h-4 w-4 text-revival-badge-red" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{v.productName}</p>
                    <p className="text-xs text-muted-foreground">{v.retailerName} &middot; {v.submittedAt}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize text-[10px] ${v.status === "approved" ? "border-revival-badge-green text-revival-badge-green" : "border-revival-badge-red text-revival-badge-red"}`}
                  >
                    {v.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Retailer Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retailer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {retailers.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-revival-deep-blue text-xs font-bold text-primary-foreground">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{r.shopName}</p>
                    <p className="text-xs text-muted-foreground">{r.city} &middot; {r.totalProducts} products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{r.trustScore}%</p>
                    <p className="text-[10px] text-muted-foreground">Trust Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product Listing</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting &quot;{selectedVerification?.productName}&quot;. The retailer will be notified via AI voice call.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg bg-revival-badge-red/5 p-3 text-sm">
              <p className="font-medium text-foreground">AI Analysis:</p>
              <p className="mt-1 text-xs text-muted-foreground">{selectedVerification?.aiNotes}</p>
              <p className="mt-1 text-xs font-medium text-revival-badge-red">
                Fraud Score: {selectedVerification?.fraudScore}%
              </p>
            </div>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVerification(null)}>
              Cancel
            </Button>
            <Button
              className="bg-revival-badge-red text-primary-foreground hover:bg-revival-badge-red/90"
              onClick={() => selectedVerification && handleReject(selectedVerification)}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
