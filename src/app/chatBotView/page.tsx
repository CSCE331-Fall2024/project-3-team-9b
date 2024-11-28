"use client";

import React, { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch("/_api/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.reply) {
        setResponses((prev) => [...prev, `You: ${input}`, `Bot: ${data.reply}`]);
      } else {
        setResponses((prev) => [...prev, `You: ${input}`, "Bot: No response received"]);
      }

      setInput("");
    } catch (error) {
      console.error("Error:", error);
      setResponses((prev) => [...prev, "Bot: Failed to get a response"]);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.header as React.CSSProperties}>
        <span>Chatbot</span>
        <button onClick={toggleMinimize} style={styles.toggleButton as React.CSSProperties}>
          {isMinimized ? "+" : "−"}
        </button>
      </div>
      {!isMinimized && (
        <>
          <div style={styles.chatWindow as React.CSSProperties}>
            <div style={styles.messages as React.CSSProperties}>
              {responses.map((resp, index) => (
                <div
                  key={index}
                  style={
                    resp.startsWith("You:")
                      ? (styles.userMessage as React.CSSProperties)
                      : (styles.botMessage as React.CSSProperties)
                  }
                >
                  {resp}
                </div>
              ))}
            </div>
          </div>
          <div style={styles.inputContainer as React.CSSProperties}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              style={styles.input as React.CSSProperties}
            />
            <button onClick={handleSubmit} style={styles.button as React.CSSProperties}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    cursor: "pointer",
  },
  toggleButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },
  chatWindow: {
    maxHeight: "300px",
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  messages: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  userMessage: {
    alignSelf: "flex-start", // Align to the left
    backgroundColor: "#007BFF",
    color: "white",
    padding: "8px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordWrap: "break-word",
    fontSize: "14px",
  },
  botMessage: {
    alignSelf: "flex-end", 
    backgroundColor: "#e5e5e5",
    color: "#333",
    padding: "8px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordWrap: "break-word",
    fontSize: "14px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
    fontSize: "14px",
    color: "#333", // Ensure text is visible
    backgroundColor: "#ffffff",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Chatbot;
