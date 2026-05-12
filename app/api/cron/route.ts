import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {

  // simple lightweight query
  const { error } = await supabase
    .from("snippets")
    .select("id")
    .limit(1)

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }

  return NextResponse.json({
    success: true,
    message: "Supabase pinged successfully"
  })
}