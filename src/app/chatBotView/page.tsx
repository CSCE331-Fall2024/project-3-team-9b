"use client";

import { useState } from "react";

export default function ChatBotView() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Hello! How can I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log("Sending message:", input);
      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Frontend Error:", errorData);
        setError(errorData.error || "Failed to fetch response");
        return;
      }

      const data = await response.json();
      console.log("Received data:", data);

      // Extract the reply from the API response
      const reply = Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No response generated";

      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      console.error("Chatbot API error:", errorMessage);
      setError(errorMessage);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "bot" ? "bot" : "user"}`}
          >
            {msg.content}
          </div>
        ))}
        {error && <div className="error">{error}</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input-box"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}
