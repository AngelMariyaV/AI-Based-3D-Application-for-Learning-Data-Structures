import { useRef, useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import GraphVisualizer from "../Visualizer/GraphVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("graph");
const subtypes = getSubtypes("graph");

const DEFAULT_NODES = ["A", "B", "C", "D", "E"];
const DEFAULT_EDGES = {
  undirected: [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
  ],
  directed: [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
  ],
  weighted: [
    ["A", "B", 4],
    ["A", "C", 2],
    ["B", "D", 5],
    ["C", "E", 3],
  ],
};

function buildAdjacency(nodes, edges, directed) {
  const map = new Map(nodes.map((n) => [n, []]));
  edges.forEach(([a, b]) => {
    map.get(a)?.push(b);
    if (!directed) map.get(b)?.push(a);
  });
  return map;
}

function bfsOrder(nodes, edges, start, directed) {
  const adj = buildAdjacency(nodes, edges, directed);
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const n of adj.get(node) || []) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  return order;
}

function dfsOrder(nodes, edges, start, directed) {
  const adj = buildAdjacency(nodes, edges, directed);
  const visited = new Set();
  const order = [];
  (function walk(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    (adj.get(node) || []).forEach(walk);
  })(start);
  return order;
}

function GraphPage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES[subtypes[0]?.id] || []);
  const [visited, setVisited] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [message, setMessage] = useState("");
  const timers = useRef([]);

  const isDirected = subtype === "directed";
  const isWeighted = subtype === "weighted";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const changeSubtype = (id) => {
    clearTimers();
    setSubtype(id);
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES[id] || []);
    setVisited([]);
    setActiveNode(null);
    setMessage("");
  };

  const animateOrder = (order, label) => {
    clearTimers();
    setVisited([]);
    order.forEach((node, i) => {
      const t = setTimeout(() => {
        setActiveNode(node);
        setVisited((v) => [...v, node]);
      }, i * 600);
      timers.current.push(t);
    });
    const finalT = setTimeout(() => setActiveNode(null), order.length * 600);
    timers.current.push(finalT);
    setMessage(`${label}: ${order.join(" → ")}`);
  };

  const run = (key, rawValue) => {
    switch (key) {
      case "addVertex": {
        const v = rawValue.trim().toUpperCase();
        if (!v) return;
        if (nodes.includes(v)) {
          setMessage(`Vertex ${v} already exists.`);
          return;
        }
        setNodes((n) => [...n, v]);
        setMessage(`Added vertex ${v}.`);
        break;
      }
      case "addEdge": {
        if (isWeighted) {
          const parts = rawValue.split(/[-,\s]+/).filter(Boolean);
          if (parts.length !== 3 || Number.isNaN(Number(parts[2]))) {
            setMessage("Enter a weighted edge as A-B-weight (e.g. A-B-5).");
            return;
          }
          const [a, b, w] = [parts[0].toUpperCase(), parts[1].toUpperCase(), Number(parts[2])];
          setNodes((n) => Array.from(new Set([...n, a, b])));
          setEdges((e) => [...e, [a, b, w]]);
          setMessage(`Connected ${a} ${isDirected ? "→" : "—"} ${b} (weight ${w}).`);
          break;
        }
        const parts = rawValue.split(/[-,\s]+/).filter(Boolean).map((s) => s.toUpperCase());
        if (parts.length !== 2) {
          setMessage(isDirected ? "Enter a directed edge as A-B (A points to B)." : "Enter an edge as A-B.");
          return;
        }
        const [a, b] = parts;
        setNodes((n) => Array.from(new Set([...n, a, b])));
        setEdges((e) => [...e, [a, b]]);
        setMessage(`Connected ${a} ${isDirected ? "→" : "—"} ${b}.`);
        break;
      }
      case "bfs":
        if (nodes.length === 0) return;
        animateOrder(bfsOrder(nodes, edges, nodes[0], isDirected), "BFS order");
        break;
      case "dfs":
        if (nodes.length === 0) return;
        animateOrder(dfsOrder(nodes, edges, nodes[0], isDirected), "DFS order");
        break;
      case "clear":
        clearTimers();
        setNodes([]);
        setEdges([]);
        setVisited([]);
        setActiveNode(null);
        setMessage("Graph cleared.");
        break;
      default:
        break;
    }
  };

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          visited={visited}
          activeNode={activeNode}
          color={topic.color}
          variant={subtype}
        />
        <OperationPanel
          message={message}
          operations={[
            { key: "addVertex", label: "Add Vertex", needsValue: true },
            {
              key: "addEdge",
              label: isWeighted ? "Add Edge (A-B-weight)" : isDirected ? "Add Edge (A→B)" : "Add Edge (A-B)",
              needsValue: true,
              variant: "secondary",
            },
            { key: "bfs", label: "Run BFS", variant: "secondary" },
            { key: "dfs", label: "Run DFS", variant: "secondary" },
            { key: "clear", label: "Clear", variant: "ghost" },
          ]}
          onRun={run}
        />
      </div>
    </TopicShell>
  );
}

export default GraphPage;
