import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
    vercel_url: process.env.VERCEL_URL,
    vercel_git_commit_sha: process.env.VERCEL_GIT_COMMIT_SHA,
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    build_time: new Date().toISOString(),
  });
}
