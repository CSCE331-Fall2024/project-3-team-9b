import { NextResponse } from "next/server";

const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
const API_TOKEN = process.env.HUGGINGFACE_API_KEY;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("Received message:", message);

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    console.log("Fetching API response...");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Hugging Face API Error:", errorData);
      return NextResponse.json({ error: errorData.error || "Failed to fetch chatbot response" }, { status: response.status });
    }

    const data = await response.json();
    console.log("API Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Chatbot Backend Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
