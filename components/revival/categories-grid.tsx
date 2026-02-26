import Link from "next/link"
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Footprints,
} from "lucide-react"
import { categories } from "@/lib/data"

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Footprints,
}

export function CategoriesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse dead stock deals across all categories
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-revival-orange hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Smartphone
          return (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-revival-orange/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-revival-deep-blue/5 transition-colors group-hover:bg-revival-orange/10">
                <Icon className="h-6 w-6 text-revival-deep-blue group-hover:text-revival-orange" />
              </div>
              <span className="text-xs font-medium text-foreground">{category.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {category.productCount.toLocaleString()} items
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
