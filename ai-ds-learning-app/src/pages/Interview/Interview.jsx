import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChalkboardTeacher,
  FaPaperPlane,
  FaRedo,
  FaStopCircle,
  FaUserTie,
  FaRobot,
} from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import { API_BASE, getCurrentUser } from "../../utils/userStore";
import "./interview.css";

const DIFFICULTIES = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

const QUESTION_COUNTS = [3, 5, 7];

// stage: "setup" | "loading" | "chat" | "submitting" | "finishing" | "results" | "error"
function Interview() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [stage, setStage] = useState("setup");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [errorMsg, setErrorMsg] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(numQuestions);
  const [messages, setMessages] = useState([]); // {role: 'ai'|'user'|'feedback', text}
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, stage]);

  const startInterview = async () => {
    setStage("loading");
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_BASE}/interview/start`, {
        email: user?.email,
        difficulty,
        numQuestions,
      });

      const data = res.data;
      setSessionId(data.sessionId);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setMessages([{ role: "ai", text: data.question, topic: data.topic }]);
      setResults(null);
      setAnswer("");
      setStage("chat");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Unable to reach the AI Interviewer. Make sure the backend server is running."
      );
      setStage("error");
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || stage === "submitting") return;

    const givenAnswer = answer;
    setMessages((prev) => [...prev, { role: "user", text: givenAnswer }]);
    setAnswer("");
    setStage("submitting");

    try {
      const res = await axios.post(`${API_BASE}/interview/answer`, {
        sessionId,
        answer: givenAnswer,
      });

      const data = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "feedback",
          text: data.feedback,
          correct: data.correct,
        },
      ]);

      if (data.finished) {
        setResults(data.scores);
        setStage("results");
        return;
      }

      setQuestionNumber(data.questionNumber);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.nextQuestion, topic: data.topic },
      ]);
      setStage("chat");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong grading that answer. Please try again.");
      setStage("chat");
    }
  };

  const endEarly = async () => {
    if (!sessionId) return;
    setStage("finishing");
    try {
      const res = await axios.post(`${API_BASE}/interview/end`, { sessionId });
      setResults(res.data);
      setStage("results");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not end the interview cleanly. Please try again.");
      setStage("chat");
    }
  };

  const resetInterview = () => {
    setSessionId(null);
    setMessages([]);
    setAnswer("");
    setResults(null);
    setErrorMsg("");
    setStage("setup");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      submitAnswer();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 min-h-[70vh] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                <FaChalkboardTeacher />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
                  AI Mock Interview
                </h1>
                <p className="text-sm text-gray-400">
                  Practice a live Data Structures interview with an AI interviewer
                </p>
              </div>
            </div>

            {stage === "setup" && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-8">
                  <p className="font-semibold text-gray-700 mb-3">Difficulty</p>
                  <div className="flex gap-3 flex-wrap">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`px-5 py-2 rounded-xl font-medium border transition-colors ${
                          difficulty === d.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <p className="font-semibold text-gray-700 mb-3">
                    Number of questions
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {QUESTION_COUNTS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setNumQuestions(n)}
                        className={`px-5 py-2 rounded-xl font-medium border transition-colors ${
                          numQuestions === n
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-6 bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={startInterview}
                  className="self-start flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <FaUserTie /> Start Interview
                </button>
              </div>
            )}

            {stage === "loading" && (
              <div className="flex-1 flex items-center justify-center">
                <Loader label="Setting up your interviewer..." />
              </div>
            )}

            {stage === "error" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                  {errorMsg}
                </div>
                <button
                  onClick={resetInterview}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <FaRedo /> Back to Setup
                </button>
              </div>
            )}

            {(stage === "chat" || stage === "submitting" || stage === "finishing") && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-indigo-600">
                    Question {questionNumber} of {totalQuestions}
                  </span>
                  <button
                    onClick={endEarly}
                    disabled={stage === "finishing"}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                  >
                    <FaStopCircle /> End Interview
                  </button>
                </div>

                <div
                  ref={scrollRef}
                  className="interview-scroll flex-1 overflow-y-auto rounded-xl bg-slate-50 border border-gray-100 p-4 space-y-3 mb-4"
                >
                  {messages.map((m, i) => {
                    if (m.role === "ai") {
                      return (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            <FaRobot />
                          </div>
                          <div className="interview-bubble interview-bubble-ai">
                            {m.topic && (
                              <span className="interview-topic-tag">{m.topic}</span>
                            )}
                            <p>{m.text}</p>
                          </div>
                        </div>
                      );
                    }
                    if (m.role === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div className="interview-bubble interview-bubble-user">
                            {m.text}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={i}
                        className={`interview-feedback ${
                          m.correct ? "interview-feedback-good" : "interview-feedback-bad"
                        }`}
                      >
                        {m.correct ? "✔ " : "✦ "}
                        {m.text}
                      </div>
                    );
                  })}

                  {(stage === "submitting" || stage === "finishing") && (
                    <Loader
                      size="sm"
                      label={stage === "finishing" ? "Scoring your interview..." : "Interviewer is thinking..."}
                    />
                  )}
                </div>

                {errorMsg && (
                  <div className="mb-3 bg-red-50 text-red-600 rounded-xl p-3 text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="flex items-end gap-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={stage !== "chat"}
                    placeholder="Type your answer..."
                    className="flex-1 border rounded-xl p-3 h-20 resize-none focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50"
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={stage !== "chat" || !answer.trim()}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                  >
                    <FaPaperPlane /> Send
                  </button>
                </div>
              </div>
            )}

            {stage === "results" && results && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Interview Results
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <ScoreCard label="Communication" score={results.communication} />
                  <ScoreCard label="Technical Knowledge" score={results.technical} />
                  <ScoreCard label="Confidence" score={results.confidence} />
                </div>

                <div className="bg-indigo-50 rounded-xl p-5 mb-6">
                  <p className="font-semibold text-indigo-800 mb-2">Interviewer Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {results.overall}
                  </p>
                </div>

                {Array.isArray(results.transcript) && results.transcript.length > 0 && (
                  <div className="mb-6">
                    <p className="font-semibold text-gray-700 mb-3">Transcript</p>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {results.transcript.map((t, i) => (
                        <div
                          key={i}
                          className="border border-gray-100 rounded-xl p-3 text-sm bg-white"
                        >
                          <p className="font-medium text-gray-800">
                            Q{i + 1}. {t.question}
                          </p>
                          <p className="text-gray-500 mt-1">
                            Your answer: {t.answer || "(no answer given)"}
                          </p>
                          <p
                            className={`mt-1 font-medium ${
                              t.correct ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {t.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={resetInterview}
                  className="self-start flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <FaRedo /> Start Another Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, score }) {
  const pct = Math.max(0, Math.min(10, score || 0)) * 10;
  return (
    <div className="border border-gray-100 rounded-xl p-4 text-center bg-white">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-indigo-600 mb-2">{score}/10</p>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default Interview;
