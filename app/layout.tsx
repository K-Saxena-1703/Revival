import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Revival - Dead Stock Deals at Unbeatable Prices',
  description: 'India\'s #1 marketplace for verified dead stock inventory. Shop branded products at massive discounts from trusted retailers.',
  keywords: ['dead stock', 'discount shopping', 'India marketplace', 'clearance sale', 'wholesale deals'],
  icons: {
    icon: '/images/revival-logo.png',
    apple: '/images/revival-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a3a5c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
