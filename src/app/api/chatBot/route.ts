import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("Incoming Request:", request);

    const { message } = await request.json();
    if (!message) {
      console.error("No message provided");
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log("Message from user:", message);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      console.error("Error response from OpenAI:", await response.text());
      return NextResponse.json({ error: 'OpenAI API error' }, { status: response.status });
    }

    const data = await response.json();
    console.log("OpenAI API Response:", data);

    return NextResponse.json({ reply: data.choices[0]?.message?.content || "No response" });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
