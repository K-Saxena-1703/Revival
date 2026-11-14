"use client"

import Link from "next/link"
import { Star, Heart, ShieldCheck, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import Image from "next/image"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 sm:p-3"
          />

          {/* Discount badge */}
          <div className="absolute left-2 top-2">
            <Badge className="bg-revival-orange text-accent-foreground font-semibold">
              {product.discount}% OFF
            </Badge>
          </div>

          {/* Verified badge */}
          {product.badge && (
            <div className="absolute right-2 top-2">
              <Badge variant="outline" className="border-revival-badge-green bg-card/90 text-revival-badge-green text-[10px] gap-0.5">
                <Flame className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        {/* Details */}
        <div className="p-2 sm:p-3">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-medium leading-snug text-foreground group-hover:text-revival-deep-blue">
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded bg-revival-badge-green px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {product.rating}
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-foreground">
              {formatPrice(product.sellingPrice)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
          </div>

          <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
            {product.city} &middot; {product.stock} left
          </p>
        </div>
      </div>
    </Link>
  )
}
