import { FaTimes } from "react-icons/fa";

function VideoModal({ open, onClose, title, video, onOpenTutorial }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[700px] max-w-[95%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">{title}</h2>

          <button onClick={onClose}>
            <FaTimes size={22} />
          </button>
        </div>

        <video
          src={video}
          autoPlay
          loop
          muted
          controls
          className="w-full rounded-xl"
        />

        <button
          onClick={onOpenTutorial}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
        >
          Open Full Tutorial →
        </button>
      </div>
    </div>
  );
}

export default VideoModal;