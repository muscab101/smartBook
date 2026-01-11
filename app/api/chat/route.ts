// app/api/chat/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Hubi in magacaan uu la mid yahay kan .env.local
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Haddii messages ay faaruq yihiin cilad ayay keenaysaa
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Fariin lama helin" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Waxaad tahay kaaliye maaliyadeed oo caqli badan.",
        },
        ...messages,
      ],
      model: "llama3-8b-8192", // Haddii 70b uu kugu dhibo, tijaabi 8b oo aad u fudud
    });

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error: any) {
    console.error("GROQ API ERROR:", error.message); // Halkaan ka fiiri Terminal-ka
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}