import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/supabase.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res }, { supabaseUrl: 'https://db.nnziknfuivtpdjqnltbq.supabase.co', supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uemlrbmZ1aXZ0cGRqcW5sdGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEzMjQyODMsImV4cCI6MjAwNjkwMDI4M30.5qSmDIwQHyO9uO1GHZACrV3FfvaX550Inama3eXwcMo' })
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return res
}
