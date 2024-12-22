import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from './Component/NavBar';

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

    const questions = [
      "who made you?",
      "who created you?",
      "who developed you?"
    ];

    const predefinedAnswer = "I was made by Google, but integrated by Shariph Thapa.";

    const lowerInput = input.trim().toLowerCase();
    if (questions.some((question) => lowerInput.includes(question))) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: predefinedAnswer },
      ]);
      setInput("");
      return;
    }

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

  const cardContents = [
    {
      title: "GEMINI AI",
      description: "Explore the GEMINI AI Created by Google using LLM",
      link: "https://ai.google.dev/gemini-api/docs"
    },
    {
      title: "GITHUB REPO",
      description: "Explore The Full Repository of this Application",
      link: "https://github.com/Shariph7/Chat-Ai"
    },
    {
      title: "IDEA",
      description: "Want Some React Component for Best UI Design?",
      link: "https://ui.aceternity.com/components",
    },
    {
      title: "NEW AI TOOLS",
      description: "Explore Some New AI Tools in the Market!",
      link: "https://www.toolify.ai/",
    },
  ];

  const buttonStyle = {
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    maxWidth: "300px",
    margin: "10px auto",
    display: "block",
    textAlign: "left",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };
  
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#444";
  };
  
  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "#333";
  };
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="sidebar"><br></br><br></br><br></br>
        <button onClick={() => setMessages([])}>+ New Chat</button>
        <button
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      🥅 OverView
    </button>
    <button
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      👤 User
    </button>
    <button
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      💬 Messages
    </button>
    <button
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      🅰️ Activity
    </button>
    <button
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      📈 Statistics
    </button>
      </div>
      
      <Navbar />
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

          {messages.length === 0 ? (
            <div className="cards">
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
                  onClick={() => window.open(card.link, "_blank")}
                >
                  <b><h1>{card.title}</h1></b>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="messages"
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
              padding: "17px",
              border: "none",
              borderRadius: "8px",
              marginRight: "5px"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "17px 25px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "5px",
              marginRight: "5px"
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