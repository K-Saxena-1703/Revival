"use client"

import { useState, useEffect } from "react"
import { Flame } from "lucide-react"
import { products } from "@/lib/data"
import { ProductCard } from "./product-card"

export function FlashDeals() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 })

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const topDeals = products.filter((p) => p.discount >= 50).slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-revival-orange">
            <Flame className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Flash Clearance Sale</h2>
            <p className="text-sm text-muted-foreground">
              Massive discounts ending soon
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Ends in:</span>
          <div className="flex items-center gap-1">
            {[
              { value: timeLeft.hours, label: "H" },
              { value: timeLeft.minutes, label: "M" },
              { value: timeLeft.seconds, label: "S" },
            ].map((unit, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-revival-deep-blue text-sm font-bold text-primary-foreground">
                  {mounted ? String(unit.value).padStart(2, "0") : "--"}
                </span>
                <span className="text-xs text-muted-foreground">{unit.label}</span>
                {i < 2 && <span className="mx-0.5 text-muted-foreground">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topDeals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
