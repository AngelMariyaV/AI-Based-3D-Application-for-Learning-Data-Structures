import { useState } from "react";
import Button from "./Button/Button";

/**
 * Generic control panel for driving a data-structure visualizer.
 *
 * operations: [{ key, label, needsValue?, placeholder?, variant? }]
 * onRun(key, value)
 */
function OperationPanel({ operations = [], onRun, message }) {
  const [value, setValue] = useState("");

  const needsInput = operations.some((op) => op.needsValue);

  const handleRun = (op) => {
    if (op.needsValue && value.trim() === "") return;
    onRun(op.key, value.trim());
    if (op.needsValue) setValue("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4">Operations</h3>

      {needsInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a value..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const first = operations.find((op) => op.needsValue);
              if (first) handleRun(first);
            }
          }}
          className="w-full border rounded-xl px-4 py-2.5 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      )}

      <div className="flex flex-wrap gap-3">
        {operations.map((op) => (
          <Button
            key={op.key}
            size="sm"
            variant={op.variant || "primary"}
            onClick={() => handleRun(op)}
          >
            {op.label}
          </Button>
        ))}
      </div>

      {message && (
        <p className="mt-4 text-sm bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2">
          {message}
        </p>
      )}
    </div>
  );
}

export default OperationPanel;
