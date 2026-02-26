"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/revival/header"
import { Footer } from "@/components/revival/footer"
import { products, formatPrice } from "@/lib/data"
import { ProductCard } from "@/components/revival/product-card"
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  MapPin,
  Minus,
  Plus,
  Share2,
  ChevronRight,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
            <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
            <Button className="mt-4 bg-revival-deep-blue text-primary-foreground" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-revival-deep-blue">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-revival-deep-blue">
              Products
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-revival-deep-blue"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-revival-deep-blue/10">
                      <ShieldCheck className="h-12 w-12 text-revival-deep-blue" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground">
                      {product.category}
                    </p>
                    <p className="text-sm text-muted-foreground">Product Image</p>
                  </div>
                </div>

                {product.badge && (
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-revival-orange text-accent-foreground gap-1 text-sm">
                      <Flame className="h-3.5 w-3.5" />
                      {product.badge}
                    </Badge>
                  </div>
                )}
                <div className="absolute right-4 top-4">
                  <Badge className="bg-revival-deep-blue text-primary-foreground text-lg">
                    {product.discount}% OFF
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-revival-orange font-medium">{product.category}</p>
                  <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground md:text-3xl">
                    {product.name}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-md bg-revival-badge-green px-2 py-1 text-sm font-semibold text-primary-foreground">
                  {product.rating}
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviews.toLocaleString()} ratings & reviews
                </span>
              </div>

              <Separator className="my-4" />

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.sellingPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <Badge className="bg-revival-badge-green text-primary-foreground">
                    Save {formatPrice(product.mrp - product.sellingPrice)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Inclusive of all taxes</p>
              </div>

              <Separator className="my-4" />

              {/* Seller Info */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sold by</p>
                    <p className="font-medium text-foreground">{product.retailer}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{product.city}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-revival-badge-green" />
                  <span className="text-sm font-medium text-revival-badge-green">
                    AI-Verified Seller
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} items available
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
                  onClick={() => toast.success("Added to cart!")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-revival-deep-blue text-primary-foreground hover:bg-revival-deep-blue/90"
                  onClick={() => toast.success("Proceeding to checkout!")}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>

              {/* Benefits */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "Orders above ₹499" },
                  { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
                  { icon: ShieldCheck, label: "Genuine Product", sub: "AI + human verified" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-lg border border-border p-3 text-center"
                  >
                    <item.icon className="mb-1 h-5 w-5 text-revival-deep-blue" />
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-10">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Product Description</h3>
                <p className="leading-relaxed text-muted-foreground">{product.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-foreground">
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>MRP:</strong> {formatPrice(product.mrp)}
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>Stock Status:</strong> {product.stock} units available
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>Listed Since:</strong> {product.createdAt}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Customer Reviews</h3>
                <div className="space-y-4">
                  {[
                    { name: "Amit P.", rating: 5, comment: "Amazing deal! Product is brand new and sealed. Saved more than 60% off MRP.", date: "Feb 2026" },
                    { name: "Sneha R.", rating: 4, comment: "Good quality product. Delivery was on time. Packaging could have been better.", date: "Feb 2026" },
                    { name: "Rahul K.", rating: 5, comment: "Genuine dead stock deal. AI verification gives me confidence. Will buy again!", date: "Jan 2026" },
                  ].map((review, i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 rounded bg-revival-badge-green px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                          {review.rating} <Star className="h-2.5 w-2.5 fill-current" />
                        </div>
                        <span className="font-medium text-foreground">{review.name}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Seller Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Shop:</strong> {product.retailer}</p>
                  <p><strong>Location:</strong> {product.city}</p>
                  <p className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-revival-badge-green" />
                    <strong className="text-revival-badge-green">Verified Seller</strong>
                  </p>
                  <p className="text-muted-foreground">
                    This seller has been verified through our AI Bill Verification system. All products are authenticated and quality-checked before listing.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">
                More from {product.category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
