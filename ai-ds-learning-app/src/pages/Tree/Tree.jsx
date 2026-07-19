import { useState } from "react";
import TopicShell from "../../components/TopicShell/TopicShell";
import OperationPanel from "../../components/OperationPanel.jsx";
import TreeVisualizer from "../Visualizer/TreeVisualizer";
import { findTopic, getSubtypes } from "../../data/topics";

const topic = findTopic("tree");
const subtypes = getSubtypes("tree");

// ---------- Binary Search Tree ----------
function insertBST(node, value) {
  if (!node) return { value, left: null, right: null };
  if (value < node.value) return { ...node, left: insertBST(node.left, value) };
  if (value > node.value) return { ...node, right: insertBST(node.right, value) };
  return node;
}
function searchBST(node, value) {
  if (!node) return false;
  if (node.value === value) return true;
  return value < node.value ? searchBST(node.left, value) : searchBST(node.right, value);
}

// ---------- Plain Binary Tree (level-order fill) ----------
function insertLevelOrder(root, value) {
  const node = { value, left: null, right: null };
  if (!root) return node;
  const clone = JSON.parse(JSON.stringify(root));
  const queue = [clone];
  while (queue.length) {
    const current = queue.shift();
    if (!current.left) {
      current.left = node;
      return clone;
    }
    queue.push(current.left);
    if (!current.right) {
      current.right = node;
      return clone;
    }
    queue.push(current.right);
  }
  return clone;
}

// ---------- AVL Tree (self-balancing) ----------
function height(node) {
  return node ? node.height : 0;
}
function makeAvlNode(value, left = null, right = null) {
  return { value, left, right, height: 1 + Math.max(height(left), height(right)) };
}
function rotateRight(y) {
  const x = y.left;
  const newY = makeAvlNode(y.value, x.right, y.right);
  return makeAvlNode(x.value, x.left, newY);
}
function rotateLeft(x) {
  const y = x.right;
  const newX = makeAvlNode(x.value, x.left, y.left);
  return makeAvlNode(y.value, newX, y.right);
}
function insertAVL(node, value) {
  if (!node) return makeAvlNode(value);
  let newNode;
  if (value < node.value) newNode = makeAvlNode(node.value, insertAVL(node.left, value), node.right);
  else if (value > node.value) newNode = makeAvlNode(node.value, node.left, insertAVL(node.right, value));
  else return node;

  const balance = height(newNode.left) - height(newNode.right);
  if (balance > 1 && value < newNode.left.value) return rotateRight(newNode);
  if (balance < -1 && value > newNode.right.value) return rotateLeft(newNode);
  if (balance > 1 && value > newNode.left.value) {
    newNode.left = rotateLeft(newNode.left);
    return rotateRight(newNode);
  }
  if (balance < -1 && value < newNode.right.value) {
    newNode.right = rotateRight(newNode.right);
    return rotateLeft(newNode);
  }
  return newNode;
}

// ---------- Heap (array-based min-heap) ----------
function heapInsert(arr, value) {
  const data = [...arr, value];
  let i = data.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (data[parent] <= data[i]) break;
    [data[parent], data[i]] = [data[i], data[parent]];
    i = parent;
  }
  return data;
}
function heapExtractMin(arr) {
  if (arr.length === 0) return arr;
  const data = [...arr];
  const last = data.pop();
  if (data.length === 0) return data;
  data[0] = last;
  let i = 0;
  const n = data.length;
  while (true) {
    const l = 2 * i + 1, r = 2 * i + 2;
    let smallest = i;
    if (l < n && data[l] < data[smallest]) smallest = l;
    if (r < n && data[r] < data[smallest]) smallest = r;
    if (smallest === i) break;
    [data[i], data[smallest]] = [data[smallest], data[i]];
    i = smallest;
  }
  return data;
}
function arrayToTree(arr, i = 0) {
  if (i >= arr.length) return null;
  return { value: arr[i], left: arrayToTree(arr, 2 * i + 1), right: arrayToTree(arr, 2 * i + 2) };
}

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.value);
  inorder(node.right, out);
  return out;
}

const SEED = [50, 30, 70, 20, 40, 60, 80];

function buildInitial(subtypeId) {
  if (subtypeId === "binary") return SEED.reduce((r, v) => insertLevelOrder(r, v), null);
  if (subtypeId === "avl") return SEED.reduce((r, v) => insertAVL(r, v), null);
  return SEED.reduce((r, v) => insertBST(r, v), null); // bst default
}

function TreePage() {
  const [subtype, setSubtype] = useState(subtypes[0]?.id);
  const [root, setRoot] = useState(() => buildInitial(subtypes[0]?.id));
  const [heapArr, setHeapArr] = useState(() => [20, 30, 40, 50, 60, 70, 80]);
  const [message, setMessage] = useState("");

  const isHeap = subtype === "heap";

  const changeSubtype = (id) => {
    setSubtype(id);
    setRoot(buildInitial(id));
    setHeapArr([20, 30, 40, 50, 60, 70, 80]);
    setMessage("");
  };

  const runTree = (key, rawValue) => {
    const value = Number(rawValue);
    switch (key) {
      case "insert": {
        if (rawValue === "" || Number.isNaN(value)) {
          setMessage("Please enter a numeric value.");
          return;
        }
        if (subtype === "binary") setRoot((r) => insertLevelOrder(r, value));
        else if (subtype === "avl") setRoot((r) => insertAVL(r, value));
        else setRoot((r) => insertBST(r, value));
        setMessage(`Inserted ${value} into the tree.`);
        break;
      }
      case "search": {
        if (rawValue === "" || Number.isNaN(value)) {
          setMessage("Please enter a numeric value.");
          return;
        }
        setMessage(searchBST(root, value) ? `${value} was found in the tree.` : `${value} was not found.`);
        break;
      }
      case "inorder":
        setMessage(`In-order traversal: ${inorder(root).join(" → ") || "(empty)"}`);
        break;
      case "reset":
        setRoot(null);
        setMessage("Tree cleared.");
        break;
      default:
        break;
    }
  };

  const runHeap = (key, rawValue) => {
    const value = Number(rawValue);
    switch (key) {
      case "insert":
        if (rawValue === "" || Number.isNaN(value)) {
          setMessage("Please enter a numeric value.");
          return;
        }
        setHeapArr((a) => heapInsert(a, value));
        setMessage(`Inserted ${value} into the heap.`);
        break;
      case "extractMin":
        setMessage(heapArr.length ? `Extracted min value ${heapArr[0]}.` : "Heap is empty.");
        setHeapArr((a) => heapExtractMin(a));
        break;
      case "peek":
        setMessage(heapArr.length ? `Min value is ${heapArr[0]}.` : "Heap is empty.");
        break;
      case "reset":
        setHeapArr([]);
        setMessage("Heap cleared.");
        break;
      default:
        break;
    }
  };

  const TREE_OPS = [
    { key: "insert", label: "Insert", needsValue: true },
    { key: "search", label: "Search", needsValue: true, variant: "secondary" },
    { key: "inorder", label: "In-order Traversal", variant: "secondary" },
    { key: "reset", label: "Clear", variant: "ghost" },
  ];
  const HEAP_OPS = [
    { key: "insert", label: "Insert", needsValue: true },
    { key: "extractMin", label: "Extract Min", variant: "danger" },
    { key: "peek", label: "Peek Min", variant: "secondary" },
    { key: "reset", label: "Clear", variant: "ghost" },
  ];

  return (
    <TopicShell topic={topic} subtypes={subtypes} activeSubtype={subtype} onSubtypeChange={changeSubtype}>
      <div className="space-y-6">
        <TreeVisualizer root={isHeap ? arrayToTree(heapArr) : root} color={topic.color} variant={subtype} />
        <OperationPanel
          message={message}
          operations={isHeap ? HEAP_OPS : TREE_OPS}
          onRun={isHeap ? runHeap : runTree}
        />
      </div>
    </TopicShell>
  );
}

export default TreePage;
