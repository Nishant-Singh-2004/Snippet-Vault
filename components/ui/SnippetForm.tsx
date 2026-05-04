"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import styles from "@/app/dashboard/dashboard.module.css"

export default function SnippetForm() {

  const queryClient = useQueryClient()

  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {

    function handleEdit(event: any) {

      const snippet = event.detail

      setTitle(snippet.title)
      setLanguage(snippet.language)
      setCode(snippet.code)
      setTags(snippet.tags?.join(", ") || "")
      setIsPublic(snippet.is_public)
      setEditingId(snippet.id)

    }

    window.addEventListener("edit-snippet", handleEdit)

    return () => {
      window.removeEventListener("edit-snippet", handleEdit)
    }

  }, [])

  async function handleCreateSnippet() {

    let error = null

    if (editingId) {

      const result = await supabase
        .from("snippets")
        .update({
          title,
          language,
          code,
          tags: tags.split(",").map(tag => tag.trim()),
          is_public: isPublic,
        })
        .eq("id", editingId)

      error = result.error

    } else {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("User not logged in")
        return
      }

      const result = await supabase
        .from("snippets")
        .insert({
          title,
          language,
          code,
          tags: tags.split(",").map(tag => tag.trim()),
          is_public: isPublic,
          user_id: user.id,
        })

      error = result.error
    }

    if (error) {
      alert(error.message)
      return
    }

    // reset form
    setTitle("")
    setLanguage("")
    setCode("")
    setTags("")
    setIsPublic(false)
    setEditingId(null)

    // refresh snippet list
    queryClient.invalidateQueries({ queryKey: ["snippets"] })
  }

  return (

    <Card className="p-6 space-y-5">

      <h2>
        {editingId ? "Edit Snippet" : "Create Snippet"}
      </h2>

      <Input
        className={styles.input}
        placeholder="Snippet Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        className={styles.input}
        placeholder="Language (example: javascript)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      <textarea
        className={styles.textarea}
        rows={10}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Input
        className={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <span> Public Snippet</span>
      </div>

      <Button className={styles.button} onClick={handleCreateSnippet}>
        {editingId ? "Update Snippet" : "Save Snippet"}
      </Button>

    </Card>

  )
}