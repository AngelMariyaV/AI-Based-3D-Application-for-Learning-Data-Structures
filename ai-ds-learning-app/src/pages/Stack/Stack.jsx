import { useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import StackVisualizer from "../Visualizer/StackVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("stack");
const subtypes = getSubtypes("stack");

function StackPage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [data, setData] = useState([5, 12, 8]);
  const [message, setMessage] = useState("");

  const changeSubtype = (id) => {
    setSubtype(id);
    setData([5, 12, 8]);
    setMessage("");
  };

  const run = (key, value) => {
    switch (key) {
      case "push": {
        if (value === "") return;
        setData((d) => [...d, isNaN(value) ? value : Number(value)]);
        setMessage(`Pushed ${value} onto the stack.`);
        break;
      }
      case "pop": {
        setData((d) => {
          if (d.length === 0) {
            setMessage("Stack is already empty.");
            return d;
          }
          setMessage(`Popped ${d[d.length - 1]} off the stack.`);
          return d.slice(0, -1);
        });
        break;
      }
      case "peek": {
        setMessage(data.length ? `Top element is ${data[data.length - 1]}.` : "Stack is empty.");
        break;
      }
      case "clear": {
        setData([]);
        setMessage("Stack cleared.");
        break;
      }
      default:
        break;
    }
  };

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        <StackVisualizer data={data} color={topic.color} variant={subtype} />
        <OperationPanel
          message={message}
          operations={[
            { key: "push", label: "Push", needsValue: true },
            { key: "pop", label: "Pop", variant: "danger" },
            { key: "peek", label: "Peek", variant: "secondary" },
            { key: "clear", label: "Clear", variant: "ghost" },
          ]}
          onRun={run}
        />
      </div>
    </TopicShell>
  );
}

export default StackPage;
