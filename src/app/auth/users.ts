import { cookies } from "next/headers";
import { supabaseInfo } from "./supabase_info";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

const getUserInServerComponent = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, supabaseInfo);
  const { data, error } = await supabase.auth.getUser();
  return data.user;
};

const getUserInServerActions = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore }, supabaseInfo);
  const { data, error } = await supabase.auth.getUser();
  return data.user;
};

export { getUserInServerComponent, getUserInServerActions };
