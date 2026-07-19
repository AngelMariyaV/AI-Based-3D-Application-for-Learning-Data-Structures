import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Card from "../../components/Card/Card";
import { TOPICS } from "../../data/topics";
import { LEVEL_ORDER, QUIZ_LEVELS, PASS_PERCENT } from "../../data/quiz";
import { FaCheckCircle, FaRegCircle, FaTrophy, FaLock } from "react-icons/fa";
import {
  getCurrentUser,
  refreshUserFromServer,
  isLevelUnlocked,
} from "../../utils/userStore";

function Progress() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    // Always pull THIS logged-in user's own record so Progress never
    // shows what a different account did on this browser.
    refreshUserFromServer(user).then(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visited = user?.visitedTopics || [];
  const quizScore = user?.quizScore || {};

  const completedTopics = [...new Set(visited)].length;

  const totalTopics = TOPICS.length;

const totalQuizLevels = LEVEL_ORDER.length;

const completedQuizLevels = Object.keys(quizScore).length;

const totalTasks = totalTopics + totalQuizLevels;

const completedTasks = completedTopics + completedQuizLevels;

const percent = Math.round(
  (completedTasks / totalTasks) * 100
);

  const xp = completedTopics * 50;
  const streak = completedTopics;
  const quizzesTaken = Object.keys(quizScore).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Your Progress
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <Card className="text-center">
              <h2 className="text-3xl font-bold text-indigo-600">
                {completedTopics}
              </h2>
              <p className="text-gray-500 mt-2">Topics</p>
            </Card>

            <Card className="text-center">
              <h2 className="text-3xl font-bold text-green-600">{xp}</h2>
              <p className="text-gray-500 mt-2">XP</p>
            </Card>

            <Card className="text-center">
              <h2 className="text-3xl font-bold text-yellow-500">
                {quizzesTaken}
              </h2>
              <p className="text-gray-500 mt-2">Quizzes</p>
            </Card>

            <Card className="text-center">
              <h2 className="text-3xl font-bold text-red-500">🔥 {streak}</h2>
              <p className="text-gray-500 mt-2">Streak</p>
            </Card>
          </div>

          <Card className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Topics Completed
              </h2>
              <span className="font-bold text-indigo-600">{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-5 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {completedTopics} of {TOPICS.length} topics completed
            </p>
          </Card>

          <Card className="mb-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {TOPICS.map((t) => {
                const done = visited.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/learn/${t.id}`)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 hover:border-indigo-500 hover:shadow-lg hover:scale-105 cursor-pointer transition duration-300"
                  >
                    {done ? (
                      <FaCheckCircle className="text-green-500 shrink-0" />
                    ) : (
                      <FaRegCircle className="text-gray-300 shrink-0" />
                    )}
                    <div>
                      <span
                        className={
                          done ? "text-gray-800 font-semibold" : "text-gray-400"
                        }
                      >
                        {t.name}
                      </span>

                      <p className="text-xs text-gray-400">
                        {done ? "Completed" : "Not Started"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="mb-8">
            <h2 className="text-xl font-bold mb-5">🏆 Achievements</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-yellow-50 rounded-xl text-center">
                🥇
                <p className="text-sm mt-2">First Topic</p>
              </div>

              <div className="p-4 bg-red-50 rounded-xl text-center">
                🔥
                <p className="text-sm mt-2">3 Day Streak</p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl text-center">
                🎯
                <p className="text-sm mt-2">Quiz Beginner</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-xl text-center opacity-40">
                🔒
                <p className="text-sm mt-2">DSA Master</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <FaTrophy className="text-amber-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Quiz Levels
              </h2>
            </div>

            <div className="space-y-3">
              {LEVEL_ORDER.map((lvl) => {
                const unlocked = isLevelUnlocked(user, lvl);
                const result = quizScore[lvl];
                const passed = result && result.percent >= PASS_PERCENT;

                return (
                  <div
                    key={lvl}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border border-gray-100 hover:shadow-md transition ${
                      unlocked ? "" : "opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {!unlocked ? (
                        <FaLock className="text-gray-300 shrink-0" />
                      ) : passed ? (
                        <FaCheckCircle className="text-green-500 shrink-0" />
                      ) : (
                        <FaRegCircle className="text-gray-300 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {QUIZ_LEVELS[lvl].label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result
                            ? `Best: ${result.score}/${result.total} (${result.percent}%)`
                            : unlocked
                              ? "Not attempted yet"
                              : `Score ${PASS_PERCENT}%+ on the previous level to unlock`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/quiz")}
                      disabled={!unlocked}
                      className="text-indigo-600 font-medium hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      {result ? "Retake" : "Take Quiz"} →
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">🚀 Keep Going!</h2>

            <p className="mt-3">
              Only {TOPICS.length - completedTopics} topics left to complete.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Progress;
