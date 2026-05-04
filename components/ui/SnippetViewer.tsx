"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useState } from "react"
import * as htmlToImage from "html-to-image"
import { useRef } from "react"

// async function fetchSnippet(id: string) {

//   const { data, error } = await supabase
//     .from("snippets")
//     .select("*")
//     .eq("id", id)
//     .single()

//   if (error) {
//     console.error("Supabase error:", error)
//     return null
//   }

//   return data
// }

async function fetchSnippet(id: string) {

  const { data: snippet, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !snippet) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", snippet.user_id)
    .single()

  return {
    ...snippet,
    username: profile?.username || "unknown"
  }
}



export default function SnippetViewer({ id }: { id: string }) {

  const { data: snippet, isLoading } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => fetchSnippet(id),
  })
  const codeRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  if (isLoading) return <p>Loading snippet...</p>

  if (!snippet) return <p>Snippet not found</p>

  if (!snippet.is_public) return <p>This snippet is private</p>


  function downloadImage() {
  if (!codeRef.current) return

  htmlToImage
    .toPng(codeRef.current)
    .then((dataUrl) => {
      const link = document.createElement("a")
      link.download = `${snippet.title}.png`
      link.href = dataUrl
      link.click()
    })
}

  function copyCode() {
  navigator.clipboard.writeText(snippet.code)
  setCopied(true)

  setTimeout(() => {
    setCopied(false)
  }, 2000)
}
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>

      <h1>{snippet.title}</h1>
      <p
  onClick={() => window.location.href = `/u/${snippet.username}`}
  style={{
    cursor: "pointer",
    color: "#3b82f6",
    marginBottom: "10px"
  }}
>
  @{snippet.username}
</p>

      <p>{snippet.language}</p>

      {/* <SyntaxHighlighter
  language={snippet.language?.toLowerCase()}
  style={vscDarkPlus}
  customStyle={{
    borderRadius: "8px",
    padding: "20px"
  }}
>
  {snippet.code}
</SyntaxHighlighter> */}
<div style={{ position: "relative" }}>

  <button
    onClick={copyCode}
    style={{
      position: "absolute",
      right: "10px",
      top: "10px",
      padding: "6px 10px",
      borderRadius: "5px",
      border: "none",
      background: "#3b82f6",
      color: "white",
      cursor: "pointer"
    }}
  >
    {copied ? "Copied!" : "Copy"}
  </button>
  <button
  onClick={downloadImage}
  style={{
    marginBottom: "10px",
    padding: "8px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Download as Image
</button>

 <div ref={codeRef}>

  <SyntaxHighlighter
    language={snippet.language?.toLowerCase()}
    style={vscDarkPlus}
    customStyle={{
      borderRadius: "8px",
      padding: "20px"
    }}
  >
    {snippet.code}
  </SyntaxHighlighter>

</div>

</div>

      <p>{snippet.tags?.join(", ")}</p>

    </div>
  )
}