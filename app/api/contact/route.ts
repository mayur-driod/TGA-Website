import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  void body

  return NextResponse.json({ ok: true })
}
