"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/revival/header"
import { Footer } from "@/components/revival/footer"
import { products, formatPrice } from "@/lib/data"
import {
  ShieldCheck,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CartItem {
  productId: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: "p1", quantity: 1 },
    { productId: "p2", quantity: 2 },
    { productId: "p6", quantity: 1 },
  ])
  const [couponCode, setCouponCode] = useState("")

  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { ...product, quantity: item.quantity } : null
    })
    .filter(Boolean) as (typeof products[0] & { quantity: number })[]

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + p.sellingPrice * p.quantity,
    0
  )
  const totalMrp = cartProducts.reduce(
    (sum, p) => sum + p.mrp * p.quantity,
    0
  )
  const discount = totalMrp - subtotal
  const deliveryFee = subtotal > 499 ? 0 : 49
  const total = subtotal + deliveryFee

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
    toast.success("Item removed from cart")
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Your Cart is Empty</h1>
            <p className="mt-2 text-muted-foreground">
              Explore our amazing dead stock deals and start saving!
            </p>
            <Button className="mt-6 bg-revival-orange text-accent-foreground" asChild>
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">
            Shopping Cart ({cartItems.length} items)
          </h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    {/* Image placeholder */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <ShieldCheck className="h-8 w-8 text-revival-deep-blue" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${product.id}`}
                            className="font-medium text-foreground hover:text-revival-deep-blue"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Seller: {product.retailer} | {product.city}
                          </p>
                          {product.badge && (
                            <Badge
                              variant="outline"
                              className="mt-1 border-revival-badge-green text-revival-badge-green text-[10px]"
                            >
                              <ShieldCheck className="mr-0.5 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {product.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            {formatPrice(product.sellingPrice * product.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.mrp * product.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-36 space-y-4">
                {/* Coupon */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Tag className="h-4 w-4" />
                    Apply Coupon
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info("Coupon feature coming soon!")}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-semibold text-foreground">Order Summary</h3>
                  <Separator className="my-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Price ({cartItems.length} items)
                      </span>
                      <span className="text-foreground">{formatPrice(totalMrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-revival-badge-green">
                        - {formatPrice(discount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={deliveryFee === 0 ? "text-revival-badge-green" : "text-foreground"}>
                        {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-lg text-foreground">{formatPrice(total)}</span>
                  </div>

                  <p className="mt-1 text-xs text-revival-badge-green font-medium">
                    You save {formatPrice(discount)} on this order!
                  </p>

                  <Button
                    className="mt-4 w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
                    size="lg"
                    onClick={() => toast.success("Proceeding to checkout!")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    Free delivery on orders above {"₹"}499
                  </div>
                </div>

                {/* Payment methods */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium text-foreground">Payment Options</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                    <Badge variant="outline">UPI</Badge>
                    <Badge variant="outline">Credit Card</Badge>
                    <Badge variant="outline">Debit Card</Badge>
                    <Badge variant="outline">Net Banking</Badge>
                    <Badge variant="outline">COD</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
