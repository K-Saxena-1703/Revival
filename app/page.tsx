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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-secondary/50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                How Revival Works
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                Every product goes through our rigorous AI + human verification to ensure authenticity
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  icon: Store,
                  title: "Retailer Lists Product",
                  desc: "Retailers upload dead stock with purchase bills for verification",
                },
                {
                  icon: ShieldCheck,
                  title: "AI Verifies Bill",
                  desc: "Our AI reads bills via OCR, detects fakes, and scores for fraud",
                },
                {
                  icon: Users,
                  title: "Manager Approves",
                  desc: "Local managers review AI results and give final approval",
                },
                {
                  icon: TrendingUp,
                  title: "You Save Big",
                  desc: "Verified products go live at unbeatable prices with full transparency",
                },
              ].map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-revival-deep-blue text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute left-1/2 top-7 -z-10 hidden h-0.5 w-full bg-border md:block" />
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-revival-deep-blue py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
            {[
              { value: "50K+", label: "Products Listed" },
              { value: "10K+", label: "Trusted Retailers" },
              { value: "500+", label: "Cities Served" },
              { value: "2L+", label: "Happy Customers" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-revival-orange">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
