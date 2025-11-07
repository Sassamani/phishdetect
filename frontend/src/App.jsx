import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("https://phishdetect-chje.onrender.com/api/detect", { text });
      setResult(res.data);
    } catch {
      setResult({ error: "Error connecting to API" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setResult(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const getColor = (label) => {
    if (label === "Phishing") return "#e74c3c";
    if (label === "Legitimate") return "#27ae60";
    return "#555";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #0a1931, #185adb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "10px" : "40px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: isMobile ? "25px" : "40px",
          width: isMobile ? "100%" : "90%",
          maxWidth: "900px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#0a1931",
            marginBottom: "10px",
            fontSize: isMobile ? "1.8rem" : "2.5rem",
          }}
        >
          PhishDetect
        </h1>
        <p
          style={{
            color: "#555",
            marginBottom: "25px",
            fontSize: isMobile ? "0.95rem" : "1.1rem",
          }}
        >
          Detect phishing attempts using AI.
        </p>

        <textarea
          ref={textareaRef}
          rows={isMobile ? 6 : 10}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: isMobile ? "14px" : "16px",
            resize: "none",
            outline: "none",
          }}
          placeholder="Paste your email content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "18px" }}>
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              background: loading ? "#aaa" : "#185adb",
              color: "white",
              border: "none",
              padding: isMobile ? "10px 22px" : "12px 35px",
              borderRadius: "8px",
              cursor: loading ? "default" : "pointer",
              fontSize: isMobile ? "15px" : "17px",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => { if (!loading) e.target.style.background = "#0a1931"; }}
            onMouseOut={(e) => { if (!loading) e.target.style.background = "#185adb"; }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button
            onClick={reset}
            style={{
              background: "#f0f0f0",
              color: "#0a1931",
              border: "1px solid #d0d0d0",
              padding: isMobile ? "10px 22px" : "12px 28px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: isMobile ? "15px" : "17px",
            }}
          >
            Reset
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: isMobile ? "15px" : "20px",
              borderRadius: "8px",
              background: "#f5f6fa",
              borderLeft: `8px solid ${getColor(result.label)}`,
              textAlign: "left",
              fontSize: isMobile ? "1rem" : "1.1rem",
            }}
          >
            {result.error ? (
              <p style={{ color: "red" }}>{result.error}</p>
            ) : (
              <>
                <p>
                  <strong>Label:</strong>{" "}
                  <span style={{ color: getColor(result.label) }}>{result.label}</span>
                </p>
                <p>
                  <strong>Confidence:</strong> {result.confidence}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
