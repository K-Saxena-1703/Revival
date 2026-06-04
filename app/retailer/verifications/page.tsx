"use client"

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileCheck,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { DashboardShell } from "@/components/revival/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { orders, products, verifications, formatPrice } from "@/lib/data"

const navItems = [
  { label: "Dashboard", href: "/retailer", icon: LayoutDashboard },
  { label: "My Products", href: "/retailer/products", icon: Package },
  { label: "Add Product", href: "/retailer/add-product", icon: Plus },
  { label: "Orders", href: "/retailer/orders", icon: ShoppingBag },
  { label: "Verifications", href: "/retailer/verifications", icon: FileCheck },
  { label: "Analytics", href: "/retailer/analytics", icon: BarChart3 },
  { label: "Settings", href: "/retailer/settings", icon: Settings },
]

export default function RetailerDashboard() {
  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(287500),
      change: "+12.5%",
      trend: "up" as const,
      icon: IndianRupee,
    },
    {
      label: "Total Orders",
      value: "156",
      change: "+8.3%",
      trend: "up" as const,
      icon: ShoppingBag,
    },
    {
      label: "Active Products",
      value: "45",
      change: "+3",
      trend: "up" as const,
      icon: Package,
    },
    {
      label: "Page Views",
      value: "12,480",
      change: "-2.1%",
      trend: "down" as const,
      icon: Eye,
    },
  ]

  const recentOrders = orders.slice(0, 5)
  const pendingVerifications = verifications.filter((v) => v.status === "pending")

  return (
    <DashboardShell title="Retailer Dashboard" role="retailer" navItems={navItems}>
      {/* Welcome */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, Rajesh!</h2>
          <p className="text-sm text-muted-foreground">
            {"Here's what's happening with your store today"}
          </p>
        </div>
        <Button className="bg-revival-orange text-accent-foreground hover:bg-revival-orange/90" asChild>
          <Link href="/retailer/add-product">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-revival-deep-blue/10">
                  <stat.icon className="h-5 w-5 text-revival-deep-blue" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.trend === "up"
                      ? "text-revival-badge-green"
                      : "text-revival-badge-red"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link
              href="/retailer/orders"
              className="text-sm text-revival-orange hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {order.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.id} &middot; {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        order.status === "delivered"
                          ? "border-revival-badge-green text-revival-badge-green"
                          : order.status === "pending"
                            ? "border-revival-orange text-revival-orange"
                            : "border-revival-light-blue text-revival-light-blue"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Product Verifications</CardTitle>
            <Link
              href="/retailer/verifications"
              className="text-sm text-revival-orange hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {[
                {
                  icon: Clock,
                  label: "Pending",
                  count: verifications.filter((v) => v.status === "pending").length,
                  color: "text-revival-orange",
                },
                {
                  icon: CheckCircle2,
                  label: "Approved",
                  count: verifications.filter((v) => v.status === "approved").length,
                  color: "text-revival-badge-green",
                },
                {
                  icon: XCircle,
                  label: "Rejected",
                  count: verifications.filter((v) => v.status === "rejected").length,
                  color: "text-revival-badge-red",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-lg border border-border p-3 text-center"
                >
                  <item.icon className={`mb-1 h-5 w-5 ${item.color}`} />
                  <span className="text-lg font-bold text-foreground">{item.count}</span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {verifications.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      v.status === "approved"
                        ? "bg-revival-badge-green/10"
                        : v.status === "rejected"
                          ? "bg-revival-badge-red/10"
                          : "bg-revival-orange/10"
                    }`}
                  >
                    {v.status === "approved" ? (
                      <CheckCircle2 className="h-4 w-4 text-revival-badge-green" />
                    ) : v.status === "rejected" ? (
                      <XCircle className="h-4 w-4 text-revival-badge-red" />
                    ) : (
                      <Clock className="h-4 w-4 text-revival-orange" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{v.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Fraud Score: {v.fraudScore}% &middot; {v.submittedAt}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      v.status === "approved"
                        ? "border-revival-badge-green text-revival-badge-green"
                        : v.status === "rejected"
                          ? "border-revival-badge-red text-revival-badge-red"
                          : "border-revival-orange text-revival-orange"
                    }`}
                  >
                    {v.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {pendingVerifications.length > 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-revival-orange/30 bg-revival-orange/5 p-4">
          <AlertCircle className="h-5 w-5 text-revival-orange" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {pendingVerifications.length} product(s) pending verification
            </p>
            <p className="text-xs text-muted-foreground">
              Your submitted products are being reviewed by our AI system and local managers
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
