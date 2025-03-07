"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ type: string; content: string }>
  >([
    {
      type: "bot",
      content:
        "Hello! I'm your blockchain expert assistant. Ask me anything about blockchain, cryptocurrencies, or web3 technologies. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval reference
  const fullResponseRef = useRef<string>(""); // Store the complete response

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Function to type text gradually
  const typeText = (text: string, onUpdate: (partialText: string) => void) => {
    let index = 0;
    fullResponseRef.current = text; // Store the full response
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        onUpdate(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setIsTyping(false);
      }
    }, 5); // Typing speed - slightly faster than before
  };

  // Function to stop typing immediately and show the full response
  const stopResponse = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;

      setIsTyping(false);
    }
  };

  // Handle sending message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch("/api/blockchain-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setIsLoading(false);

      // Add empty bot message that will be updated
      let currentMessage = { type: "bot", content: "" };
      setMessages((prev) => [...prev, currentMessage]);

      // Gradually type out the bot response
      typeText(data.response, (partialText) => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          if (lastIndex >= 0 && updatedMessages[lastIndex].type === "bot") {
            updatedMessages[lastIndex] = {
              type: "bot",
              content: partialText,
            };
          }
          return updatedMessages;
        });
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-grid-pattern">
      <div className="w-full max-w-4xl p-4 h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
            Blockchain Expert
          </h1>
          <p className="text-gray-600 mt-2">
            Your AI guide to all things blockchain and crypto
          </p>
        </header>

        {/* Chat container */}
        <div className="flex-grow bg-white bg-opacity-80 rounded-lg shadow-lg p-4 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-pastel-purple text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading Indicator (only visible when waiting for API) */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-0"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form & Buttons */}
        <div className="flex gap-2">
          <form onSubmit={sendMessage} className="flex flex-1 gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blockchain..."
              className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pastel-purple"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="bg-pastel-purple hover:bg-pastel-purple-dark text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              disabled={isLoading || isTyping || !input.trim()}
            >
              <Send size={20} />
            </button>
          </form>

          {/* Stop Button (Only visible when typing) */}
          {isTyping && (
            <button
              type="button"
              onClick={stopResponse}
              className="bg-pastel-purple bg-opacity-90 hover:bg-opacity-100 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Stop typing"
              title="Stop typing and show full response"
            >
              <Square size={20} fill="white" className="animate-pulse" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
