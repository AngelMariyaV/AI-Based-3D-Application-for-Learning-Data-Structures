import { useParams, useNavigate } from "react-router-dom";
import { findTopic } from "../../data/topics";

import ArrayPage from "../Array/Array";
import StackPage from "../Stack/Stack";
import QueuePage from "../Queue/Queue";
import LinkedListPage from "../LinkedList/LinkedList";
import TreePage from "../Tree/Tree";
import GraphPage from "../Graph/Graph";

const PAGES = {
  array: ArrayPage,
  stack: StackPage,
  queue: QueuePage,
  linkedlist: LinkedListPage,
  tree: TreePage,
  graph: GraphPage,
};

function TopicPage() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const matched = findTopic(topic);
  const Page = matched ? PAGES[matched.id] : null;

  if (!Page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Topic not found</h1>
          <p className="text-gray-500 mb-6">
            "{topic}" doesn't match any available data structure yet.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return <Page />;
}

export default TopicPage;
