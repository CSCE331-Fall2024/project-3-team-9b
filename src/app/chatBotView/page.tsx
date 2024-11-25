"use client";

import React, { useState } from 'react';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch('/api/chatBot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.reply) {
        setResponses((prev) => [...prev, `You: ${input}`, `Bot: ${data.reply}`]);
      } else {
        setResponses((prev) => [...prev, `You: ${input}`, 'Bot: No response received']);
      }

      setInput('');
    } catch (error) {
      console.error('Error:', error);
      setResponses((prev) => [...prev, 'Bot: Failed to get a response']);
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.chatWindow as React.CSSProperties}>
        <div style={styles.messages as React.CSSProperties}>
          {responses.map((resp, index) => (
            <div
              key={index}
              style={
                resp.startsWith('You:')
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
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
  },
  chatWindow: {
    width: '80%',
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    marginTop: '20px',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '60%',
    wordWrap: 'break-word',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '60%',
    wordWrap: 'break-word',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '16px',
    color: '#333',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Chatbot;
