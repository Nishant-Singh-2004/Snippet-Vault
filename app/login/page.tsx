"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {

    console.log("Login button clicked")

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    if (data.user) {
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">

      <div className="space-y-4 border p-6 rounded w-[350px]">

        <h1 className="text-xl font-bold">Login</h1>

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

        <Button onClick={handleLogin} disabled={loading}>
          Login
        </Button>
        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={() => window.location.href = "/signup"}
          >
            Sign up
          </span>
        </p>

      </div>

    </div>
  )
}