"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

// async function fetchUserSnippets(username: string) {

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("id")
//     .eq("username", username)
//     .single()

//   if (!profile) return []

//   const { data } = await supabase
//     .from("snippets")
//     .select("*")
//     .eq("user_id", profile.id)
//     .eq("is_public", true)
//     .order("created_at", { ascending: false })

//   return data
// }

async function fetchUserSnippets(username: string) {

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle()   

  if (profileError) {
    console.error(profileError)
    return []
  }

  if (!profile) return []  

  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data || [] 
}

export default function UserProfile({ id }: { id: string }) {

  const { data: snippets, isLoading } = useQuery({
    queryKey: ["user-snippets", id],
    queryFn: () => fetchUserSnippets(id),
  })

  if (isLoading) return <p>Loading user snippets...</p>

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>

      <h1>User: @{id}</h1>

      <h2>Public Snippets</h2>

      {(snippets || []).map((snippet: any) => (

        <div
          key={snippet.id}
          style={{
            border: "1px solid #444",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "10px"
          }}
        >

          <h3>{snippet.title}</h3>

          <p>{snippet.language}</p>

          <button
            onClick={() => window.open(`/s/${snippet.id}`, "_blank")}
          >
            Open Snippet
          </button>

        </div>

      ))}

    </div>
  )
}