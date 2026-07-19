import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFire,
  FaBolt,
  FaGraduationCap,
  FaChartLine,
  FaArrowRight,
  FaBookOpen,
  FaBrain,
  FaVideo,
  FaClipboardCheck,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Card from "../../components/Card/Card";
import { TOPICS, findTopic } from "../../data/topics";
import { LEVEL_ORDER, QUIZ_LEVELS } from "../../data/quiz";
import { getCurrentUser, refreshUserFromServer } from "../../utils/userStore";
import "./dashboard.css";
const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function TopicRing({ topic, done, navigate }) {
  const percent = done ? 100 : 0;
  const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;

  return (
    <div
      className="dash-ring-card"
      onClick={() => navigate(`/learn/${topic.id}`)}
      role="button"
      tabIndex={0}
    >
      <svg width="72" height="72" viewBox="0 0 72 72" className="dash-ring-svg">
        <circle cx="36" cy="36" r={RING_RADIUS} className="dash-ring-track" />
        <circle
          cx="36"
          cy="36"
          r={RING_RADIUS}
          className="dash-ring-progress"
          stroke={topic.color || "#6366f1"}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="dash-ring-label">{topic.name}</span>
      <span className="dash-ring-status">
        {done ? "Completed" : "Not started"}
      </span>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Pull THIS user's own progress from the database on every visit,
    // so the dashboard never shows another account's activity.
    if (user) {
      refreshUserFromServer(user).then(setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visited = [...new Set(user?.visitedTopics || [])];
  const quizScore = user?.quizScore || {};

  // Topic Progress
  const completedTopics = visited.length;
  const topicPercent = Math.round((completedTopics / TOPICS.length) * 100);

  // Quiz Progress
  const attemptedLevels = LEVEL_ORDER.filter((lvl) => quizScore[lvl]);

  const [remoteTopics, setRemoteTopics] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/topics")
      .then((res) => res.json())
      .then((data) => setRemoteTopics(Array.isArray(data) ? data : []))
      .catch(() => setRemoteTopics([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  // Prefer whatever the backend has seeded; fall back to the local topic
  // library so the dashboard always has something meaningful to show.
  const displayTopics =
    remoteTopics.length > 0
      ? remoteTopics.map(
          (t) =>
            findTopic(t.topic) || {
              id: t.topic,
              name: t.topic,
              color: "#6366f1",
            },
        )
      : TOPICS;

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  const nextTopic =
    visited.length > 0 ? visited[visited.length - 1] : TOPICS[0].id;

  const timelineEvents = [
    ...visited
      .slice(-3)
      .reverse()
      .map((id) => {
        const t = findTopic(id);
        return { key: `topic-${id}`, text: `Explored ${t ? t.name : id}` };
      }),
    ...attemptedLevels.map((lvl) => ({
      key: `quiz-${lvl}`,
      text: `${QUIZ_LEVELS[lvl].label} Quiz — ${quizScore[lvl].score}/${quizScore[lvl].total} (${quizScore[lvl].percent}%)`,
    })),
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="flex">
        <Sidebar />

        {/* Main */}
        < div className="flex-1 p-6 md:p-8">
          {/* Hero */}
          <div className="dash-hero">
            <div className="dash-hero-top">
              <div>
                <div className="dash-eyebrow">Your learning snapshot</div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {greeting}, {user.name} 👋
                </h1>
              </div>

              <div className="dash-streak-chip">
                <FaFire className="text-orange-400" />
                <span>Keep Learning 🔥</span>
              </div>
            </div>

            <div className="dash-pill-row">
              <div className="dash-pill">
                <div
                  className="dash-pill-icon"
                  style={{
                    background: "rgba(99,102,241,0.25)",
                    color: "#a5b4fc",
                  }}
                >
                  <FaBookOpen />
                </div>
                <div className="dash-pill-value">{completedTopics}</div>
                <div className="dash-pill-label">Topics Learned</div>
              </div>

              <div className="dash-pill">
                <div
                  className="dash-pill-icon"
                  style={{
                    background: "rgba(16,185,129,0.2)",
                    color: "#6ee7b7",
                  }}
                >
                  <MdQuiz />
                </div>
                <div className="dash-pill-value">{attemptedLevels.length}</div>
                <div className="dash-pill-label">Quizzes Taken</div>
              </div>

              <div className="dash-pill">
                <div
                  className="dash-pill-icon"
                  style={{
                    background: "rgba(234,179,8,0.2)",
                    color: "#fde047",
                  }}
                >
                  <FaBolt />
                </div>
                <div className="dash-pill-value">{completedTopics * 50}</div>
                <div className="dash-pill-label">XP Earned</div>
              </div>

              <div className="dash-pill">
                <div
                  className="dash-pill-icon"
                  style={{
                    background: "rgba(244,63,94,0.2)",
                    color: "#fda4af",
                  }}
                >
                  <FaChartLine />
                </div>
                <div className="dash-pill-value">{topicPercent}%</div>
                <div className="dash-pill-label">Overall Progress</div>
              </div>
            </div>
          </div>

          {/* Continue learning spotlight */}
          <Card className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaGraduationCap className="text-indigo-600" /> Continue
                Learning
              </h2>
              <p className="mt-1 text-gray-500">
                {visited.length > 0
                  ? `Pick up where you left off: ${findTopic(nextTopic)?.name}`
                  : "Start your first Data Structure topic"}
              </p>
            </div>

            <button
              className="shrink-0 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              onClick={() => navigate(`/learn/${nextTopic}`)}
            >
              Continue <FaArrowRight className="text-sm" />
            </button>
          </Card>

          
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800">Quick Access</h2>

              <p className="text-gray-500">
                Jump directly to the features you use the most.
              </p>
          
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Learn */}
            <Card
              hoverable
              className="group cursor-pointer rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/learn")}
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mb-5 group-hover:scale-110 transition">
                <FaBookOpen />
              </div>

              <h3 className="text-xl font-bold text-gray-800">Learn</h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Explore theory, algorithms, code examples and interactive
                visualizations.
              </p>

              <div className="mt-5 flex items-center text-indigo-600 font-semibold">
                Start Learning
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition" />
              </div>
            </Card>

            {/* Quiz */}
            <Card
              hoverable
              className="group cursor-pointer rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/quiz")}
            >
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-5 group-hover:scale-110 transition">
                <FaClipboardCheck />
              </div>

              <h3 className="text-xl font-bold text-gray-800">Quiz</h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Test your understanding and unlock higher difficulty levels.
              </p>

              <div className="mt-5 flex items-center text-green-600 font-semibold">
                Take Quiz
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition" />
              </div>
            </Card>

            {/* Videos */}
            <Card
              hoverable
              className="group cursor-pointer rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/video-tutorials")}
            >
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center text-red-600 text-2xl mb-5 group-hover:scale-110 transition">
                <FaVideo />
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                Video Tutorials
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Watch animated demonstrations of every important data structure.
              </p>

              <div className="mt-5 flex items-center text-red-600 font-semibold">
                Watch Videos
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition" />
              </div>
            </Card>

            {/* AI Tutor */}
            <Card
              hoverable
              className="group cursor-pointer rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/chatbot")}
            >
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl mb-5 group-hover:scale-110 transition">
                <FaBrain />
              </div>

              <h3 className="text-xl font-bold text-gray-800">AI Tutor</h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Ask questions and receive AI-powered explanations instantly.
              </p>

              <div className="mt-5 flex items-center text-purple-600 font-semibold">
                Ask AI
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition" />
              </div>
            </Card>
          </div>
          </div> 


          {/* Recent activity timeline */}
          <Card className="mt-10">
            <h2 className="text-xl font-bold mb-5 text-gray-800">
              Recent Activity
            </h2>

            {timelineEvents.length > 0 ? (
              <div className="dash-timeline">
                {timelineEvents.map((ev) => (
                  <div className="dash-timeline-item" key={ev.key}>
                    <div className="dash-timeline-dot" />
                    <span className="text-gray-600">{ev.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                👋 Visit the Learn page to start exploring topics.
              </p>
            )}

            <button
              className="mt-5 text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              onClick={() => navigate("/progress")}
            >
              View full progress <FaArrowRight className="text-xs" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
