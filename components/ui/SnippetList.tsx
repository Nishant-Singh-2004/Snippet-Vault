"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import styles from "@/app/dashboard/dashboard.module.css"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

async function fetchSnippets() {

  const { data: snippets, error } = await supabase
    .from("snippets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  // fetch profiles separately
  const userIds = snippets.map((s: any) => s.user_id)

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds)

  const profileMap: any = {}
  profiles?.forEach((p: any) => {
    profileMap[p.id] = p.username
  })

  // merge username into snippets
  return snippets.map((s: any) => ({
    ...s,
    username: profileMap[s.user_id]
  }))
}

export default function SnippetList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = useQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippets,
  })

  if (isLoading) return <p>Loading snippets...</p>

  if (error) return <p>Error loading snippets</p>

  async function deleteSnippet(id: string) {

    const confirmDelete = confirm("Delete this snippet?")

    if (!confirmDelete) return

    const { error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      queryClient.invalidateQueries({ queryKey: ["snippets"] })
    }
  }

  function editSnippet(snippet: any) {

    window.dispatchEvent(
      new CustomEvent("edit-snippet", { detail: snippet })
    )

  }

  return (
    <div>
      <input
        placeholder="Search snippets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <h2>Public Snippets</h2>

      {data
        ?.filter((snippet: any) => {
          const text = search.toLowerCase()

          return (
            snippet.title?.toLowerCase().includes(text) ||
            snippet.language?.toLowerCase().includes(text) ||
            snippet.tags?.join(" ").toLowerCase().includes(text)
          )
        })
        .map((snippet: any) => (
          <div key={snippet.id} className={styles.card}>

            <h3>{snippet.title}</h3>
            <p
              onClick={() => {
                if (!snippet.username) {
                  alert("Username not loaded yet")
                  return
                }

                window.location.href = `/u/${snippet.username}`
              }}
              style={{
                cursor: "pointer",
                color: "#3b82f6",
                fontSize: "14px"
              }}
            >
              @{snippet.username || "unknown"}
            </p>
            <p>{snippet.language}</p>
            <p>{snippet.code}</p>

            <div style={{ marginTop: "5px" }}>
              {snippet.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  onClick={() => setSearch(tag)}
                  style={{
                    marginRight: "8px",
                    padding: "4px 8px",
                    background: "#334155",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

              <button
                className={styles.button}
                onClick={() => editSnippet(snippet)}
              >
                Edit
              </button>

              <button
                className={styles.button}
                onClick={() => deleteSnippet(snippet.id)}
              >
                Delete
              </button>

              <button
                className={styles.button}
                onClick={() => window.open(`/s/${snippet.id}`, "_blank")}
              >
                Open
              </button>

              <button
                className={styles.button}
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/s/${snippet.id}`
                  )
                }
              >
                Copy Link
              </button>

            </div>

          </div>
        ))}

    </div>
  )
}