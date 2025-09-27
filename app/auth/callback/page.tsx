import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If it's an email confirmation, redirect to NewUser page
      if (type === "email" || type === "signup") {
        return NextResponse.redirect(`${origin}/NewUser`)
      }

      // For other types (like password recovery), redirect to the next URL
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  if (token_hash && type) {
    const supabase = createClient()

    if (type === "email") {
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash,
      })

      if (!error) {
        return NextResponse.redirect(`${origin}/NewUser`)
      }
    }

    if (type === "recovery") {
      const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash,
      })

      if (!error) {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

export default function Page() {
  return null
}
