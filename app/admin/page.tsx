"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Package,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  TrendingUp,
  IndianRupee,
  Store,
  MapPin,
  UserCheck,
  UserX,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { DashboardShell } from "@/components/revival/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { retailers, products, orders, verifications, formatPrice } from "@/lib/data"
import { toast } from "sonner"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin", icon: Users },
  { label: "Products", href: "/admin", icon: Package },
  { label: "Verifications", href: "/admin", icon: ShieldCheck },
  { label: "Fraud Center", href: "/admin", icon: AlertTriangle },
  { label: "Analytics", href: "/admin", icon: BarChart3 },
  { label: "Settings", href: "/admin", icon: Settings },
]

// Chart data
const revenueData = [
  { month: "Sep", revenue: 180000, orders: 420 },
  { month: "Oct", revenue: 245000, orders: 580 },
  { month: "Nov", revenue: 310000, orders: 720 },
  { month: "Dec", revenue: 420000, orders: 1050 },
  { month: "Jan", revenue: 380000, orders: 890 },
  { month: "Feb", revenue: 490000, orders: 1200 },
]

const categoryData = [
  { name: "Electronics", value: 35, fill: "#1a3a5c" },
  { name: "Fashion", value: 28, fill: "#e87c3e" },
  { name: "Home", value: 18, fill: "#3a6a8c" },
  { name: "Beauty", value: 12, fill: "#c56a30" },
  { name: "Other", value: 7, fill: "#7a9ab5" },
]

const cityData = [
  { city: "Mumbai", retailers: 245, sales: 890000 },
  { city: "Delhi", retailers: 198, sales: 720000 },
  { city: "Bangalore", retailers: 167, sales: 650000 },
  { city: "Hyderabad", retailers: 134, sales: 480000 },
  { city: "Chennai", retailers: 112, sales: 390000 },
  { city: "Pune", retailers: 98, sales: 340000 },
]

const platformManagers = [
  {
    id: "m1",
    name: "Arjun Mehta",
    area: "Mumbai West",
    retailers: 45,
    approvals: 128,
    rejections: 12,
    status: "active",
  },
  {
    id: "m2",
    name: "Sneha Patel",
    area: "Delhi NCR South",
    retailers: 38,
    approvals: 98,
    rejections: 8,
    status: "active",
  },
  {
    id: "m3",
    name: "Karthik Iyer",
    area: "Bangalore North",
    retailers: 52,
    approvals: 145,
    rejections: 15,
    status: "active",
  },
  {
    id: "m4",
    name: "Ritu Verma",
    area: "Hyderabad Central",
    retailers: 29,
    approvals: 76,
    rejections: 22,
    status: "suspended",
  },
]

export default function AdminDashboard() {
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "ban" | "verify" | "suspend"
    targetName: string
    targetId: string
  } | null>(null)

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalProducts = products.length
  const totalRetailers = retailers.length
  const pendingVerifications = verifications.filter((v) => v.status === "pending").length
  const highFraudAlerts = verifications.filter((v) => v.fraudScore > 50).length

  const handleAction = () => {
    if (!confirmAction) return
    const action = confirmAction.type === "ban" ? "banned" : confirmAction.type === "verify" ? "verified" : "suspended"
    toast.success(`${confirmAction.targetName} has been ${action}.`)
    setConfirmAction(null)
  }

  return (
    <DashboardShell title="Super Admin Panel" role="admin" navItems={navItems}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Platform Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor all platform activity, users, and analytics
            </p>
          </div>
          <Badge className="bg-revival-deep-blue text-primary-foreground">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Super Admin
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total Revenue",
            value: formatPrice(totalRevenue),
            change: "+18.2%",
            up: true,
            icon: IndianRupee,
            color: "bg-revival-badge-green/10 text-revival-badge-green",
          },
          {
            label: "Active Products",
            value: totalProducts.toLocaleString(),
            change: "+24",
            up: true,
            icon: Package,
            color: "bg-revival-deep-blue/10 text-revival-deep-blue",
          },
          {
            label: "Retailers",
            value: totalRetailers.toLocaleString(),
            change: "+12",
            up: true,
            icon: Store,
            color: "bg-revival-orange/10 text-revival-orange",
          },
          {
            label: "Pending Reviews",
            value: pendingVerifications.toString(),
            change: "-3",
            up: false,
            icon: Clock,
            color: "bg-revival-orange/10 text-revival-orange",
          },
          {
            label: "Fraud Alerts",
            value: highFraudAlerts.toString(),
            change: "+1",
            up: true,
            icon: AlertTriangle,
            color: "bg-revival-badge-red/10 text-revival-badge-red",
          },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.color.split(" ")[0]}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color.split(" ")[1]}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up && kpi.label !== "Fraud Alerts" ? "text-revival-badge-green" : "text-revival-badge-red"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="mt-3 text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Center</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-revival-orange" />
                  Revenue & Orders Trend
                </CardTitle>
                <CardDescription>Last 6 months performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#1a3a5c" },
                    orders: { label: "Orders", color: "#e87c3e" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category Distribution</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Percentage" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* City Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-revival-deep-blue" />
                Top Cities by Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: { label: "Sales", color: "#e87c3e" },
                  retailers: { label: "Retailers", color: "#1a3a5c" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="city" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sales" stroke="#e87c3e" strokeWidth={2} dot={{ r: 4, fill: "#e87c3e" }} name="Sales" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RETAILERS TAB */}
        <TabsContent value="retailers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-revival-deep-blue" />
                All Registered Retailers
              </CardTitle>
              <CardDescription>
                Manage retailer accounts, verification status, and trust scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retailers.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.shopName}</TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {r.city}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full rounded-full ${r.trustScore >= 90 ? "bg-revival-badge-green" : r.trustScore >= 70 ? "bg-revival-orange" : "bg-revival-badge-red"}`}
                                style={{ width: `${r.trustScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{r.trustScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{r.totalProducts}</TableCell>
                        <TableCell>{r.totalSales.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={r.verified
                              ? "border-revival-badge-green text-revival-badge-green"
                              : "border-revival-orange text-revival-orange"
                            }
                          >
                            {r.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRetailer(r.id)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="sr-only">View</span>
                            </Button>
                            {!r.verified && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-revival-badge-green hover:text-revival-badge-green"
                                onClick={() =>
                                  setConfirmAction({ type: "verify", targetName: r.shopName, targetId: r.id })
                                }
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                <span className="sr-only">Verify</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-revival-badge-red hover:text-revival-badge-red"
                              onClick={() =>
                                setConfirmAction({ type: "ban", targetName: r.shopName, targetId: r.id })
                              }
                            >
                              <Ban className="h-3.5 w-3.5" />
                              <span className="sr-only">Ban</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MANAGERS TAB */}
        <TabsContent value="managers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-revival-deep-blue" />
                Local Managers
              </CardTitle>
              <CardDescription>
                Manage area managers and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {platformManagers.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-revival-deep-blue text-sm font-bold text-primary-foreground">
                          {m.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{m.name}</h3>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {m.area}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={m.status === "active"
                          ? "border-revival-badge-green text-revival-badge-green"
                          : "border-revival-badge-red text-revival-badge-red"
                        }
                      >
                        {m.status}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-secondary/50 p-2 text-center">
                        <p className="text-lg font-bold text-foreground">{m.retailers}</p>
                        <p className="text-[10px] text-muted-foreground">Retailers</p>
                      </div>
                      <div className="rounded-lg bg-revival-badge-green/5 p-2 text-center">
                        <p className="text-lg font-bold text-revival-badge-green">{m.approvals}</p>
                        <p className="text-[10px] text-muted-foreground">Approvals</p>
                      </div>
                      <div className="rounded-lg bg-revival-badge-red/5 p-2 text-center">
                        <p className="text-lg font-bold text-revival-badge-red">{m.rejections}</p>
                        <p className="text-[10px] text-muted-foreground">Rejections</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        View Details
                      </Button>
                      {m.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-revival-badge-red text-xs text-revival-badge-red hover:bg-revival-badge-red/10"
                          onClick={() => setConfirmAction({ type: "suspend", targetName: m.name, targetId: m.id })}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 bg-revival-badge-green text-xs text-primary-foreground hover:bg-revival-badge-green/90"
                          onClick={() => {
                            toast.success(`${m.name} has been reactivated.`)
                          }}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-revival-orange" />
                All Platform Orders
              </CardTitle>
              <CardDescription>
                Track and manage orders across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs font-medium">{o.id}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{o.productName}</TableCell>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell>{o.customerCity}</TableCell>
                        <TableCell className="font-medium">{formatPrice(o.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              o.status === "delivered"
                                ? "border-revival-badge-green text-revival-badge-green"
                                : o.status === "shipped" || o.status === "packed"
                                  ? "border-revival-deep-blue text-revival-deep-blue"
                                  : o.status === "cancelled"
                                    ? "border-revival-badge-red text-revival-badge-red"
                                    : "border-revival-orange text-revival-orange"
                            }
                          >
                            {o.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{o.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FRAUD CENTER TAB */}
        <TabsContent value="fraud" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-revival-badge-red/20">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-revival-badge-red/10">
                  <AlertTriangle className="h-6 w-6 text-revival-badge-red" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{highFraudAlerts}</p>
                  <p className="text-sm text-muted-foreground">High Risk Alerts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-revival-orange/10">
                  <ShieldCheck className="h-6 w-6 text-revival-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {verifications.filter((v) => v.fraudScore <= 20).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Clean Bills</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-revival-deep-blue/10">
                  <Eye className="h-6 w-6 text-revival-deep-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{verifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Scanned</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-revival-badge-red" />
                Fraud Detection Log
              </CardTitle>
              <CardDescription>
                AI-powered bill analysis results sorted by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...verifications]
                  .sort((a, b) => b.fraudScore - a.fraudScore)
                  .map((v) => (
                    <div
                      key={v.id}
                      className={`rounded-xl border p-4 ${
                        v.fraudScore > 50
                          ? "border-revival-badge-red/30 bg-revival-badge-red/5"
                          : v.fraudScore > 20
                            ? "border-revival-orange/30 bg-revival-orange/5"
                            : "border-border"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{v.productName}</h4>
                            <Badge
                              variant="outline"
                              className={`capitalize ${
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
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {v.retailerName} - {v.city} - {v.category}
                          </p>
                          <p className="mt-1 rounded-md bg-secondary/50 p-2 text-xs text-muted-foreground">
                            {v.aiNotes}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl text-center ${
                              v.fraudScore > 50
                                ? "bg-revival-badge-red/10"
                                : v.fraudScore > 20
                                  ? "bg-revival-orange/10"
                                  : "bg-revival-badge-green/10"
                            }`}
                          >
                            <span
                              className={`text-lg font-bold ${
                                v.fraudScore > 50
                                  ? "text-revival-badge-red"
                                  : v.fraudScore > 20
                                    ? "text-revival-orange"
                                    : "text-revival-badge-green"
                              }`}
                            >
                              {v.fraudScore}%
                            </span>
                            <span className="text-[9px] text-muted-foreground">Risk</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "ban" && "Ban Retailer"}
              {confirmAction?.type === "verify" && "Verify Retailer"}
              {confirmAction?.type === "suspend" && "Suspend Manager"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "ban" &&
                `Are you sure you want to ban "${confirmAction.targetName}"? This will remove all their listings and prevent future access.`}
              {confirmAction?.type === "verify" &&
                `Confirm verification for "${confirmAction?.targetName}"? This will mark them as a trusted seller on the platform.`}
              {confirmAction?.type === "suspend" &&
                `Suspend "${confirmAction?.targetName}" from manager duties? Their assigned retailers will need to be reassigned.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              className={
                confirmAction?.type === "verify"
                  ? "bg-revival-badge-green text-primary-foreground hover:bg-revival-badge-green/90"
                  : "bg-revival-badge-red text-primary-foreground hover:bg-revival-badge-red/90"
              }
              onClick={handleAction}
            >
              {confirmAction?.type === "ban" && "Ban Retailer"}
              {confirmAction?.type === "verify" && "Verify Retailer"}
              {confirmAction?.type === "suspend" && "Suspend Manager"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
