import { useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import QueueVisualizer from "../Visualizer/QueueVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("queue");
const subtypes = getSubtypes("queue");
const CIRCULAR_CAPACITY = 6;

const DEFAULTS = {
  simple: [3, 9, 14],
  circular: [3, 9, 14],
  deque: [3, 9, 14],
  priority: [2, 5, 9],
};

function toNum(value) {
  return isNaN(value) ? value : Number(value);
}

function QueuePage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [data, setData] = useState(DEFAULTS[subtypes[0]?.id] || []);
  const [message, setMessage] = useState("");

  const changeSubtype = (id) => {
    setSubtype(id);
    setData(DEFAULTS[id] || []);
    setMessage("");
  };

  const runSimple = (key, value) => {
    switch (key) {
      case "enqueue":
        if (value === "") return;
        setData((d) => [...d, toNum(value)]);
        setMessage(`Enqueued ${value} at the rear.`);
        break;
      case "dequeue":
        setData((d) => {
          if (d.length === 0) {
            setMessage("Queue is already empty.");
            return d;
          }
          setMessage(`Dequeued ${d[0]} from the front.`);
          return d.slice(1);
        });
        break;
      case "front":
        setMessage(data.length ? `Front element is ${data[0]}.` : "Queue is empty.");
        break;
      case "clear":
        setData([]);
        setMessage("Queue cleared.");
        break;
      default:
        break;
    }
  };

  const runCircular = (key, value) => {
    switch (key) {
      case "enqueue":
        if (value === "") return;
        setData((d) => {
          if (d.length >= CIRCULAR_CAPACITY) {
            setMessage("Circular queue is full — dequeue to free a slot.");
            return d;
          }
          setMessage(`Enqueued ${value} into slot ${d.length}.`);
          return [...d, toNum(value)];
        });
        break;
      case "dequeue":
        setData((d) => {
          if (d.length === 0) {
            setMessage("Circular queue is already empty.");
            return d;
          }
          setMessage(`Dequeued ${d[0]} — the freed slot will be reused.`);
          return d.slice(1);
        });
        break;
      case "front":
        setMessage(data.length ? `Front element is ${data[0]}.` : "Circular queue is empty.");
        break;
      case "clear":
        setData([]);
        setMessage("Circular queue cleared.");
        break;
      default:
        break;
    }
  };

  const runDeque = (key, value) => {
    switch (key) {
      case "pushFront":
        if (value === "") return;
        setData((d) => [toNum(value), ...d]);
        setMessage(`Pushed ${value} to the front.`);
        break;
      case "pushBack":
        if (value === "") return;
        setData((d) => [...d, toNum(value)]);
        setMessage(`Pushed ${value} to the back.`);
        break;
      case "popFront":
        setData((d) => {
          if (d.length === 0) {
            setMessage("Deque is already empty.");
            return d;
          }
          setMessage(`Popped ${d[0]} from the front.`);
          return d.slice(1);
        });
        break;
      case "popBack":
        setData((d) => {
          if (d.length === 0) {
            setMessage("Deque is already empty.");
            return d;
          }
          setMessage(`Popped ${d[d.length - 1]} from the back.`);
          return d.slice(0, -1);
        });
        break;
      case "clear":
        setData([]);
        setMessage("Deque cleared.");
        break;
      default:
        break;
    }
  };

  const runPriority = (key, value) => {
    switch (key) {
      case "insert":
        if (value === "" || isNaN(value)) {
          setMessage("Enter a numeric priority (lower number = higher priority).");
          return;
        }
        setData((d) => [...d, Number(value)].sort((a, b) => a - b));
        setMessage(`Inserted priority ${value}.`);
        break;
      case "removeTop":
        setData((d) => {
          if (d.length === 0) {
            setMessage("Priority queue is already empty.");
            return d;
          }
          setMessage(`Removed highest-priority item ${d[0]}.`);
          return d.slice(1);
        });
        break;
      case "peek":
        setMessage(data.length ? `Highest priority is ${data[0]}.` : "Priority queue is empty.");
        break;
      case "clear":
        setData([]);
        setMessage("Priority queue cleared.");
        break;
      default:
        break;
    }
  };

  const RUNNERS = { simple: runSimple, circular: runCircular, deque: runDeque, priority: runPriority };
  const OPERATIONS = {
    simple: [
      { key: "enqueue", label: "Enqueue", needsValue: true },
      { key: "dequeue", label: "Dequeue", variant: "danger" },
      { key: "front", label: "Front", variant: "secondary" },
      { key: "clear", label: "Clear", variant: "ghost" },
    ],
    circular: [
      { key: "enqueue", label: "Enqueue", needsValue: true },
      { key: "dequeue", label: "Dequeue", variant: "danger" },
      { key: "front", label: "Front", variant: "secondary" },
      { key: "clear", label: "Clear", variant: "ghost" },
    ],
    deque: [
      { key: "pushFront", label: "Push Front", needsValue: true },
      { key: "pushBack", label: "Push Back", needsValue: true, variant: "secondary" },
      { key: "popFront", label: "Pop Front", variant: "danger" },
      { key: "popBack", label: "Pop Back", variant: "danger" },
      { key: "clear", label: "Clear", variant: "ghost" },
    ],
    priority: [
      { key: "insert", label: "Insert (priority)", needsValue: true },
      { key: "removeTop", label: "Remove Top", variant: "danger" },
      { key: "peek", label: "Peek", variant: "secondary" },
      { key: "clear", label: "Clear", variant: "ghost" },
    ],
  };

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        <QueueVisualizer data={data} color={topic.color} variant={subtype} />
        <OperationPanel message={message} operations={OPERATIONS[subtype] || OPERATIONS.simple} onRun={RUNNERS[subtype] || runSimple} />
      </div>
    </TopicShell>
  );
}

export default QueuePage;
