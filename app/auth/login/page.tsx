"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Chrome, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const handlePhoneLogin = () => {
    if (!otpSent) {
      setOtpSent(true)
      toast.success("OTP sent to your phone!")
    } else {
      toast.success("Login successful!")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Sign in to access the best dead stock deals in India
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Tabs defaultValue="phone">
            <TabsList className="w-full">
              <TabsTrigger value="phone" className="flex-1">
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="email" className="flex-1">
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="mt-4 space-y-4">
              {!otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 items-center rounded-md border border-input bg-secondary px-3 text-sm text-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    OTP sent to +91 {phone}
                    <button
                      className="ml-2 text-revival-orange hover:underline"
                      onClick={() => setOtpSent(false)}
                    >
                      Change
                    </button>
                  </p>
                </div>
              )}
              <Button
                className="w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
                onClick={handlePhoneLogin}
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="email" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs text-revival-orange hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-revival-orange text-accent-foreground hover:bg-revival-orange/90"
                onClick={() => toast.success("Login successful!")}
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>

          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.success("Google login coming soon!")}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="font-medium text-revival-orange hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Secure Login
          </span>
          <span>|</span>
          <span>256-bit Encryption</span>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-revival-deep-blue">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
