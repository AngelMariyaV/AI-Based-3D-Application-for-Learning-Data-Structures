import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCube, FaBook, FaCode } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Theory from "../Theory.jsx";
import CodeViewer from "../CodeViewer.jsx";
import { getCurrentUser, markTopicVisited } from "../../utils/userStore";

const TABS = [
  { key: "visualize", label: "Visualize", icon: FaCube },
  { key: "theory", label: "Theory", icon: FaBook },
  { key: "code", label: "Code", icon: FaCode },
];

/**
 * Shared shell for every data-structure page: navbar, sidebar,
 * heading, a subtype switcher (e.g. Singly / Doubly / Circular ...),
 * and a Visualize / Theory / Code tab switcher.
 *
 * subtypes: [{ id, name, tagline, theory, code }]
 * activeSubtype: the currently selected subtype id
 * onSubtypeChange: (id) => void
 */
function TopicShell({ topic, subtypes = [], activeSubtype, onSubtypeChange, children }) {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());

  const [tab, setTab] = useState("visualize");

  const current = subtypes.find((s) => s.id === activeSubtype) || subtypes[0] || null;

  useEffect(() => {
    // Mark this topic as visited for THIS logged-in user only, so two
    // different accounts never see each other's visited topics.
    if (topic && user) {
      markTopicVisited(user, topic.id);
    }
  }, [topic, user]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar user={user} />
        <div className="p-10 text-center text-gray-500">Topic not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          <button
            onClick={() => navigate("/learn")}
            className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:underline"
          >
            <FaArrowLeft /> Back to Learn
          </button>

          <div className="flex items-center gap-3 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: topic.color }}
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{topic.name}</h1>
          </div>
          <p className="text-gray-500 mb-6">{topic.tagline}</p>

          {subtypes.length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Type
              </p>
              <div className="flex flex-wrap gap-2">
                {subtypes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSubtypeChange?.(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                      s.id === current?.id
                        ? "text-white shadow"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                    style={
                      s.id === current?.id
                        ? { backgroundColor: topic.color, borderColor: topic.color }
                        : undefined
                    }
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              {current?.tagline && (
                <p className="text-sm text-gray-500 mt-2">{current.tagline}</p>
              )}
            </div>
          )}

          <div className="flex gap-2 mb-6 bg-white w-fit rounded-xl p-1.5 shadow">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === key
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>

          {tab === "visualize" && children}
          {tab === "theory" && <Theory theory={current?.theory} />}
          {tab === "code" && <CodeViewer code={current?.code} />}
        </div>
      </div>
    </div>
  );
}

export default TopicShell;
