import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { TOPICS } from "../../data/topics";
import { LEVEL_ORDER, QUIZ_LEVELS } from "../../data/quiz";
import { FaEnvelope, FaUser, FaSignOutAlt, FaCamera } from "react-icons/fa";
import {
  API_BASE,
  getCurrentUser,
  refreshUserFromServer,
  uploadProfilePhoto,
  clearCurrentUser,
} from "../../utils/userStore";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => getCurrentUser());
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const visited = user?.visitedTopics || [];
  const quizScore = user?.quizScore || {};
  // Show the highest level the user has attempted so far.
  const highestAttempted = [...LEVEL_ORDER].reverse().find((lvl) => quizScore[lvl]);
  const bestResult = highestAttempted ? quizScore[highestAttempted] : null;

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    // Always fetch THIS logged-in user's own record, so the photo and
    // stats shown here are never left over from a different account.
    refreshUserFromServer(user).then(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    clearCurrentUser();
    navigate("/");
  };

  const pickPhoto = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const updated = await uploadProfilePhoto(user, file);
      setUser(updated);
    } catch (err) {
      setError(err.message || "Couldn't upload that photo. Try again.");
    } finally {
      setUploading(false);
      setPreview(null);
      e.target.value = "";
    }
  };

  if (!user) return null;

  const avatarSrc =
    preview ||
    (user.profileImage
      ? `${API_BASE}/uploads/${user.profileImage}`
      : `https://ui-avatars.com/api/?background=6366f1&color=fff&size=128&name=${encodeURIComponent(
          user.name || "U"
        )}`);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Profile</h1>

          <Card className="mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
                />

                <button
                  type="button"
                  onClick={pickPhoto}
                  disabled={uploading}
                  title="Change your photo"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  <FaCamera size={14} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center sm:justify-start">
                  <FaUser className="text-indigo-500" /> {user.name}
                </h2>
                <p className="text-gray-500 flex items-center gap-2 mt-1 justify-center sm:justify-start">
                  <FaEnvelope className="text-indigo-400" /> {user.email}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {uploading
                    ? "Uploading your photo…"
                    : "Click the camera icon to update your own photo — only your account will change."}
                </p>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <Button variant="danger" icon={FaSignOutAlt} onClick={logout}>
                Logout
              </Button>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold text-gray-800 mb-2">Topics Explored</h3>
              <p className="text-4xl font-bold text-indigo-600">
                {visited.length}
                <span className="text-lg text-gray-400"> / {TOPICS.length}</span>
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-800 mb-2">Best Quiz Score</h3>
              <p className="text-4xl font-bold text-indigo-600">
                {bestResult ? `${bestResult.score} / ${bestResult.total}` : "—"}
              </p>
              {bestResult && (
                <p className="text-xs text-gray-400 mt-1">
                  {QUIZ_LEVELS[highestAttempted].label} · {bestResult.percent}%
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
