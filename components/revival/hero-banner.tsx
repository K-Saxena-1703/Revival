"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Truck, Tag, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    title: "Dead Stock Deals You Won't Believe",
    subtitle: "Up to 70% off on branded electronics, fashion, home essentials and more. Every product verified by AI + human experts.",
    cta: "Shop Now",
    href: "/products",
    accent: "bg-revival-orange",
  },
  {
    title: "Flash Clearance Event",
    subtitle: "Limited time mega clearance on 5000+ products from top retailers across India. Don't miss out!",
    cta: "View Deals",
    href: "/products",
    accent: "bg-revival-deep-blue",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const banner = banners[current]

  return (
    <section className="relative overflow-hidden bg-revival-deep-blue">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--revival-light-blue)_0%,_transparent_60%)] opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-revival-orange/20 px-3 py-1 text-sm text-revival-orange">
            <Timer className="h-4 w-4" />
            Limited Time Deals - Ends Soon
          </div>
          <h1 className="text-pretty text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
            {banner.title}
          </h1>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed text-primary-foreground/70 md:text-lg">
            {banner.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
              asChild
            >
              <Link href={banner.href}>
                {banner.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/retailer">Sell on Revival</Link>
            </Button>
          </div>
        </div>

        {/* Banner indicators */}
        <div className="mt-8 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-8 bg-revival-orange"
                  : "w-4 bg-primary-foreground/30"
              }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-t border-primary-foreground/10 bg-revival-deep-blue/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-3 text-sm text-primary-foreground/80 md:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-revival-orange" />
            AI-Verified Products
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-revival-orange" />
            Up to 70% Off MRP
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-revival-orange" />
            Pan-India Delivery
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-revival-orange" />
            Secure Payments
          </div>
        </div>
      </div>
    </section>
  )
}
