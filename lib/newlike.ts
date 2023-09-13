import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/supabase.types";

export const getLike = async (userId: string, postId: string) => {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from("likes")
    .select("user_id, post_id")
    .eq("user_id", userId)
    .eq("post_id", postId);
  if (error) {
    console.log(error);
  }
  return data && data.length > 0;
};
