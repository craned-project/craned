import { StorageClient } from "@supabase/storage-js";

const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1";
const SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY + "";
export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});
