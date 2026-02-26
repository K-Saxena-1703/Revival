"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/revival-logo.png"
              alt="Revival"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl"
            />
            <span className="text-2xl font-bold text-revival-deep-blue">Revival</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account and start saving on branded products
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Create Account</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="flex gap-2">
                <div className="flex h-10 items-center rounded-md border border-input bg-secondary px-3 text-sm text-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <label className="flex items-start gap-2">
              <Checkbox className="mt-0.5" />
              <span className="text-xs text-muted-foreground">
                {"I agree to Revival's "}
                <Link href="#" className="text-revival-orange hover:underline">
                  Terms of Service
                </Link>
                {" and "}
                <Link href="#" className="text-revival-orange hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              className="w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
              onClick={() => toast.success("Account created successfully!")}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.success("Google signup coming soon!")}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-revival-orange hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Secure Signup
          </span>
          <span>|</span>
          <span>Your data is encrypted</span>
        </div>
      </div>
    </div>
  )
}
