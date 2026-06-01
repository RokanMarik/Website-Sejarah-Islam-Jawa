import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const subscribersPath = path.join(process.cwd(), "data", "subscribers.json");

function getSubscribers(): string[] {
  if (!existsSync(subscribersPath)) {
    return [];
  }
  return JSON.parse(readFileSync(subscribersPath, "utf8"));
}

function saveSubscriber(email: string) {
  const subscribers = getSubscribers();
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    const dataDir = path.dirname(subscribersPath);
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Email tidak valid" }, { status: 400 });
  }

  const subscribers = getSubscribers();
  if (subscribers.includes(email)) {
    return NextResponse.json({ success: false, error: "Email sudah terdaftar" }, { status: 409 });
  }

  saveSubscriber(email);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const subscribers = getSubscribers();
  return NextResponse.json({ count: subscribers.length });
}
