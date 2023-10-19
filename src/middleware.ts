import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@lib/database.types";
import { supabaseInfo } from "@/app/auth/supabase_info";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res }, supabaseInfo);
  await supabase.auth.getSession();
  return res;
}
