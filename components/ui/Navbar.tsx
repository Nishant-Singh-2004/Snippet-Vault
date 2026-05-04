"use client"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"


export default function Navbar() {

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="flex items-center justify-between border-b p-4">

      <div>

  <h1>SnippetVault</h1>

  <Button
    onClick={async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // fetch username
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle()

        if (!profile?.username) {
    alert("Profile not found")
    return
  }
      if (profile?.username) {
        window.location.href = `/u/${profile.username}`
      }
    }}
  >
    My Profile
  </Button>

</div>

      <Button onClick={logout}>
        Logout
      </Button>

    </div>
  )
}