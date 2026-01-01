import { projectId, publicAnonKey } from "./info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a07b692d`;

export async function get(key: string) {
  try {
    const res = await fetch(`${BASE_URL}/kv?key=${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    if (!res.ok) {
      console.error("KV Get Error:", await res.text());
      return null;
    }
    const data = await res.json();
    return data.value;
  } catch (e) {
    console.error("KV Get Exception:", e);
    return null;
  }
}

export async function set(key: string, value: any) {
  try {
    const res = await fetch(`${BASE_URL}/kv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
      console.error("KV Set Error:", await res.text());
      throw new Error("Failed to save data");
    }
  } catch (e) {
    console.error("KV Set Exception:", e);
    throw e;
  }
}
