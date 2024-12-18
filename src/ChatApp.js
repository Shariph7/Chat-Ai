import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI("AIzaSyC09fXG8iduP7azHLz3j1j3DxHvg84P2Z4");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-pro" });

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const chatSessionRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (!chatSessionRef.current) {
      chatSessionRef.current = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        history: [],
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      let fullResponse = "";
      const result = await chatSessionRef.current.sendMessageStream(input);

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", isGenerating: true },
      ]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", text: fullResponse, isGenerating: true },
        ]);
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: fullResponse, isGenerating: false },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error during API call:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, there is an error!" },
      ]);
    }
  };

  const MarkdownComponent = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  // Define card content dynamically
  const cardContents = [
    {
      title: "GEMINI AI",
      description: "Explore the GEMINI AI Created by Google using LLM",
    },
    {
      title: "GITHUB REPO",
      description: "Explore The Full Repository of this Application",
    },
    {
      title: "IDEA",
      description: "Explore what happening in AI World!",
    },
    {
      title: "PROJECT",
      description: "Explore the Some Ongoing projects hereby!",
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Chat Pro+</h1>
        <button onClick={() => setMessages([])}>+ New Chat</button>
      </div>

      {/* Main Section */}
      <div
        className="main"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <div className="content">
          <div className="hello-section">
            <h1>
              Chat Pro+ <span>Plus</span>
            </h1>
            <div>Hello, how can I help you?</div>
          </div>

          {/* Cards Section (Only show if no active chat) */}
          {messages.length === 0 ? (
            <div
              className="cards"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                justifyItems: "center",
                alignItems: "center",
                flexGrow: 1,
                padding: "20px",
                textAlign: "center",
              }}
            >
              {cardContents.map((card, index) => (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#212529",
                    color: "white",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => console.log(`Card ${index + 1} clicked`)}
                >
                  <b><h1>{card.title}</h1></b>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="cards"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "55px",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      backgroundColor:
                        message.sender === "user" ? "#007BFF" : "#212529",
                      color: message.sender === "user" ? "#FFFFFF" : "#F8F9FA",
                    }}
                  >
                    {message.sender === "user" ? (
                      message.text
                    ) : (
                      <ReactMarkdown
                        components={MarkdownComponent}
                        className={`prose ${message.isGenerating ? "typing-animation" : ""}`}
                      >
                        {message.text || "Thinking..."}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message-row ai-message">
                  <div className="typing-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        <form
          className="footer"
          onSubmit={handleSubmit}
          style={{ display: "flex", backgroundColor: "#212529" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Chat Pro+"
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "8px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 30px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatApp;