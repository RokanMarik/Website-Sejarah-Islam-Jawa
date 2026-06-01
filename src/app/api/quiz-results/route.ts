import { NextRequest, NextResponse } from "next/server";
import { saveQuizResult, getQuizResults, getPlayerResults } from "@/lib/quiz-db";

export async function GET(request: NextRequest) {
  const player = request.nextUrl.searchParams.get("player");
  
  if (player) {
    const results = await getPlayerResults(player);
    return NextResponse.json(results);
  }

  const results = await getQuizResults();
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, score, totalQuestions, category, rating } = body;

  if (!playerName || score === undefined || !totalQuestions) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await saveQuizResult({ playerName, score, totalQuestions, category: category || "Campuran", rating });
  return NextResponse.json(result, { status: 201 });
}
