"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Package,
  Store,
  Shield,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-revival-deep-blue text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Delivering across India
            </span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            Reviving Inventory. Rebuilding Retail.
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/revival-logo.png"
              alt="Revival"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-revival-deep-blue">Revival</span>
              <span className="block text-[10px] leading-none text-muted-foreground">
                Dead Stock Deals
              </span>
            </div>
          </Link>

          {/* Search */}
          <div className="relative flex flex-1 items-center" suppressHydrationWarning>
            <Input
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 border-revival-deep-blue/20 pr-10 text-sm focus-visible:ring-revival-deep-blue"
              suppressHydrationWarning
            />
            <Button
              size="icon"
              className="absolute right-0 h-10 rounded-l-none bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
              suppressHydrationWarning
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden gap-1.5 md:flex" suppressHydrationWarning>
                  <User className="h-4 w-4" />
                  <span className="text-sm">Account</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Login / Sign Up</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="hidden gap-1.5 md:flex" asChild>
              <Link href="/wishlist">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Wishlist</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" className="relative gap-1.5" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden text-sm md:inline">Cart</span>
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-revival-orange text-[10px] font-bold text-accent-foreground">
                  3
                </span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Categories bar */}
        <div className="hidden border-t border-border md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 text-sm">
            {[
              "Category",
              "Electronics",
              "Fashion",
              "Home & Kitchen",
              "Beauty",
              "Sports",
              "Books",
              "Footwear",
              "Toys",
            ].map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="whitespace-nowrap text-foreground/80 transition-colors hover:text-revival-orange"
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/products"
              className="ml-auto whitespace-nowrap font-medium text-revival-orange"
            >
              View All Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {[
              "Electronics",
              "Fashion",
              "Home & Kitchen",
              "Beauty",
              "Sports",
              "Books",
              "Footwear",
              "Toys",
            ].map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className="border-t border-border pt-2">
              <Link
                href="/auth/login"
                className="block rounded-md px-3 py-2 text-sm font-medium text-revival-deep-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
              <Link
                href="/retailer"
                className="block rounded-md px-3 py-2 text-sm text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell on Revival
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
