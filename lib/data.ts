// Revival - Mock data for the marketplace

export interface Product {
  id: string
  name: string
  description: string
  category: string
  mrp: number
  sellingPrice: number
  purchasePrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  retailer: string
  retailerId: string
  city: string
  verified: boolean
  stock: number
  badge?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  productCount: number
}

export interface Retailer {
  id: string
  name: string
  shopName: string
  city: string
  pincode: string
  gstNumber?: string
  verified: boolean
  trustScore: number
  totalProducts: number
  totalSales: number
  joinedAt: string
  phone: string
  email: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  quantity: number
  totalAmount: number
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled"
  customerName: string
  customerCity: string
  createdAt: string
  deliveryDate?: string
}

export interface Verification {
  id: string
  retailerId: string
  retailerName: string
  productName: string
  billImage: string
  category: string
  mrp: number
  purchasePrice: number
  sellingPrice: number
  quantity: number
  status: "pending" | "approved" | "rejected"
  fraudScore: number
  aiNotes: string
  submittedAt: string
  city: string
}

export const categories: Category[] = [
  { id: "1", name: "Electronics", icon: "Smartphone", productCount: 1240 },
  { id: "2", name: "Fashion", icon: "Shirt", productCount: 3560 },
  { id: "3", name: "Home & Kitchen", icon: "Home", productCount: 890 },
  { id: "4", name: "Beauty & Personal Care", icon: "Sparkles", productCount: 670 },
  { id: "5", name: "Sports & Fitness", icon: "Dumbbell", productCount: 450 },
  { id: "6", name: "Books & Stationery", icon: "BookOpen", productCount: 980 },
  { id: "7", name: "Toys & Games", icon: "Gamepad2", productCount: 320 },
  { id: "8", name: "Footwear", icon: "Footprints", productCount: 1100 },
]

export const products: Product[] = [
  {
    id: "p1",
    name: "boAt Rockerz 450 Bluetooth Headphone",
    description: "Immersive HD sound, 40mm drivers, 15-hour playback, padded ear cushions, foldable design. Premium dead-stock from authorized retailer.",
    category: "Electronics",
    mrp: 3990,
    sellingPrice: 1299,
    purchasePrice: 1800,
    discount: 67,
    rating: 4.3,
    reviews: 234,
    image: "/images/headphone.jpg",
    retailer: "TechHub Electronics",
    retailerId: "r1",
    city: "Mumbai",
    verified: true,
    stock: 45,
    badge: "Verified Dead Stock Deal",
    createdAt: "2026-02-10",
  },
  {
    id: "p2",
    name: "Allen Solly Men's Formal Shirt - Blue",
    description: "100% cotton, slim fit, premium finish. Dead stock from season clearance. Brand new with tags intact.",
    category: "Fashion",
    mrp: 2499,
    sellingPrice: 799,
    purchasePrice: 1100,
    discount: 68,
    rating: 4.5,
    reviews: 189,
    image: "/images/shirt.jpg",
    retailer: "FashionWala Store",
    retailerId: "r2",
    city: "Delhi",
    verified: true,
    stock: 120,
    badge: "Verified Dead Stock Deal",
    createdAt: "2026-02-08",
  },
  {
    id: "p3",
    name: "Prestige Popular Pressure Cooker 5L",
    description: "Aluminium body, ISI certified, precision weight valve, metallic safety plug. Unused dead stock.",
    category: "Home & Kitchen",
    mrp: 2695,
    sellingPrice: 1399,
    purchasePrice: 1600,
    discount: 48,
    rating: 4.6,
    reviews: 567,
    image: "/images/cooker.jpg",
    retailer: "HomeNeeds Store",
    retailerId: "r3",
    city: "Bangalore",
    verified: true,
    stock: 30,
    createdAt: "2026-02-12",
  },
  {
    id: "p4",
    name: "Lakme 9to5 Primer + Matte Foundation",
    description: "Lightweight, long-lasting, SPF 20, smooth matte finish. Brand new sealed product from authorized dead stock.",
    category: "Beauty & Personal Care",
    mrp: 875,
    sellingPrice: 449,
    purchasePrice: 520,
    discount: 49,
    rating: 4.2,
    reviews: 312,
    image: "/images/foundation.jpg",
    retailer: "Beauty Palace",
    retailerId: "r4",
    city: "Hyderabad",
    verified: true,
    stock: 200,
    badge: "Verified Dead Stock Deal",
    createdAt: "2026-02-05",
  },
  {
    id: "p5",
    name: "Nivia Storm Football - Size 5",
    description: "32 panels, machine stitched, durable rubber bladder. Brand new in box. Dead stock clearance from sports retailer.",
    category: "Sports & Fitness",
    mrp: 1299,
    sellingPrice: 549,
    purchasePrice: 650,
    discount: 58,
    rating: 4.1,
    reviews: 98,
    image: "/images/football.jpg",
    retailer: "SportsZone",
    retailerId: "r5",
    city: "Chennai",
    verified: true,
    stock: 75,
    createdAt: "2026-02-14",
  },
  {
    id: "p6",
    name: "Samsung Galaxy Buds FE",
    description: "Active Noise Cancellation, 30-hour battery, IP57 rating. Sealed box dead stock with full warranty.",
    category: "Electronics",
    mrp: 6999,
    sellingPrice: 3499,
    purchasePrice: 4200,
    discount: 50,
    rating: 4.4,
    reviews: 456,
    image: "/images/earbuds.jpg",
    retailer: "TechHub Electronics",
    retailerId: "r1",
    city: "Mumbai",
    verified: true,
    stock: 25,
    badge: "Verified Dead Stock Deal",
    createdAt: "2026-02-01",
  },
  {
    id: "p7",
    name: "Woodland Men's Leather Casual Shoes",
    description: "Genuine leather upper, rubber sole, padded insole. Premium dead stock from season clearance.",
    category: "Footwear",
    mrp: 4995,
    sellingPrice: 2199,
    purchasePrice: 2800,
    discount: 56,
    rating: 4.3,
    reviews: 178,
    image: "/images/shoes.jpg",
    retailer: "ShoePoint",
    retailerId: "r6",
    city: "Pune",
    verified: true,
    stock: 40,
    createdAt: "2026-02-11",
  },
  {
    id: "p8",
    name: "Funskool Chess Set Premium",
    description: "Wooden board, weighted pieces, foldable design. Brand new sealed. Dead stock clearance.",
    category: "Toys & Games",
    mrp: 1499,
    sellingPrice: 649,
    purchasePrice: 750,
    discount: 57,
    rating: 4.7,
    reviews: 89,
    image: "/images/chess.jpg",
    retailer: "ToyWorld",
    retailerId: "r7",
    city: "Kolkata",
    verified: true,
    stock: 55,
    createdAt: "2026-02-09",
  },
]

export const retailers: Retailer[] = [
  {
    id: "r1",
    name: "Rajesh Kumar",
    shopName: "TechHub Electronics",
    city: "Mumbai",
    pincode: "400001",
    gstNumber: "27AABCT1234A1ZV",
    verified: true,
    trustScore: 92,
    totalProducts: 45,
    totalSales: 1230,
    joinedAt: "2025-06-15",
    phone: "+91 98765 43210",
    email: "rajesh@techhub.in",
  },
  {
    id: "r2",
    name: "Priya Sharma",
    shopName: "FashionWala Store",
    city: "Delhi",
    pincode: "110001",
    gstNumber: "07AABCT5678B2ZP",
    verified: true,
    trustScore: 88,
    totalProducts: 120,
    totalSales: 890,
    joinedAt: "2025-08-20",
    phone: "+91 98765 43211",
    email: "priya@fashionwala.in",
  },
  {
    id: "r3",
    name: "Suresh Babu",
    shopName: "HomeNeeds Store",
    city: "Bangalore",
    pincode: "560001",
    verified: true,
    trustScore: 95,
    totalProducts: 67,
    totalSales: 2100,
    joinedAt: "2025-04-10",
    phone: "+91 98765 43212",
    email: "suresh@homeneeds.in",
  },
]

export const orders: Order[] = [
  {
    id: "ORD-001",
    productId: "p1",
    productName: "boAt Rockerz 450 Bluetooth Headphone",
    quantity: 1,
    totalAmount: 1299,
    status: "delivered",
    customerName: "Amit Patel",
    customerCity: "Ahmedabad",
    createdAt: "2026-02-18",
    deliveryDate: "2026-02-22",
  },
  {
    id: "ORD-002",
    productId: "p2",
    productName: "Allen Solly Men's Formal Shirt - Blue",
    quantity: 2,
    totalAmount: 1598,
    status: "shipped",
    customerName: "Neha Gupta",
    customerCity: "Lucknow",
    createdAt: "2026-02-20",
  },
  {
    id: "ORD-003",
    productId: "p6",
    productName: "Samsung Galaxy Buds FE",
    quantity: 1,
    totalAmount: 3499,
    status: "confirmed",
    customerName: "Vikram Singh",
    customerCity: "Jaipur",
    createdAt: "2026-02-24",
  },
  {
    id: "ORD-004",
    productId: "p3",
    productName: "Prestige Popular Pressure Cooker 5L",
    quantity: 1,
    totalAmount: 1399,
    status: "pending",
    customerName: "Sunita Devi",
    customerCity: "Patna",
    createdAt: "2026-02-25",
  },
  {
    id: "ORD-005",
    productId: "p4",
    productName: "Lakme 9to5 Primer + Matte Foundation",
    quantity: 3,
    totalAmount: 1347,
    status: "packed",
    customerName: "Kavitha Rao",
    customerCity: "Chennai",
    createdAt: "2026-02-23",
  },
]

export const verifications: Verification[] = [
  {
    id: "v1",
    retailerId: "r1",
    retailerName: "Rajesh Kumar",
    productName: "JBL Tune 760NC Headphone",
    billImage: "/images/bill-sample.jpg",
    category: "Electronics",
    mrp: 7999,
    purchasePrice: 4500,
    sellingPrice: 4999,
    quantity: 20,
    status: "pending",
    fraudScore: 12,
    aiNotes: "Bill appears authentic. OCR matched product name and price. Low fraud risk.",
    submittedAt: "2026-02-25",
    city: "Mumbai",
  },
  {
    id: "v2",
    retailerId: "r2",
    retailerName: "Priya Sharma",
    productName: "Levi's Men's 511 Slim Jeans",
    billImage: "/images/bill-sample.jpg",
    category: "Fashion",
    mrp: 4599,
    purchasePrice: 2200,
    sellingPrice: 2499,
    quantity: 50,
    status: "pending",
    fraudScore: 8,
    aiNotes: "Bill verified. Price consistent with wholesale rates. Brand authentication passed.",
    submittedAt: "2026-02-24",
    city: "Delhi",
  },
  {
    id: "v3",
    retailerId: "r3",
    retailerName: "Suresh Babu",
    productName: "Pigeon by Stovekraft Pan Set",
    billImage: "/images/bill-sample.jpg",
    category: "Home & Kitchen",
    mrp: 2199,
    purchasePrice: 1100,
    sellingPrice: 1299,
    quantity: 30,
    status: "approved",
    fraudScore: 5,
    aiNotes: "Verified. Bill from authorized distributor. All details match.",
    submittedAt: "2026-02-20",
    city: "Bangalore",
  },
  {
    id: "v4",
    retailerId: "r1",
    retailerName: "Rajesh Kumar",
    productName: "Suspicious Product XYZ",
    billImage: "/images/bill-sample.jpg",
    category: "Electronics",
    mrp: 15999,
    purchasePrice: 2000,
    sellingPrice: 9999,
    quantity: 100,
    status: "rejected",
    fraudScore: 87,
    aiNotes: "HIGH RISK: Bill appears AI-generated. Price anomaly detected - purchase price unusually low for MRP. Pattern inconsistencies found.",
    submittedAt: "2026-02-22",
    city: "Mumbai",
  },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}
