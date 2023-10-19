import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@lib/database.types";
import { supabaseInfo } from "../supabase_info";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const cookieStore = cookies();
  const urlRedirectTo = requestUrl.origin + "/auth/callback";
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore }, supabaseInfo);
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: urlRedirectTo,
    },
  });
  console.log("data", data);
  console.error("error", error);

  return NextResponse.redirect(requestUrl.origin + "/login/prompt-check");
}
