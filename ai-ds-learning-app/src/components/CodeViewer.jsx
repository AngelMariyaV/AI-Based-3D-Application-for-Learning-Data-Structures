import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

const LANGUAGE_LABELS = {
  java: "Java",
  cpp: "C++",
  javascript: "JavaScript",
  python: "Python",
};

function CodeViewer({ code }) {
  const languages = code ? Object.keys(code) : [];
  const [lang, setLang] = useState(languages[0] || "javascript");
  const [copied, setCopied] = useState(false);

  if (!code || languages.length === 0) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code[lang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard might be unavailable, fail silently
    }
  };

  return (
    <div className="bg-[#1e1e2e] rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#161622] border-b border-white/10">
        <div className="flex gap-2">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === l
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {LANGUAGE_LABELS[l] || l}
            </button>
          ))}
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
        <code className="text-indigo-100 font-mono whitespace-pre">
          {code[lang]}
        </code>
      </pre>
    </div>
  );
}

export default CodeViewer;
