import { useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import LinkedListVisualizer from "../Visualizer/LinkedListVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("linkedlist");
const subtypes = getSubtypes("linkedlist");

function LinkedListPage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [data, setData] = useState([10, 20, 30]);
  const [message, setMessage] = useState("");

  const changeSubtype = (id) => {
    setSubtype(id);
    setData([10, 20, 30]);
    setMessage("");
  };

  const run = (key, value) => {
    switch (key) {
      case "insertHead": {
        if (value === "") return;
        setData((d) => [isNaN(value) ? value : Number(value), ...d]);
        setMessage(`Inserted ${value} at the head.`);
        break;
      }
      case "insertTail": {
        if (value === "") return;
        setData((d) => [...d, isNaN(value) ? value : Number(value)]);
        setMessage(`Inserted ${value} at the tail.`);
        break;
      }
      case "deleteHead": {
        setData((d) => {
          if (d.length === 0) {
            setMessage("List is already empty.");
            return d;
          }
          setMessage(`Removed ${d[0]} from the head.`);
          return d.slice(1);
        });
        break;
      }
      case "clear": {
        setData([]);
        setMessage("List cleared.");
        break;
      }
      default:
        break;
    }
  };

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        <LinkedListVisualizer data={data} color={topic.color} variant={subtype} />
        <OperationPanel
          message={message}
          operations={[
            { key: "insertHead", label: "Insert at Head", needsValue: true },
            { key: "insertTail", label: "Insert at Tail", needsValue: true, variant: "secondary" },
            { key: "deleteHead", label: "Delete Head", variant: "danger" },
            { key: "clear", label: "Clear", variant: "ghost" },
          ]}
          onRun={run}
        />
      </div>
    </TopicShell>
  );
}

export default LinkedListPage;
