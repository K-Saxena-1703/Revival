import { Header } from "@/components/revival/header"
import { Footer } from "@/components/revival/footer"
import { HeroBanner } from "@/components/revival/hero-banner"
import { CategoriesGrid } from "@/components/revival/categories-grid"
import { FlashDeals } from "@/components/revival/flash-deals"
import { ProductCard } from "@/components/revival/product-card"
import { products } from "@/lib/data"
import { ShieldCheck, TrendingUp, Users, Store } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <HeroBanner />
        <CategoriesGrid />
        <FlashDeals />

        {/* All Products */}
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trending Dead Stock Deals</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Handpicked deals verified by our AI system
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
