import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FaArrowLeft, FaPaperPlane, FaRobot } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import "./chatbot.css";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question,
      });

      setAnswer(String(res.data.answer || ""));
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the AI Tutor. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      askAI();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
            <FaRobot />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">AI Tutor</h1>
            <p className="text-sm text-gray-400">Ask anything about Data Structures</p>
          </div>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Explain how a stack works with a real-life example..."
          className="w-full border rounded-xl p-4 h-36 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Tip: Ctrl / Cmd + Enter to send</p>
          <button
            onClick={askAI}
            disabled={loading || !question.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            <FaPaperPlane />
            {loading ? "Thinking..." : "Ask AI Tutor"}
          </button>
        </div>

        {loading && <Loader label="Consulting the AI tutor..." />}

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && answer && (
          <div className="mt-8 bg-gray-50 border border-gray-100 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3 text-gray-800">Answer</h2>
            <div className="chatbot-markdown text-gray-700">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBot;
