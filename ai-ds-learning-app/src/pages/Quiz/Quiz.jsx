import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import { QUIZ_LEVELS, LEVEL_ORDER, PASS_PERCENT } from "../../data/quiz";
import { FaCheckCircle, FaTimesCircle, FaRedo, FaLock, FaTrophy } from "react-icons/fa";
import {
  getCurrentUser,
  refreshUserFromServer,
  saveQuizScore,
  isLevelUnlocked,
} from "../../utils/userStore";

function Quiz() {
  const [user, setUser] = useState(() => getCurrentUser());

  // "select" -> choosing a difficulty, "quiz" -> answering, "result" -> done
  const [stage, setStage] = useState("select");
  const [level, setLevel] = useState(null);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Pull THIS user's own saved level scores so the lock/unlock state
    // is always correct for whoever is logged in right now.
    if (user) {
      refreshUserFromServer(user).then(setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questions = level ? QUIZ_LEVELS[level].questions : [];
  const current = questions[index];
  const isLast = index === questions.length - 1;

  const startLevel = (lvl) => {
    if (!isLevelUnlocked(user, lvl)) return;
    setLevel(lvl);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStage("quiz");
  };

  const selectOption = (i) => {
    if (selected !== null) return; // lock after first pick
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = async () => {
    if (isLast) {
      if (user) {
        const updated = await saveQuizScore(user, level, score, questions.length);
        setUser(updated);
      }
      setStage("result");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStage("quiz");
  };

  const backToLevels = () => {
    setStage("select");
    setLevel(null);
  };

  const percent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Structures Quiz</h1>
            <p className="text-gray-500 mb-8">
              Score {PASS_PERCENT}% or higher on a level to unlock the next one.
            </p>

            {stage === "select" && (
              <div className="space-y-4">
                {LEVEL_ORDER.map((lvl) => {
                  const unlocked = isLevelUnlocked(user, lvl);
                  const result = user?.quizScore?.[lvl];
                  const meta = QUIZ_LEVELS[lvl];

                  return (
                    <div
                      key={lvl}
                      className={`bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between gap-4 ${
                        unlocked ? "" : "opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-gray-800">{meta.label}</h2>
                          {!unlocked && <FaLock className="text-gray-400" size={14} />}
                          {result && result.percent >= PASS_PERCENT && (
                            <FaTrophy className="text-amber-500" size={14} />
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{meta.description}</p>

                        {result ? (
                          <p className="text-sm mt-2 font-medium text-indigo-600">
                            Best: {result.score}/{result.total} ({result.percent}%)
                          </p>
                        ) : unlocked ? (
                          <p className="text-sm mt-2 text-gray-400">Not attempted yet</p>
                        ) : (
                          <p className="text-sm mt-2 text-gray-400">
                            Score {PASS_PERCENT}%+ on {QUIZ_LEVELS[LEVEL_ORDER[LEVEL_ORDER.indexOf(lvl) - 1]]?.label} to unlock
                          </p>
                        )}
                      </div>

                      <Button onClick={() => startLevel(lvl)} disabled={!unlocked}>
                        {result ? "Retake" : "Start"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {stage === "quiz" && current && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>
                    {QUIZ_LEVELS[level].label} · Question {index + 1} of {questions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-6">{current.question}</h2>

                <div className="space-y-3">
                  {current.options.map((opt, i) => {
                    const isCorrect = selected !== null && i === current.answer;
                    const isWrong = selected === i && i !== current.answer;
                    return (
                      <button
                        key={i}
                        onClick={() => selectOption(i)}
                        className={`w-full text-left px-5 py-3 rounded-xl border transition-colors flex items-center justify-between
                          ${
                            isCorrect
                              ? "bg-green-50 border-green-400 text-green-700"
                              : isWrong
                              ? "bg-red-50 border-red-400 text-red-700"
                              : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                          }`}
                      >
                        {opt}
                        {isCorrect && <FaCheckCircle />}
                        {isWrong && <FaTimesCircle />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={backToLevels}
                    className="text-gray-500 font-medium hover:text-gray-700"
                  >
                    ← Change level
                  </button>
                  <Button onClick={next} disabled={selected === null}>
                    {isLast ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </div>
            )}

            {stage === "result" && (
              <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {QUIZ_LEVELS[level].label} Complete!
                </h2>
                <p className="text-5xl font-bold text-indigo-600 my-6">
                  {score} / {questions.length}
                </p>
                <p className="text-gray-500 mb-2">{percent}% correct</p>

                <p className="text-gray-500 mb-8">
                  {passed
                    ? LEVEL_ORDER.indexOf(level) < LEVEL_ORDER.length - 1
                      ? `Nice — you passed! ${
                          QUIZ_LEVELS[LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1]].label
                        } is now unlocked.`
                      : "Nice — you passed! That's the hardest level cleared."
                    : `You need ${PASS_PERCENT}% or higher to pass. Review the topics and try again.`}
                </p>

                <div className="flex gap-3 justify-center">
                  <Button icon={FaRedo} onClick={restart}>
                    Retake {QUIZ_LEVELS[level].label}
                  </Button>
                  <button
                    onClick={backToLevels}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    All Levels
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
