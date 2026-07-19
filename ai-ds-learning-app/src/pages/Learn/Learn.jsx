import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import Card from "../../components/Card/Card";
import { TOPICS } from "../../data/topics";
import { getCurrentUser, refreshUserFromServer } from "../../utils/userStore";

function Learn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  const visited = user?.visitedTopics || [];

  useEffect(() => {
    // Ping the backend just to confirm topics are seeded; the content
    // shown always comes from the local topic library so the page
    // works even before the database has been populated.
    fetch("http://127.0.0.1:5000/topics")
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Refresh THIS user's own visited-topic list so the "Visited" badges
    // are always correct for whoever is currently logged in.
    if (user) {
      refreshUserFromServer(user).then(setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Learn Data Structures
          </h1>
          <p className="text-gray-500 mt-2 mb-8">
            Pick a topic to explore its theory, 3D visualization, and code.
          </p>

          <div
            onClick={() => navigate("/video-tutorials")}
            className="mb-8 cursor-pointer rounded-2xl p-6 flex items-center justify-between gap-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <div className="flex items-center gap-4">
              <FaPlayCircle className="text-4xl shrink-0" />
              <div>
                <h3 className="text-xl font-bold">New: Video Tutorials</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Watch quick animated GIF walkthroughs of every core topic before diving into the full 3D lesson.
                </p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl font-semibold whitespace-nowrap">
              Watch Now <FaArrowRight />
            </span>
          </div>

          {loading ? (
            <Loader label="Loading topics..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOPICS.map((topic) => (
                <Card
                  key={topic.id}
                  hoverable={!topic.comingSoon}
                  className={`relative overflow-hidden ${topic.comingSoon ? "opacity-80" : ""}`}
                >
                  {topic.comingSoon ? (
                    <span className="absolute top-4 right-4 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  ) : (
                    visited.includes(topic.id) && (
                      <span className="absolute top-4 right-4 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Visited
                      </span>
                    )
                  )}
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: topic.color }}
                  >
                    {topic.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{topic.name}</h3>
                  <p className="text-gray-500 mt-2 text-sm">{topic.tagline}</p>
                  {topic.subtypes?.length > 1 && (
                    <p className="text-xs font-semibold text-indigo-500 mt-2">
                      {topic.subtypes.length} types · {topic.subtypes.map((s) => s.name).join(", ")}
                    </p>
                  )}

                  <button
                    onClick={() => !topic.comingSoon && navigate(`/learn/${topic.id}`)}
                    disabled={topic.comingSoon}
                    className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                  >
                    {topic.comingSoon ? "Coming Soon" : "Start Learning"}
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Learn;
