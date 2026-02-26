import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-revival-deep-blue text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/revival-logo.png"
                alt="Revival"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-xl font-bold">Revival</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              {"India's #1 marketplace for verified dead stock inventory. Shop branded products at massive discounts from trusted retailers across 500+ cities."}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Mumbai, Maharashtra, India
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 1800-REVIVAL
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@revival.in
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/products" className="hover:text-revival-orange">All Products</Link></li>
              <li><Link href="/products?category=Electronics" className="hover:text-revival-orange">Electronics</Link></li>
              <li><Link href="/products?category=Fashion" className="hover:text-revival-orange">Fashion</Link></li>
              <li><Link href="/products?category=Home" className="hover:text-revival-orange">Home & Kitchen</Link></li>
              <li><Link href="/products" className="hover:text-revival-orange">Flash Sales</Link></li>
            </ul>
          </div>

          {/* For Retailers */}
          <div>
            <h3 className="mb-4 font-semibold">For Retailers</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/retailer" className="hover:text-revival-orange">Sell on Revival</Link></li>
              <li><Link href="/retailer" className="hover:text-revival-orange">Retailer Dashboard</Link></li>
              <li><Link href="/retailer" className="hover:text-revival-orange">Verification Process</Link></li>
              <li><Link href="/retailer" className="hover:text-revival-orange">Commission Rates</Link></li>
              <li><Link href="/manager" className="hover:text-revival-orange">Become a Manager</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 font-semibold">Help & Support</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="#" className="hover:text-revival-orange">FAQ</Link></li>
              <li><Link href="#" className="hover:text-revival-orange">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-revival-orange">Return Policy</Link></li>
              <li><Link href="#" className="hover:text-revival-orange">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-revival-orange">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/50 md:flex-row">
            <p>2026 Revival. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Secured Payments</span>
              <span>|</span>
              <span>100% Authentic Products</span>
              <span>|</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
