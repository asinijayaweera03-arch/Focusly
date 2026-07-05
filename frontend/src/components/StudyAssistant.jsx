import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:4000/api/ai/chat";

function StudyAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && !image) return;

    const userMessage = {
      role: "user",
      text: input,
      image: image ? URL.createObjectURL(image) : null,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    const formData = new FormData();
    formData.append("message", input);
    formData.append(
      "history",
      JSON.stringify(
        messages.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }))
      )
    );
    if (image) formData.append("image", image);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setInput("");
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "600px",
        maxWidth: "700px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--card-border)",
          background: "var(--header-bg)",
          fontWeight: 600,
          fontSize: "16px",
          color: "var(--text)",
        }}
      >
        🎓 AI Study Assistant
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {messages.length === 0 && !loading && (
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            Ask a study question or upload an image to get started.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                style={{ maxWidth: "160px", borderRadius: "10px", marginBottom: "6px" }}
              />
            )}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "14px",
                background: msg.role === "user" ? "var(--accent)" : "var(--input-bg)",
                color: msg.role === "user" ? "#fff" : "var(--text)",
                border: msg.role === "user" ? "none" : "1px solid var(--card-border)",
                maxWidth: "75%",
                fontSize: "14px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          borderTop: "1px solid var(--card-border)",
          background: "var(--header-bg)",
        }}
      >
        <label
          style={{
            cursor: "pointer",
            fontSize: "18px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            background: image ? "var(--accent)" : "var(--input-bg)",
            border: "1px solid var(--card-border)",
            flexShrink: 0,
          }}
          title={image ? image.name : "Attach image"}
        >
          📎
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a study question..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--input-bg)",
            color: "var(--text)",
            fontSize: "14px",
            outline: "none",
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default StudyAssistant;