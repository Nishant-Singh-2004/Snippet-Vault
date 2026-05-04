"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Signup() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("Signup successful! Please login.")
      router.push("/login")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="p-6 w-[350px] space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>

        <Input
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleSignup} disabled={loading}>
          Sign Up
        </Button>
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={() => window.location.href = "/login"}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  )
}