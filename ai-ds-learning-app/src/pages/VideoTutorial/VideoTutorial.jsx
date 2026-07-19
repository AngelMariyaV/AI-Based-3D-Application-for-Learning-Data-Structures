import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Card from "../../components/Card/Card";
import { getCurrentUser } from "../../utils/userStore";
import "./videoTutorial.css";

// Each entry drives one looping "GIF" preview built entirely out of CSS/SVG
// animations, so it plays instantly, needs no network request, and always
// matches the app's own visual style. `render` returns the animated markup
// shown inside the dark player frame.

const TUTORIALS = [
  {
    id: "array",
    title: "Array",
    duration: "0:45",
    summary:
      "See how every element sits in contiguous memory so any index can be reached in O(1) — watch the scan sweep across the cells.",
    render: () => (
      <div className="demo-array">
        {[10, 20, 30, 40, 50].map((v, i) => (
          <div className="cell" key={i}>
            {v}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "stack",
    title: "Stack",
    duration: "0:38",
    summary:
      "Last In, First Out in action — a value pushed on top is always the first one popped back off.",
    render: () => (
      <div className="demo-stack">
        <div className="cell">C · top</div>
        <div className="cell">B</div>
        <div className="cell">A</div>
      </div>
    ),
  },
  {
    id: "queue",
    title: "Queue",
    duration: "0:42",
    summary:
      "First In, First Out — new items enter from the rear and leave from the front, in the exact order they arrived.",
    render: () => (
      <div className="demo-queue-track">
        <div className="demo-queue-labels">
          <span>FRONT</span>
          <span>REAR</span>
        </div>
        <div className="cell">A</div>
        <div className="cell">B</div>
        <div className="cell">C</div>
        <div className="cell">D</div>
      </div>
    ),
  },
  {
    id: "linkedlist",
    title: "Linked List",
    duration: "0:50",
    summary:
      "Nodes aren't stored next to each other in memory — each one just points to the next, so a pointer hops node to node to traverse.",
    render: () => (
      <div className="demo-linkedlist">
        <div className="node">A</div>
        <div className="arrow" />
        <div className="node">B</div>
        <div className="arrow" />
        <div className="node">C</div>
        <div className="arrow" />
        <div className="node">D</div>
      </div>
    ),
  },
  {
    id: "tree",
    title: "Tree",
    duration: "0:55",
    summary:
      "A hierarchical structure of parent and child nodes — watch a level-order traversal light each node up top to bottom.",
    render: () => (
      <svg viewBox="0 0 200 130" className="demo-tree" width="200" height="130">
        <g stroke="#475569" strokeWidth="2">
          <line x1="100" y1="24" x2="55" y2="66" />
          <line x1="100" y1="24" x2="145" y2="66" />
          <line x1="55" y1="66" x2="30" y2="108" />
          <line x1="55" y1="66" x2="80" y2="108" />
          <line x1="145" y1="66" x2="120" y2="108" />
          <line x1="145" y1="66" x2="170" y2="108" />
        </g>
        {[
          { cx: 100, cy: 24, label: "F", delay: "0s" },
          { cx: 55, cy: 66, label: "B", delay: "0.5s" },
          { cx: 145, cy: 66, label: "G", delay: "0.65s" },
          { cx: 30, cy: 108, label: "A", delay: "1s" },
          { cx: 80, cy: 108, label: "D", delay: "1.15s" },
          { cx: 120, cy: 108, label: "I", delay: "1.3s" },
        ].map((n, i) => (
          <g key={i}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r="16"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
              style={{ animationDelay: n.delay }}
            />
            <text
              x={n.cx}
              y={n.cy + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#e2e8f0"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "graph",
    title: "Graph",
    duration: "1:02",
    summary:
      "Vertices connected by edges, with a pulse tracing a BFS-style path — the foundation for routing, dependencies, and networks.",
    render: () => (
      <svg
        viewBox="0 0 200 140"
        className="demo-graph"
        width="200"
        height="140"
      >
        <g stroke="#475569" strokeWidth="2">
          <line x1="40" y1="30" x2="100" y2="20" />
          <line x1="40" y1="30" x2="35" y2="100" />
          <line x1="100" y1="20" x2="160" y2="35" />
          <line x1="100" y1="20" x2="100" y2="90" />
          <line x1="160" y1="35" x2="150" y2="105" />
          <line x1="35" y1="100" x2="100" y2="90" />
          <line x1="100" y1="90" x2="150" y2="105" />
        </g>
        {[
          { cx: 40, cy: 30, label: "1", delay: "0s" },
          { cx: 100, cy: 20, label: "2", delay: "0.4s" },
          { cx: 160, cy: 35, label: "3", delay: "0.8s" },
          { cx: 35, cy: 100, label: "4", delay: "1.2s" },
          { cx: 100, cy: 90, label: "5", delay: "1.6s" },
          { cx: 150, cy: 105, label: "6", delay: "2s" },
        ].map((n, i) => (
          <g key={i}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r="15"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
              style={{ animationDelay: n.delay }}
            />
            <text
              x={n.cx}
              y={n.cy + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#e2e8f0"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    ),
  },
];

function VideoTutorial() {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());
  const [showModal, setShowModal] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10">
          <div className="flex items-center gap-3">
            <FaPlayCircle className="text-3xl text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Video Tutorials
            </h1>
          </div>
          <p className="text-gray-500 mt-2 mb-8 max-w-2xl">
            Quick, looping animated previews of every core topic already
            available on the site. Watch one to get the gist in seconds, then
            jump into the full theory, 3D visualizer, and code for that topic.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TUTORIALS.map((tutorial) => (
              <Card
                key={tutorial.id}
                hoverable
                padded={false}
                className="overflow-hidden"
              >
                <div
                  className="gif-frame"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open full tutorial for ${tutorial.title}`}
                  onClick={() => {
                    setSelectedVideo(tutorial);
                    setShowModal(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedVideo(tutorial);
                      setShowModal(true);
                    }
                  }}
                >
                  <span className="gif-badge">GIF</span>
                  <span className="gif-loop-badge">
                    ⟳ Loops · {tutorial.duration}
                  </span>
                  <div className="gif-play-overlay">
                    <FaPlayCircle />
                  </div>
                  {tutorial.render()}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    {tutorial.summary}
                  </p>

                  <button
                    onClick={() => navigate(`/learn/${tutorial.id}`)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Open Full Tutorial <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
          {showModal && selectedVideo && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl w-[700px] p-5 relative">
                <button
                  className="absolute right-4 top-3 text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4">
                  {selectedVideo.title}
                </h2>

                <div className="bg-slate-900 rounded-xl h-80 flex justify-center items-center">
                  {selectedVideo.render()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoTutorial;
