import { useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import ArrayVisualizer from "../Visualizer/ArrayVisualizer";
import Array2DVisualizer from "../Visualizer/Array2DVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("array");
const subtypes = getSubtypes("array");

const DEFAULT_1D = [12, 45, 7, 23, 56];
const DEFAULT_2D = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function toNum(value) {
  return isNaN(value) ? value : Number(value);
}

function ArrayPage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [data, setData] = useState(DEFAULT_1D);
  const [grid, setGrid] = useState(DEFAULT_2D);
  const [highlighted, setHighlighted] = useState([]);
  const [message, setMessage] = useState("");

  const isTwoD = subtype === "twod";

  const changeSubtype = (id) => {
    setSubtype(id);
    setData(DEFAULT_1D);
    setGrid(DEFAULT_2D);
    setHighlighted([]);
    setMessage("");
  };

  const runLinear = (key, value) => {
    setHighlighted([]);
    switch (key) {
      case "insert":
        if (value === "") return;
        setData((d) => [...d, toNum(value)]);
        setMessage(`Inserted ${value} at the end.`);
        break;
      case "delete":
        setData((d) => (d.length === 0 ? d : d.slice(0, -1)));
        setMessage("Removed the last element.");
        break;
      case "search": {
        if (value === "") return;
        const target = toNum(value);
        const idx = data.findIndex((v) => String(v) === String(target));
        if (idx === -1) setMessage(`${value} was not found.`);
        else {
          setHighlighted([idx]);
          setMessage(`Found ${value} at index ${idx}.`);
        }
        break;
      }
      case "clear":
        setData([]);
        setMessage(subtype === "dynamic" ? "Dynamic array cleared." : "Array cleared.");
        break;
      default:
        break;
    }
  };

  const runMatrix = (key, value) => {
    switch (key) {
      case "setCell": {
        const parts = value.split(",").map((s) => s.trim());
        if (parts.length !== 3) {
          setMessage("Enter as row,col,value (e.g. 1,2,99).");
          return;
        }
        const [r, c, v] = parts.map(Number);
        if ([r, c, v].some(Number.isNaN) || r < 0 || c < 0 || r >= grid.length || c >= (grid[0]?.length || 0)) {
          setMessage("Invalid row/col/value.");
          return;
        }
        setGrid((g) => g.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)));
        setMessage(`Set grid[${r}][${c}] = ${v}.`);
        break;
      }
      case "addRow":
        setGrid((g) => [...g, Array((g[0]?.length || 3)).fill(0)]);
        setMessage("Added a new row of zeros.");
        break;
      case "addCol":
        setGrid((g) => g.map((row) => [...row, 0]));
        setMessage("Added a new column of zeros.");
        break;
      case "clear":
        setGrid([]);
        setMessage("Matrix cleared.");
        break;
      default:
        break;
    }
  };

  const LINEAR_OPS = [
    { key: "insert", label: "Insert", needsValue: true },
    { key: "search", label: "Search", needsValue: true, variant: "secondary" },
    { key: "delete", label: "Delete Last", variant: "danger" },
    { key: "clear", label: "Clear", variant: "ghost" },
  ];

  const MATRIX_OPS = [
    { key: "setCell", label: "Set Cell (row,col,value)", needsValue: true },
    { key: "addRow", label: "Add Row", variant: "secondary" },
    { key: "addCol", label: "Add Column", variant: "secondary" },
    { key: "clear", label: "Clear", variant: "ghost" },
  ];

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        {isTwoD ? (
          <Array2DVisualizer grid={grid} color={topic.color} />
        ) : (
          <ArrayVisualizer data={data} highlighted={highlighted} color={topic.color} variant={subtype} />
        )}
        <OperationPanel
          message={message}
          operations={isTwoD ? MATRIX_OPS : LINEAR_OPS}
          onRun={isTwoD ? runMatrix : runLinear}
        />
      </div>
    </TopicShell>
  );
}

export default ArrayPage;
