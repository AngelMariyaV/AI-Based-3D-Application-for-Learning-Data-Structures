// Quiz bank split by difficulty. A user must score at or above
// PASS_PERCENT on a level to unlock the next one.
export const PASS_PERCENT = 80;

export const LEVEL_ORDER = ["easy", "medium", "hard"];

export const QUIZ_LEVELS = {
  easy: {
    label: "Easy",
    description: "Core definitions and basic operations.",
    questions: [
      {
        question: "What is the time complexity of accessing an element by index in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        answer: 0,
      },
      {
        question: "Which principle does a Stack follow?",
        options: ["FIFO", "LIFO", "Priority based", "Random access"],
        answer: 1,
      },
      {
        question: "Which principle does a Queue follow?",
        options: ["LIFO", "Random", "FIFO", "Balanced"],
        answer: 2,
      },
      {
        question: "What does each node in a Linked List store?",
        options: [
          "Only a value",
          "A value and a pointer to the next node",
          "An index and a key",
          "A parent and two children",
        ],
        answer: 1,
      },
      {
        question: "In a Binary Search Tree, where are smaller values placed relative to a node?",
        options: ["Right subtree", "Left subtree", "Root only", "Anywhere"],
        answer: 1,
      },
      {
        question: "Which traversal of a Graph uses a Queue?",
        options: ["DFS", "BFS", "In-order", "Post-order"],
        answer: 1,
      },
      {
        question: "What is the time complexity of Push/Pop operations on a Stack?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        answer: 2,
      },
      {
        question: "Inserting an element in the middle of an array requires:",
        options: [
          "No shifting",
          "Shifting subsequent elements",
          "Deleting the whole array",
          "Doubling the array size always",
        ],
        answer: 1,
      },
      {
        question: "What does DFS stand for?",
        options: [
          "Data First Search",
          "Depth First Search",
          "Direct File Search",
          "Double Field Search",
        ],
        answer: 1,
      },
      {
        question: "In-order traversal of a Binary Search Tree returns elements in:",
        options: ["Random order", "Reverse order", "Sorted order", "Insertion order"],
        answer: 2,
      },
    ],
  },

  medium: {
    label: "Medium",
    description: "Complexity trade-offs and how operations actually behave.",
    questions: [
      {
        question: "What is the worst-case time complexity of searching in an unsorted array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        answer: 2,
      },
      {
        question: "Deleting a node from the middle of a Singly Linked List (given only a pointer to it) is hardest because:",
        options: [
          "You can't reach the next node",
          "You need the previous node's reference, which isn't directly available",
          "Linked lists don't support deletion",
          "It always requires sorting first",
        ],
        answer: 1,
      },
      {
        question: "What is the space complexity of an adjacency matrix for a graph with V vertices?",
        options: ["O(V)", "O(V + E)", "O(V^2)", "O(E)"],
        answer: 2,
      },
      {
        question: "In a Queue implemented using two Stacks, what is the amortized time complexity of dequeue?",
        options: ["O(n)", "O(1) amortized", "O(log n)", "O(n^2)"],
        answer: 1,
      },
      {
        question: "Which data structure is best suited to check for balanced parentheses in an expression?",
        options: ["Queue", "Stack", "Graph", "Array"],
        answer: 1,
      },
      {
        question: "What happens to the height of a Binary Search Tree if elements are inserted in already-sorted order?",
        options: [
          "It stays balanced at O(log n)",
          "It degenerates into a linked list of height O(n)",
          "It becomes a complete binary tree",
          "Height is unaffected by insertion order",
        ],
        answer: 1,
      },
      {
        question: "Which traversal visits a Graph as far as possible along each branch before backtracking?",
        options: ["BFS", "DFS", "Level-order", "In-order"],
        answer: 1,
      },
      {
        question: "What is the time complexity of inserting an element at the beginning of a Linked List?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        answer: 0,
      },
      {
        question: "A Circular Queue avoids which problem present in a simple array-based Queue?",
        options: [
          "Overflow when the array is genuinely full",
          "Wasted space from a Queue that appears full after dequeues",
          "The need for a front pointer",
          "Duplicate elements",
        ],
        answer: 1,
      },
      {
        question: "Which of these is true about a Doubly Linked List compared to a Singly Linked List?",
        options: [
          "It uses less memory per node",
          "It allows traversal in both directions at the cost of extra memory per node",
          "It cannot be traversed backwards",
          "It doesn't support insertion at the head",
        ],
        answer: 1,
      },
    ],
  },

  hard: {
    label: "Hard",
    description: "Deeper trade-offs, edge cases, and applied problem-solving.",
    questions: [
      {
        question: "What is the time complexity of building a Binary Heap from n unsorted elements?",
        options: ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"],
        answer: 1,
      },
      {
        question: "In Dijkstra's algorithm using a Min-Heap, what is the overall time complexity for a graph with V vertices and E edges?",
        options: ["O(V^2)", "O((V + E) log V)", "O(E log E only)", "O(V * E)"],
        answer: 1,
      },
      {
        question: "Why can't Dijkstra's algorithm be used directly on graphs with negative edge weights?",
        options: [
          "It runs out of memory",
          "It assumes once a vertex is finalized its shortest distance can't improve, which negative edges can violate",
          "Negative weights make the graph disconnected",
          "It only works on trees",
        ],
        answer: 1,
      },
      {
        question: "What is the amortized time complexity of a single insertion into a dynamically resizing Array List (like a Python list)?",
        options: ["O(n)", "O(1) amortized", "O(log n)", "O(n log n)"],
        answer: 1,
      },
      {
        question: "In an AVL Tree, a rotation is triggered when:",
        options: [
          "Any single node is inserted, regardless of balance",
          "The balance factor of a node becomes less than -1 or greater than 1",
          "The tree becomes a complete binary tree",
          "Only during deletion, never during insertion",
        ],
        answer: 1,
      },
      {
        question: "Which statement about Topological Sort is correct?",
        options: [
          "It works on any graph, including ones with cycles",
          "It's only defined for a Directed Acyclic Graph (DAG)",
          "It requires the graph to be weighted",
          "It always produces a unique ordering",
        ],
        answer: 1,
      },
      {
        question: "What is the worst-case time complexity of QuickSort, and when does it occur?",
        options: [
          "O(n log n), when the array is already sorted",
          "O(n^2), when the pivot repeatedly picks the smallest or largest element",
          "O(n), always",
          "O(log n), when the array has duplicates",
        ],
        answer: 1,
      },
      {
        question: "A Trie (prefix tree) is most efficient for which use case?",
        options: [
          "Storing key-value pairs with O(1) average lookup",
          "Autocomplete / prefix-based string search",
          "Finding the shortest path between two nodes",
          "Sorting a list of numbers",
        ],
        answer: 1,
      },
      {
        question: "In Union-Find (Disjoint Set Union) with both path compression and union by rank, what is the amortized time per operation?",
        options: [
          "O(log n)",
          "O(n)",
          "Nearly O(1) — technically O(alpha(n)), the inverse Ackermann function",
          "O(n log n)",
        ],
        answer: 2,
      },
      {
        question: "Why is a Red-Black Tree often preferred over a plain unbalanced BST in library implementations (e.g. C++ std::map)?",
        options: [
          "It uses less memory per node than any BST",
          "It guarantees O(log n) height regardless of insertion order, avoiding worst-case degeneration",
          "It doesn't require comparisons between keys",
          "It's simpler to implement than a BST",
        ],
        answer: 1,
      },
    ],
  },
};

// Backward-compatible flat export (some older code/imports may still
// reference this) — points at the Easy set.
export const QUIZ_QUESTIONS = QUIZ_LEVELS.easy.questions;
