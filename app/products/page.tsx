"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/revival/header"
import { Footer } from "@/components/revival/footer"
import { ProductCard } from "@/components/revival/product-card"
import { products, categories } from "@/lib/data"
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category)
      const matchesPrice =
        p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice)
        break
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    return filtered
  }, [search, selectedCategories, priceRange, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={selectedCategories.includes(cat.name)}
                onCheckedChange={() => toggleCategory(cat.name)}
              />
              <span className="text-sm text-foreground">{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{"₹"}{priceRange[0].toLocaleString()}</span>
          <span>{"₹"}{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground">Availability</h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox defaultChecked />
            <span className="text-sm text-foreground">In Stock</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox defaultChecked />
            <span className="text-sm text-foreground">Verified Only</span>
          </label>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setSelectedCategories([])}
        >
          <X className="mr-1 h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Top bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Products</h1>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} verified dead stock deals found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 md:w-64"
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden items-center gap-1 md:flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-revival-deep-blue text-primary-foreground" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-revival-deep-blue text-primary-foreground" : ""}
                >
                  <LayoutList className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>

              {/* Mobile filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden w-60 shrink-0 md:block">
              <div className="sticky top-36 rounded-xl border border-border bg-card p-4">
                <h2 className="mb-4 font-semibold text-foreground">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
                  <p className="text-lg font-medium text-foreground">No products found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
