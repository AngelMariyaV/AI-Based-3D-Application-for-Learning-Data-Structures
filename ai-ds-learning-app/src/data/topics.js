// Local content for each Data Structure topic.
// The backend only stores the list of topic names (GET /topics).
// The actual theory / code / complexity content lives here so pages can
// render rich detail regardless of what's seeded in the database.
//
// Each topic now has one or more SUBTYPES (e.g. Linked List -> Singly,
// Doubly, Circular Singly, Circular Doubly). Every subtype has its own
// theory block and its own Java + C++ code sample. The 3D visualizer for
// a topic receives the active subtype's id as a `variant` prop and adapts
// its rendering (arrow direction, extra pointers, layout, etc.) to match.

export const TOPICS = [
  {
    id: "array",
    name: "Array",
    tagline: "A fixed-size or growable block of memory holding elements of the same type.",
    color: "#6366f1",
    subtypes: [
      {
        id: "oned",
        name: "1D Array",
        tagline: "A single row of same-type elements accessed directly by index.",
        theory: {
          definition:
            "A one-dimensional array is a linear data structure that stores elements of the same type in contiguous memory locations, each accessible directly by a single index.",
          working:
            "Because elements sit next to each other in memory, the address of any element can be calculated instantly from the base address and its index, which is what makes array access O(1).",
          operations: [
            "Access — read a value directly using its index",
            "Insert — add a value, shifting later elements to make room",
            "Delete — remove a value, shifting later elements to close the gap",
            "Traverse — visit every element in order",
            "Search — scan (or binary search on a sorted array) for a value",
          ],
          complexity: [
            { op: "Access", time: "O(1)" },
            { op: "Search", time: "O(n)" },
            { op: "Insert", time: "O(n)" },
            { op: "Delete", time: "O(n)" },
          ],
          realWorld:
            "A row of numbered lockers, a spreadsheet column, or pixels in a single image row — anything needing instant lookup by position.",
          interviewTip:
            "Mention that insert/delete are costly because shifting elements is required, unlike a linked list.",
        },
        code: {
          java: `// 1D Array basics in Java
public class OneDArray {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};

        // Access - O(1)
        System.out.println(arr[2]); // 30

        // Insert at index (need a bigger array) - O(n)
        int[] bigger = new int[arr.length + 1];
        System.arraycopy(arr, 0, bigger, 0, 2);
        bigger[2] = 99;
        System.arraycopy(arr, 2, bigger, 3, arr.length - 2);
        arr = bigger; // [10, 20, 99, 30, 40]

        // Traverse - O(n)
        for (int value : arr) {
            System.out.println(value);
        }
    }
}`,
          cpp: `// 1D Array basics in C++
#include <iostream>
using namespace std;

int main() {
    int arr[4] = {10, 20, 30, 40};

    // Access - O(1)
    cout << arr[2] << endl; // 30

    // Traverse - O(n)
    for (int i = 0; i < 4; i++) {
        cout << arr[i] << endl;
    }

    // Delete at index (shift left) - O(n)
    int deleteIndex = 1;
    for (int i = deleteIndex; i < 3; i++) {
        arr[i] = arr[i + 1];
    }
    return 0;
}`,
        },
      },
      {
        id: "twod",
        name: "2D Array (Matrix)",
        tagline: "A grid of rows and columns — an array of arrays.",
        theory: {
          definition:
            "A two-dimensional array (matrix) stores elements in a grid addressed by a row index and a column index, arr[row][col].",
          working:
            "A 2D array is typically laid out in memory as rows placed one after another (row-major order), so the address of arr[r][c] is computed from the base address plus r * numCols + c.",
          operations: [
            "Access — read arr[row][col] directly",
            "Set — write a value at arr[row][col]",
            "Traverse — visit every cell, usually row by row",
            "Row/Column sum — walk a single row or column",
          ],
          complexity: [
            { op: "Access", time: "O(1)" },
            { op: "Traverse all", time: "O(rows × cols)" },
            { op: "Row/Col scan", time: "O(n)" },
            { op: "Search", time: "O(rows × cols)" },
          ],
          realWorld:
            "A spreadsheet, a chessboard, or the pixel grid of an image — anything naturally organized in rows and columns.",
          interviewTip:
            "Know the difference between row-major (C/C++/Java) and column-major (Fortran) storage — it affects cache-friendly traversal order.",
        },
        code: {
          java: `// 2D Array (Matrix) basics in Java
public class Matrix {
    public static void main(String[] args) {
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        // Access - O(1)
        System.out.println(grid[1][2]); // 6

        // Set a cell - O(1)
        grid[0][0] = 99;

        // Traverse row by row - O(rows * cols)
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[r].length; c++) {
                System.out.print(grid[r][c] + " ");
            }
            System.out.println();
        }
    }
}`,
          cpp: `// 2D Array (Matrix) basics in C++
#include <iostream>
using namespace std;

int main() {
    int grid[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    // Access - O(1)
    cout << grid[1][2] << endl; // 6

    // Set a cell - O(1)
    grid[0][0] = 99;

    // Traverse row by row - O(rows * cols)
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 3; c++) {
            cout << grid[r][c] << " ";
        }
        cout << endl;
    }
    return 0;
}`,
        },
      },
      {
        id: "dynamic",
        name: "Dynamic Array",
        tagline: "A resizable array (ArrayList / vector) that grows automatically.",
        theory: {
          definition:
            "A dynamic array is an array that automatically resizes itself when it runs out of capacity, giving the illusion of unlimited growth while still supporting O(1) indexed access.",
          working:
            "Internally it keeps a fixed-capacity backing array plus a 'size' counter. When size reaches capacity, a new backing array (usually double the size) is allocated and every element is copied over — an O(n) operation that happens rarely, so the average (amortized) cost of appending stays O(1).",
          operations: [
            "Access — read a value directly using its index",
            "Push/Add — append at the end, reusing capacity or growing",
            "Insert — add at an index, shifting later elements",
            "Remove — delete an element, shifting later elements",
          ],
          complexity: [
            { op: "Access", time: "O(1)" },
            { op: "Add at end", time: "O(1) amortized" },
            { op: "Insert/Remove (middle)", time: "O(n)" },
            { op: "Resize (grow)", time: "O(n), rare" },
          ],
          realWorld:
            "Java's ArrayList, C++'s std::vector, and Python's list are all dynamic arrays under the hood.",
          interviewTip:
            "Be ready to explain 'amortized O(1)' — most appends are O(1), but doubling the backing array is O(n), and averaged over many appends the cost per append stays constant.",
        },
        code: {
          java: `// Dynamic Array using Java's ArrayList
import java.util.ArrayList;

public class DynamicArrayDemo {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();

        // Add at end - amortized O(1)
        list.add(10);
        list.add(20);
        list.add(30);

        // Access - O(1)
        System.out.println(list.get(1)); // 20

        // Insert at index - O(n)
        list.add(1, 99); // [10, 99, 20, 30]

        // Remove - O(n)
        list.remove(0); // [99, 20, 30]

        for (int value : list) {
            System.out.println(value);
        }
    }
}`,
          cpp: `// Dynamic Array using C++ std::vector
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;

    // Add at end - amortized O(1)
    v.push_back(10);
    v.push_back(20);
    v.push_back(30);

    // Access - O(1)
    cout << v[1] << endl; // 20

    // Insert at index - O(n)
    v.insert(v.begin() + 1, 99); // [10, 99, 20, 30]

    // Remove - O(n)
    v.erase(v.begin()); // [99, 20, 30]

    for (int value : v) {
        cout << value << endl;
    }
    return 0;
}`,
        },
      },
    ],
  },
  {
    id: "stack",
    name: "Stack",
    tagline: "A Last-In-First-Out (LIFO) structure — the last item added is the first removed.",
    color: "#8b5cf6",
    subtypes: [
      {
        id: "arraystack",
        name: "Array-based Stack",
        tagline: "A stack built on top of a fixed/dynamic array — push and pop at one end.",
        theory: {
          definition:
            "An array-based stack is a stack implemented using an array (or dynamic array) where elements are added and removed only from one end, called the top, giving Last-In-First-Out (LIFO) behaviour.",
          working:
            "A 'top' index tracks the last occupied slot. Push writes to top+1 and increments top; pop reads the value at top and decrements top — both O(1) as long as the backing array has room.",
          operations: [
            "Push — add an element to the top",
            "Pop — remove the top element",
            "Peek / Top — view the top element without removing it",
            "isEmpty — check whether the stack has any elements",
          ],
          complexity: [
            { op: "Push", time: "O(1)" },
            { op: "Pop", time: "O(1)" },
            { op: "Peek", time: "O(1)" },
            { op: "Search", time: "O(n)" },
          ],
          realWorld:
            "A stack of plates, the browser's back button history, or the undo feature in a text editor.",
          interviewTip:
            "Stacks are the go-to structure for balanced-parentheses checks and for converting recursion into iteration.",
        },
        code: {
          java: `// Array-based Stack in Java
public class ArrayStack {
    private int[] data;
    private int top = -1;

    public ArrayStack(int capacity) {
        data = new int[capacity];
    }

    public void push(int value) {
        data[++top] = value; // O(1)
    }

    public int pop() {
        return data[top--]; // O(1)
    }

    public int peek() {
        return data[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }
}`,
          cpp: `// Array-based Stack in C++
#include <iostream>
using namespace std;

class ArrayStack {
    int data[100];
    int top = -1;

public:
    void push(int value) {
        data[++top] = value; // O(1)
    }

    int pop() {
        return data[top--]; // O(1)
    }

    int peek() {
        return data[top];
    }

    bool isEmpty() {
        return top == -1;
    }
};`,
        },
      },
      {
        id: "linkedstack",
        name: "Linked List based Stack",
        tagline: "A stack built from linked nodes — push/pop at the head, no fixed capacity.",
        theory: {
          definition:
            "A linked-list-based stack stores its elements as nodes connected by pointers, where the 'top' of the stack is simply the head of the linked list.",
          working:
            "Push creates a new node, points it at the current head, and makes it the new head. Pop reads the head's value, then moves head to head.next. Both operations touch only the front node, so they're O(1) with no resizing ever needed.",
          operations: [
            "Push — create a node, link it before the current head, update head",
            "Pop — read the head node's value, move head to head.next",
            "Peek / Top — read the head node's value without removing it",
            "isEmpty — check whether head is null",
          ],
          complexity: [
            { op: "Push", time: "O(1)" },
            { op: "Pop", time: "O(1)" },
            { op: "Peek", time: "O(1)" },
            { op: "Search", time: "O(n)" },
          ],
          realWorld:
            "Function call stacks in a program's runtime are conceptually linked-list-based stacks — frames are pushed/popped without any fixed size limit.",
          interviewTip:
            "Contrast with the array version: a linked stack never needs to resize/copy, but each node costs extra memory for the pointer.",
        },
        code: {
          java: `// Linked List based Stack in Java
public class LinkedStack {
    private static class Node {
        int value;
        Node next;
        Node(int value) { this.value = value; }
    }

    private Node top;

    public void push(int value) {
        Node node = new Node(value);
        node.next = top;
        top = node; // O(1)
    }

    public int pop() {
        int value = top.value;
        top = top.next; // O(1)
        return value;
    }

    public int peek() {
        return top.value;
    }

    public boolean isEmpty() {
        return top == null;
    }
}`,
          cpp: `// Linked List based Stack in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

class LinkedStack {
    Node* top = nullptr;

public:
    void push(int value) {
        Node* node = new Node(value);
        node->next = top;
        top = node; // O(1)
    }

    int pop() {
        int value = top->value;
        Node* old = top;
        top = top->next; // O(1)
        delete old;
        return value;
    }

    int peek() {
        return top->value;
    }

    bool isEmpty() {
        return top == nullptr;
    }
};`,
        },
      },
    ],
  },
  {
    id: "queue",
    name: "Queue",
    tagline: "A First-In-First-Out (FIFO) structure — the first item added is the first removed.",
    color: "#0ea5e9",
    subtypes: [
      {
        id: "simple",
        name: "Simple Queue",
        tagline: "Classic FIFO queue — enqueue at the rear, dequeue from the front.",
        theory: {
          definition:
            "A simple queue is a linear data structure that follows the First-In-First-Out (FIFO) principle: the element added first is the first to be removed.",
          working:
            "New elements are added at the rear and removed from the front, so items leave in exactly the order they arrived.",
          operations: [
            "Enqueue — add an element at the rear",
            "Dequeue — remove the element at the front",
            "Front — view the front element without removing it",
            "isEmpty — check whether the queue has any elements",
          ],
          complexity: [
            { op: "Enqueue", time: "O(1)" },
            { op: "Dequeue", time: "O(1)*" },
            { op: "Front", time: "O(1)" },
            { op: "Search", time: "O(n)" },
          ],
          realWorld:
            "A line at a ticket counter, a print queue, or tasks waiting to be processed by a server.",
          interviewTip:
            "Queues power breadth-first search (BFS) — mention that connection whenever discussing traversal problems. *A naive array dequeue that shifts elements is O(n); a proper queue uses a front pointer or linked list to keep it O(1).",
        },
        code: {
          java: `// Simple Queue using Java's ArrayDeque
import java.util.ArrayDeque;

public class SimpleQueue {
    public static void main(String[] args) {
        ArrayDeque<Integer> queue = new ArrayDeque<>();

        queue.addLast(10); // enqueue - O(1)
        queue.addLast(20);
        queue.addLast(30);

        System.out.println(queue.peekFirst()); // front - O(1)
        System.out.println(queue.pollFirst()); // dequeue - O(1) -> 10
    }
}`,
          cpp: `// Simple Queue using C++ std::queue
#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> q;

    q.push(10); // enqueue - O(1)
    q.push(20);
    q.push(30);

    cout << q.front() << endl; // front - O(1)
    q.pop(); // dequeue - O(1)
    return 0;
}`,
        },
      },
      {
        id: "circular",
        name: "Circular Queue",
        tagline: "A fixed-size queue that wraps front/rear pointers around, reusing freed slots.",
        theory: {
          definition:
            "A circular queue is a fixed-capacity queue where the rear pointer wraps back to index 0 after reaching the end of the array, reusing slots freed by dequeues instead of wasting them.",
          working:
            "Front and rear indices are advanced with modulo arithmetic: rear = (rear + 1) % capacity. This lets the queue reuse space vacated at the front without ever shifting elements, avoiding the wasted space a naive array queue would leave behind.",
          operations: [
            "Enqueue — place a value at rear, then rear = (rear + 1) % capacity",
            "Dequeue — read value at front, then front = (front + 1) % capacity",
            "isFull — check if the next rear slot would collide with front",
            "isEmpty — check whether front equals rear with no elements",
          ],
          complexity: [
            { op: "Enqueue", time: "O(1)" },
            { op: "Dequeue", time: "O(1)" },
            { op: "Front", time: "O(1)" },
            { op: "Space usage", time: "Fixed, fully reused" },
          ],
          realWorld:
            "CPU task scheduling ring buffers, streaming audio/video buffers, and traffic light control cycles.",
          interviewTip:
            "Watch for the full-vs-empty ambiguity when front == rear — solved either with a size counter or by always leaving one slot empty.",
        },
        code: {
          java: `// Circular Queue in Java
public class CircularQueue {
    private int[] data;
    private int front = 0, rear = -1, size = 0;
    private int capacity;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        data = new int[capacity];
    }

    public void enqueue(int value) {
        if (size == capacity) return; // full
        rear = (rear + 1) % capacity;
        data[rear] = value;
        size++;
    }

    public int dequeue() {
        int value = data[front];
        front = (front + 1) % capacity;
        size--;
        return value;
    }

    public boolean isEmpty() {
        return size == 0;
    }
}`,
          cpp: `// Circular Queue in C++
#include <iostream>
using namespace std;

class CircularQueue {
    int* data;
    int front = 0, rear = -1, size = 0, capacity;

public:
    CircularQueue(int cap) : capacity(cap) {
        data = new int[capacity];
    }

    void enqueue(int value) {
        if (size == capacity) return; // full
        rear = (rear + 1) % capacity;
        data[rear] = value;
        size++;
    }

    int dequeue() {
        int value = data[front];
        front = (front + 1) % capacity;
        size--;
        return value;
    }

    bool isEmpty() {
        return size == 0;
    }
};`,
        },
      },
      {
        id: "deque",
        name: "Deque (Double-Ended Queue)",
        tagline: "Insert or remove from both the front and the rear.",
        theory: {
          definition:
            "A deque (double-ended queue) generalizes the queue by allowing insertion and removal from both ends — the front and the rear.",
          working:
            "It's usually implemented with a doubly linked list or a growable circular buffer so both ends support O(1) insert/remove without shifting the other elements.",
          operations: [
            "pushFront / pushBack — insert at the front or the rear",
            "popFront / popBack — remove from the front or the rear",
            "front / back — peek at either end without removing",
            "isEmpty — check whether the deque has any elements",
          ],
          complexity: [
            { op: "pushFront / pushBack", time: "O(1)" },
            { op: "popFront / popBack", time: "O(1)" },
            { op: "front / back", time: "O(1)" },
            { op: "Search", time: "O(n)" },
          ],
          realWorld:
            "The undo/redo history of an editor, a browser's tab history, or the sliding-window technique in algorithms.",
          interviewTip:
            "A deque can simulate both a stack and a queue — useful when a problem needs flexibility at both ends, like the sliding window maximum problem.",
        },
        code: {
          java: `// Deque using Java's ArrayDeque
import java.util.ArrayDeque;

public class DequeDemo {
    public static void main(String[] args) {
        ArrayDeque<Integer> dq = new ArrayDeque<>();

        dq.addFirst(10); // pushFront - O(1)
        dq.addLast(20);  // pushBack  - O(1)
        dq.addFirst(5);  // [5, 10, 20]

        System.out.println(dq.peekFirst()); // 5
        System.out.println(dq.peekLast());  // 20

        dq.pollFirst(); // popFront - O(1)
        dq.pollLast();  // popBack  - O(1)
    }
}`,
          cpp: `// Deque using C++ std::deque
#include <iostream>
#include <deque>
using namespace std;

int main() {
    deque<int> dq;

    dq.push_front(10); // O(1)
    dq.push_back(20);  // O(1)
    dq.push_front(5);  // [5, 10, 20]

    cout << dq.front() << endl; // 5
    cout << dq.back() << endl;  // 20

    dq.pop_front(); // O(1)
    dq.pop_back();  // O(1)
    return 0;
}`,
        },
      },
      {
        id: "priority",
        name: "Priority Queue",
        tagline: "Elements come out in priority order, not insertion order.",
        theory: {
          definition:
            "A priority queue is an abstract queue where each element has a priority, and dequeue always returns the element with the highest (or lowest) priority rather than the one that arrived first.",
          working:
            "Priority queues are almost always implemented with a binary heap: the highest-priority element sits at the root, and insert/removeTop 'bubble' the changed element up or down to restore the heap property in O(log n).",
          operations: [
            "Insert — add an element and bubble it up to its correct place",
            "removeTop / poll — remove and return the highest-priority element",
            "peek — view the highest-priority element without removing it",
            "isEmpty — check whether the priority queue has any elements",
          ],
          complexity: [
            { op: "Insert", time: "O(log n)" },
            { op: "removeTop", time: "O(log n)" },
            { op: "peek", time: "O(1)" },
            { op: "Build from n items", time: "O(n)" },
          ],
          realWorld:
            "Hospital emergency room triage, CPU task scheduling by priority, and Dijkstra's shortest-path algorithm.",
          interviewTip:
            "Know both min-heap and max-heap variants, and be ready to explain why a heap beats a sorted array for this job (O(log n) insert vs O(n)).",
        },
        code: {
          java: `// Priority Queue using Java's PriorityQueue (min-heap by default)
import java.util.PriorityQueue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        pq.offer(30); // insert - O(log n)
        pq.offer(10);
        pq.offer(20);

        System.out.println(pq.peek()); // 10 (smallest first)
        System.out.println(pq.poll()); // removeTop - O(log n) -> 10
        System.out.println(pq.poll()); // 20
    }
}`,
          cpp: `// Priority Queue using C++ std::priority_queue (max-heap by default)
#include <iostream>
#include <queue>
using namespace std;

int main() {
    priority_queue<int> pq;

    pq.push(30); // insert - O(log n)
    pq.push(10);
    pq.push(20);

    cout << pq.top() << endl; // 30 (largest first)
    pq.pop(); // removeTop - O(log n)
    cout << pq.top() << endl; // 20
    return 0;
}`,
        },
      },
    ],
  },
  {
    id: "linkedlist",
    name: "Linked List",
    tagline: "A chain of nodes where each node points to the next (and sometimes the previous).",
    color: "#f59e0b",
    subtypes: [
      {
        id: "singly",
        name: "Singly Linked List",
        tagline: "Each node points only forward, to the next node. Ends in NULL.",
        theory: {
          definition:
            "A singly linked list is a linear data structure made of nodes, where each node stores a value and a single pointer to the next node in the chain, ending in null.",
          working:
            "Unlike arrays, nodes don't need to sit next to each other in memory — the list is held together purely by 'next' pointers, so insertion and deletion don't require shifting other elements.",
          operations: [
            "Insert at head / tail — attach a new node by relinking pointers",
            "Delete — remove a node by relinking its neighbour's next pointer",
            "Traverse — follow next pointers from head to null",
            "Search — walk the list comparing each node's value",
          ],
          complexity: [
            { op: "Access", time: "O(n)" },
            { op: "Search", time: "O(n)" },
            { op: "Insert at head", time: "O(1)" },
            { op: "Delete at head", time: "O(1)" },
          ],
          realWorld:
            "A treasure hunt where each clue points to the location of the next one, or a music playlist's 'next track' chain.",
          interviewTip:
            "Highlight that insertion/deletion at the head is O(1) — the classic advantage over arrays — but random access is O(n).",
        },
        code: {
          java: `// Singly Linked List in Java
public class SinglyLinkedList {
    static class Node {
        int value;
        Node next;
        Node(int value) { this.value = value; }
    }

    Node head;

    void insertAtHead(int value) {
        Node node = new Node(value);
        node.next = head;
        head = node; // O(1)
    }

    void traverse() {
        Node current = head;
        while (current != null) {
            System.out.println(current.value);
            current = current.next;
        }
    }
}`,
          cpp: `// Singly Linked List in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

class SinglyLinkedList {
    Node* head = nullptr;

public:
    void insertAtHead(int value) {
        Node* node = new Node(value);
        node->next = head;
        head = node; // O(1)
    }

    void traverse() {
        Node* current = head;
        while (current != nullptr) {
            cout << current->value << endl;
            current = current->next;
        }
    }
};`,
        },
      },
      {
        id: "doubly",
        name: "Doubly Linked List",
        tagline: "Each node points both forward and backward, so the list can be walked either way.",
        theory: {
          definition:
            "A doubly linked list is a linked list where every node stores two pointers — 'next' and 'prev' — allowing traversal in both directions.",
          working:
            "Because each node knows its previous neighbour as well as its next, operations like deleting a given node or traversing backward from the tail don't require re-walking the list from the head, at the cost of one extra pointer per node.",
          operations: [
            "Insert at head / tail — relink both next and prev pointers",
            "Delete — relink the neighbours on both sides in one step",
            "Traverse forward — follow next pointers from head",
            "Traverse backward — follow prev pointers from tail",
          ],
          complexity: [
            { op: "Access", time: "O(n)" },
            { op: "Search", time: "O(n)" },
            { op: "Insert at head/tail", time: "O(1)" },
            { op: "Delete (given node)", time: "O(1)" },
          ],
          realWorld:
            "The forward/backward navigation of a music player's playlist, or a browser's page history that supports both back and forward.",
          interviewTip:
            "Mention the trade-off: doubly linked lists use more memory per node (extra pointer) but make deletion of a known node O(1) without needing its predecessor.",
        },
        code: {
          java: `// Doubly Linked List in Java
public class DoublyLinkedList {
    static class Node {
        int value;
        Node next, prev;
        Node(int value) { this.value = value; }
    }

    Node head, tail;

    void insertAtHead(int value) {
        Node node = new Node(value);
        node.next = head;
        if (head != null) head.prev = node;
        head = node; // O(1)
        if (tail == null) tail = node;
    }

    void traverseForward() {
        Node current = head;
        while (current != null) {
            System.out.println(current.value);
            current = current.next;
        }
    }
}`,
          cpp: `// Doubly Linked List in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node* prev;
    Node(int v) : value(v), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
    Node* head = nullptr;
    Node* tail = nullptr;

public:
    void insertAtHead(int value) {
        Node* node = new Node(value);
        node->next = head;
        if (head != nullptr) head->prev = node;
        head = node; // O(1)
        if (tail == nullptr) tail = node;
    }

    void traverseForward() {
        Node* current = head;
        while (current != nullptr) {
            cout << current->value << endl;
            current = current->next;
        }
    }
};`,
        },
      },
      {
        id: "circularsingly",
        name: "Circular Singly Linked List",
        tagline: "Like a singly list, but the last node points back to the head instead of NULL.",
        theory: {
          definition:
            "A circular singly linked list is a singly linked list where the last node's next pointer points back to the head instead of null, forming a loop with no true end.",
          working:
            "Traversal must stop by comparing against the starting node (not against null), since the loop would otherwise run forever. This structure is useful whenever data is naturally cyclic.",
          operations: [
            "Insert at head / tail — relink pointers and keep the last node pointing to head",
            "Delete — relink neighbours, keeping the loop intact",
            "Traverse — walk with a do-while style loop until back at the start node",
            "Search — walk the loop once, comparing each node's value",
          ],
          complexity: [
            { op: "Access", time: "O(n)" },
            { op: "Search", time: "O(n)" },
            { op: "Insert at head", time: "O(1)*" },
            { op: "Delete at head", time: "O(1)*" },
          ],
          realWorld:
            "Round-robin CPU scheduling, a multiplayer game's turn order, or a circular playlist that repeats forever. *O(1) if a tail pointer is kept; otherwise O(n) to find the last node.",
          interviewTip:
            "A classic interview trap: forgetting to update the last node's 'next' pointer back to the new head after an insert, which breaks the circle.",
        },
        code: {
          java: `// Circular Singly Linked List in Java
public class CircularSinglyLinkedList {
    static class Node {
        int value;
        Node next;
        Node(int value) { this.value = value; }
    }

    Node head, tail;

    void insertAtHead(int value) {
        Node node = new Node(value);
        if (head == null) {
            head = node;
            tail = node;
            node.next = head; // points to itself
            return;
        }
        node.next = head;
        head = node;
        tail.next = head; // keep the loop closed - O(1) with tail pointer
    }

    void traverse() {
        if (head == null) return;
        Node current = head;
        do {
            System.out.println(current.value);
            current = current.next;
        } while (current != head);
    }
}`,
          cpp: `// Circular Singly Linked List in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

class CircularSinglyLinkedList {
    Node* head = nullptr;
    Node* tail = nullptr;

public:
    void insertAtHead(int value) {
        Node* node = new Node(value);
        if (head == nullptr) {
            head = node;
            tail = node;
            node->next = head; // points to itself
            return;
        }
        node->next = head;
        head = node;
        tail->next = head; // keep the loop closed - O(1) with tail pointer
    }

    void traverse() {
        if (head == nullptr) return;
        Node* current = head;
        do {
            cout << current->value << endl;
            current = current->next;
        } while (current != head);
    }
};`,
        },
      },
      {
        id: "circulardoubly",
        name: "Circular Doubly Linked List",
        tagline: "Both directions loop: head.prev points to tail, and tail.next points to head.",
        theory: {
          definition:
            "A circular doubly linked list combines both ideas: every node has next and prev pointers, and the list wraps around so tail.next points to head and head.prev points to tail.",
          working:
            "This gives O(1) access to both ends from any node and lets traversal move in either direction indefinitely around the loop, which is why it's used for structures that need constant-time rotation, like an LRU cache's internal list.",
          operations: [
            "Insert at head / tail — relink four pointers (this node's next/prev and its two neighbours')",
            "Delete — relink the two neighbours directly to each other",
            "Traverse forward / backward — loop until back at the starting node",
            "Rotate — move the 'start' pointer to head.next or head.prev in O(1)",
          ],
          complexity: [
            { op: "Access", time: "O(n)" },
            { op: "Insert (given position)", time: "O(1)" },
            { op: "Delete (given node)", time: "O(1)" },
            { op: "Rotate start pointer", time: "O(1)" },
          ],
          realWorld:
            "The internal structure of an LRU cache, a circular buffer for audio playback, or a deck of cards passed around a table in both directions.",
          interviewTip:
            "This is the structure behind many 'design an LRU cache' interview questions — know that O(1) insert/delete of a known node is the main reason it's chosen.",
        },
        code: {
          java: `// Circular Doubly Linked List in Java
public class CircularDoublyLinkedList {
    static class Node {
        int value;
        Node next, prev;
        Node(int value) { this.value = value; }
    }

    Node head;

    void insertAtHead(int value) {
        Node node = new Node(value);
        if (head == null) {
            node.next = node;
            node.prev = node;
            head = node;
            return;
        }
        Node tail = head.prev;
        node.next = head;
        node.prev = tail;
        tail.next = node;
        head.prev = node;
        head = node; // O(1)
    }

    void traverseForward() {
        if (head == null) return;
        Node current = head;
        do {
            System.out.println(current.value);
            current = current.next;
        } while (current != head);
    }
}`,
          cpp: `// Circular Doubly Linked List in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
    Node* prev;
    Node(int v) : value(v), next(nullptr), prev(nullptr) {}
};

class CircularDoublyLinkedList {
    Node* head = nullptr;

public:
    void insertAtHead(int value) {
        Node* node = new Node(value);
        if (head == nullptr) {
            node->next = node;
            node->prev = node;
            head = node;
            return;
        }
        Node* tail = head->prev;
        node->next = head;
        node->prev = tail;
        tail->next = node;
        head->prev = node;
        head = node; // O(1)
    }

    void traverseForward() {
        if (head == nullptr) return;
        Node* current = head;
        do {
            cout << current->value << endl;
            current = current->next;
        } while (current != head);
    }
};`,
        },
      },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    tagline: "A hierarchical structure of nodes — Binary Trees, BSTs, AVL Trees, and Heaps.",
    color: "#10b981",
    subtypes: [
      {
        id: "binary",
        name: "Binary Tree",
        tagline: "Each node has at most two children, filled level by level — no ordering rule.",
        theory: {
          definition:
            "A binary tree is a hierarchical data structure where each node has at most two children, commonly called left and right, with no ordering requirement between them.",
          working:
            "New values are typically inserted level by level, left to right, to keep the tree 'complete' — filling the topmost, leftmost empty spot first. Because there's no ordering rule, searching a plain binary tree requires visiting nodes, unlike a BST.",
          operations: [
            "Insert — place a new value in the next open spot, level by level",
            "Traverse (pre/in/post-order) — visit nodes in different systematic orders",
            "Level-order traversal — visit nodes breadth-first using a queue",
            "Height — the longest path from root to a leaf",
          ],
          complexity: [
            { op: "Insert (level order)", time: "O(n)" },
            { op: "Search", time: "O(n)" },
            { op: "Traversal (any order)", time: "O(n)" },
            { op: "Height", time: "O(n)" },
          ],
          realWorld:
            "The structure behind expression trees (like (a + b) * c), or a simple decision tree with two outcomes at every step.",
          interviewTip:
            "Don't confuse a plain binary tree with a BST — a plain binary tree has no left-smaller/right-larger ordering, so search is O(n), not O(log n).",
        },
        code: {
          java: `// Binary Tree (level-order insert) in Java
import java.util.LinkedList;
import java.util.Queue;

public class BinaryTree {
    static class Node {
        int value;
        Node left, right;
        Node(int value) { this.value = value; }
    }

    Node root;

    void insert(int value) {
        Node node = new Node(value);
        if (root == null) { root = node; return; }
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            if (current.left == null) { current.left = node; return; }
            else queue.add(current.left);
            if (current.right == null) { current.right = node; return; }
            else queue.add(current.right);
        }
    }

    void inorder(Node node) {
        if (node == null) return;
        inorder(node.left);
        System.out.println(node.value);
        inorder(node.right);
    }
}`,
          cpp: `// Binary Tree (level-order insert) in C++
#include <iostream>
#include <queue>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
    Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

class BinaryTree {
    Node* root = nullptr;

public:
    void insert(int value) {
        Node* node = new Node(value);
        if (root == nullptr) { root = node; return; }
        queue<Node*> q;
        q.push(root);
        while (!q.empty()) {
            Node* current = q.front(); q.pop();
            if (current->left == nullptr) { current->left = node; return; }
            else q.push(current->left);
            if (current->right == nullptr) { current->right = node; return; }
            else q.push(current->right);
        }
    }

    void inorder(Node* node) {
        if (node == nullptr) return;
        inorder(node->left);
        cout << node->value << endl;
        inorder(node->right);
    }
};`,
        },
      },
      {
        id: "bst",
        name: "Binary Search Tree (BST)",
        tagline: "Left subtree holds smaller values, right subtree holds larger ones.",
        theory: {
          definition:
            "A Binary Search Tree (BST) is a binary tree that keeps smaller values in the left subtree and larger values in the right subtree of every node.",
          working:
            "Each node has at most two children. This ordering means search, insert, and delete can skip half the remaining tree at every step, similar to binary search — as long as the tree stays reasonably balanced.",
          operations: [
            "Insert — place a new value by comparing against nodes, going left or right",
            "Search — follow left/right comparisons until the value is found or a leaf is reached",
            "In-order Traversal — visit left subtree, node, right subtree (gives sorted order)",
            "Delete — remove a node and reattach its subtrees correctly",
          ],
          complexity: [
            { op: "Search (balanced)", time: "O(log n)" },
            { op: "Insert (balanced)", time: "O(log n)" },
            { op: "Delete (balanced)", time: "O(log n)" },
            { op: "Search (worst case)", time: "O(n)" },
          ],
          realWorld:
            "A family tree, a company's org chart, or the folder structure on your computer.",
          interviewTip:
            "Note that a BST degrades to a linked list (O(n)) if values are inserted in sorted order without balancing (AVL/Red-Black trees fix this).",
        },
        code: {
          java: `// Binary Search Tree in Java
public class BST {
    static class Node {
        int value;
        Node left, right;
        Node(int value) { this.value = value; }
    }

    Node root;

    Node insert(Node node, int value) {
        if (node == null) return new Node(value);
        if (value < node.value) node.left = insert(node.left, value);
        else if (value > node.value) node.right = insert(node.right, value);
        return node;
    }

    boolean search(Node node, int value) {
        if (node == null) return false;
        if (node.value == value) return true;
        return value < node.value ? search(node.left, value) : search(node.right, value);
    }

    void inorder(Node node) {
        if (node == null) return;
        inorder(node.left);
        System.out.println(node.value);
        inorder(node.right);
    }
}`,
          cpp: `// Binary Search Tree in C++
#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
    Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* node, int value) {
    if (node == nullptr) return new Node(value);
    if (value < node->value) node->left = insert(node->left, value);
    else if (value > node->value) node->right = insert(node->right, value);
    return node;
}

bool search(Node* node, int value) {
    if (node == nullptr) return false;
    if (node->value == value) return true;
    return value < node->value ? search(node->left, value) : search(node->right, value);
}

void inorder(Node* node) {
    if (node == nullptr) return;
    inorder(node->left);
    cout << node->value << endl;
    inorder(node->right);
}`,
        },
      },
      {
        id: "avl",
        name: "AVL Tree",
        tagline: "A self-balancing BST — rotations keep every subtree's height difference ≤ 1.",
        theory: {
          definition:
            "An AVL tree is a self-balancing Binary Search Tree in which, for every node, the height of the left and right subtrees differs by at most 1 (the 'balance factor').",
          working:
            "After every insert or delete, the tree walks back up from the changed node checking the balance factor. If a node becomes unbalanced (difference of 2), it performs a rotation — a local restructuring (left, right, left-right, or right-left) — to restore balance in O(1) per node, keeping the whole tree at height O(log n).",
          operations: [
            "Insert — BST insert, then rebalance with rotations on the way back up",
            "Delete — BST delete, then rebalance with rotations on the way back up",
            "Rotate left / right — the local restructuring that fixes an imbalance",
            "Get balance factor — height(left) − height(right) for a node",
          ],
          complexity: [
            { op: "Search", time: "O(log n)" },
            { op: "Insert", time: "O(log n)" },
            { op: "Delete", time: "O(log n)" },
            { op: "Rotation", time: "O(1)" },
          ],
          realWorld:
            "Database indexes and language runtime libraries (like Java's TreeMap in spirit) use balanced trees so lookups stay fast (O(log n)) no matter the insertion order.",
          interviewTip:
            "Be ready to name and draw the four rotation cases: Left-Left, Right-Right, Left-Right, Right-Left — interviewers love asking you to trace one by hand.",
        },
        code: {
          java: `// AVL Tree insert with rotations in Java
public class AVLTree {
    static class Node {
        int value, height = 1;
        Node left, right;
        Node(int value) { this.value = value; }
    }

    int height(Node n) { return n == null ? 0 : n.height; }
    int balanceFactor(Node n) { return n == null ? 0 : height(n.left) - height(n.right); }

    Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }

    Node rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        x.height = 1 + Math.max(height(x.left), height(x.right));
        y.height = 1 + Math.max(height(y.left), height(y.right));
        return y;
    }

    Node insert(Node node, int value) {
        if (node == null) return new Node(value);
        if (value < node.value) node.left = insert(node.left, value);
        else if (value > node.value) node.right = insert(node.right, value);
        else return node;

        node.height = 1 + Math.max(height(node.left), height(node.right));
        int balance = balanceFactor(node);

        if (balance > 1 && value < node.left.value) return rotateRight(node);
        if (balance < -1 && value > node.right.value) return rotateLeft(node);
        if (balance > 1 && value > node.left.value) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }
}`,
          cpp: `// AVL Tree insert with rotations in C++
#include <algorithm>
using namespace std;

struct Node {
    int value, height = 1;
    Node* left = nullptr;
    Node* right = nullptr;
    Node(int v) : value(v) {}
};

int height(Node* n) { return n == nullptr ? 0 : n->height; }
int balanceFactor(Node* n) { return n == nullptr ? 0 : height(n->left) - height(n->right); }

Node* rotateRight(Node* y) {
    Node* x = y->left;
    y->left = x->right;
    x->right = y;
    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));
    return x;
}

Node* rotateLeft(Node* x) {
    Node* y = x->right;
    x->right = y->left;
    y->left = x;
    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}

Node* insert(Node* node, int value) {
    if (node == nullptr) return new Node(value);
    if (value < node->value) node->left = insert(node->left, value);
    else if (value > node->value) node->right = insert(node->right, value);
    else return node;

    node->height = 1 + max(height(node->left), height(node->right));
    int balance = balanceFactor(node);

    if (balance > 1 && value < node->left->value) return rotateRight(node);
    if (balance < -1 && value > node->right->value) return rotateLeft(node);
    if (balance > 1 && value > node->left->value) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    if (balance < -1 && value < node->right->value) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }
    return node;
}`,
        },
      },
      {
        id: "heap",
        name: "Heap (Min-Heap)",
        tagline: "A complete binary tree stored in an array — the smallest value always sits at the root.",
        theory: {
          definition:
            "A min-heap is a complete binary tree where every parent is less than or equal to its children, so the minimum value is always at the root. It's usually stored compactly in an array, with a node at index i having children at 2i+1 and 2i+2.",
          working:
            "Insert adds the new value at the next open array slot (keeping the tree complete) then 'bubbles up' by swapping with its parent while it's smaller. Removing the root swaps the last element into the root's place, shrinks the array, then 'bubbles down' by swapping with the smaller child until the heap property holds again.",
          operations: [
            "Insert — add at the end, then bubble up (sift-up)",
            "extractMin — remove the root, move the last element to root, bubble down (sift-down)",
            "peek — read the root value without removing it",
            "heapify — build a valid heap from an unsorted array in O(n)",
          ],
          complexity: [
            { op: "Insert", time: "O(log n)" },
            { op: "extractMin", time: "O(log n)" },
            { op: "peek", time: "O(1)" },
            { op: "Build heap (heapify)", time: "O(n)" },
          ],
          realWorld:
            "The engine behind priority queues, heap sort, and finding the k smallest/largest elements efficiently.",
          interviewTip:
            "Remember the array index trick: for a node at index i, parent is (i-1)/2, left child is 2i+1, right child is 2i+2 — no explicit pointers needed.",
        },
        code: {
          java: `// Min-Heap (array-based) in Java
import java.util.ArrayList;

public class MinHeap {
    ArrayList<Integer> data = new ArrayList<>();

    void insert(int value) {
        data.add(value);
        int i = data.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data.get(parent) <= data.get(i)) break;
            swap(i, parent);
            i = parent;
        }
    }

    int extractMin() {
        int min = data.get(0);
        int last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);
            bubbleDown(0);
        }
        return min;
    }

    void bubbleDown(int i) {
        int n = data.size();
        while (true) {
            int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
            if (left < n && data.get(left) < data.get(smallest)) smallest = left;
            if (right < n && data.get(right) < data.get(smallest)) smallest = right;
            if (smallest == i) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    void swap(int a, int b) {
        int tmp = data.get(a);
        data.set(a, data.get(b));
        data.set(b, tmp);
    }
}`,
          cpp: `// Min-Heap (array-based) in C++
#include <vector>
using namespace std;

class MinHeap {
    vector<int> data;

    void bubbleDown(int i) {
        int n = data.size();
        while (true) {
            int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
            if (left < n && data[left] < data[smallest]) smallest = left;
            if (right < n && data[right] < data[smallest]) smallest = right;
            if (smallest == i) break;
            swap(data[i], data[smallest]);
            i = smallest;
        }
    }

public:
    void insert(int value) {
        data.push_back(value);
        int i = data.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[parent] <= data[i]) break;
            swap(data[i], data[parent]);
            i = parent;
        }
    }

    int extractMin() {
        int minVal = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) bubbleDown(0);
        return minVal;
    }
};`,
        },
      },
    ],
  },
  {
    id: "graph",
    name: "Graph",
    tagline: "A set of nodes (vertices) connected by edges — models networks and relationships.",
    color: "#ef4444",
    subtypes: [
      {
        id: "undirected",
        name: "Undirected Graph",
        tagline: "Edges have no direction — a connection between A and B goes both ways.",
        theory: {
          definition:
            "An undirected graph is a set of vertices connected by edges where each edge represents a two-way connection: if A is connected to B, B is also connected to A.",
          working:
            "Undirected graphs are commonly represented with an adjacency list, where each vertex stores a list of its neighbours, and every edge is added to both endpoints' lists. Traversal algorithms like BFS and DFS visit every reachable node exactly once.",
          operations: [
            "Add Vertex — introduce a new node",
            "Add Edge — connect two vertices in both directions",
            "BFS — explore level by level using a queue",
            "DFS — explore depth-first using a stack or recursion",
          ],
          complexity: [
            { op: "BFS / DFS", time: "O(V + E)" },
            { op: "Add Edge", time: "O(1)" },
            { op: "Add Vertex", time: "O(1)" },
            { op: "Check Adjacency (matrix)", time: "O(1)" },
          ],
          realWorld:
            "Facebook-style friendships (mutual by nature), a road network with two-way streets, or a network of computers on a LAN.",
          interviewTip:
            "Be ready to explain when to pick BFS (shortest path in unweighted graphs) vs DFS (exploring all paths, detecting cycles).",
        },
        code: {
          java: `// Undirected Graph with BFS traversal in Java
import java.util.*;

public class UndirectedGraph {
    Map<String, List<String>> adjacency = new HashMap<>();

    void addVertex(String v) {
        adjacency.putIfAbsent(v, new ArrayList<>());
    }

    void addEdge(String a, String b) {
        addVertex(a);
        addVertex(b);
        adjacency.get(a).add(b);
        adjacency.get(b).add(a); // both directions
    }

    List<String> bfs(String start) {
        Set<String> visited = new HashSet<>(List.of(start));
        Queue<String> queue = new LinkedList<>(List.of(start));
        List<String> order = new ArrayList<>();

        while (!queue.isEmpty()) {
            String node = queue.poll();
            order.add(node);
            for (String neighbor : adjacency.getOrDefault(node, List.of())) {
                if (visited.add(neighbor)) queue.add(neighbor);
            }
        }
        return order;
    }
}`,
          cpp: `// Undirected Graph with BFS traversal in C++
#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class UndirectedGraph {
    unordered_map<string, vector<string>> adjacency;

public:
    void addVertex(const string& v) {
        adjacency[v]; // creates empty list if missing
    }

    void addEdge(const string& a, const string& b) {
        addVertex(a);
        addVertex(b);
        adjacency[a].push_back(b);
        adjacency[b].push_back(a); // both directions
    }

    vector<string> bfs(const string& start) {
        unordered_set<string> visited{start};
        queue<string> q;
        q.push(start);
        vector<string> order;

        while (!q.empty()) {
            string node = q.front(); q.pop();
            order.push_back(node);
            for (const string& neighbor : adjacency[node]) {
                if (visited.insert(neighbor).second) q.push(neighbor);
            }
        }
        return order;
    }
};`,
        },
      },
      {
        id: "directed",
        name: "Directed Graph",
        tagline: "Edges point one way only — A→B does not imply B→A.",
        theory: {
          definition:
            "A directed graph (digraph) is a graph where each edge has a direction: an edge from A to B means you can travel from A to B, but not necessarily from B to A.",
          working:
            "Each vertex's adjacency list stores only its outgoing edges. Because edges are one-directional, algorithms like topological sort and cycle detection specifically rely on tracking direction, unlike in undirected graphs.",
          operations: [
            "Add Vertex — introduce a new node",
            "Add Directed Edge — connect A → B only, not B → A",
            "BFS / DFS — traverse following only outgoing edges",
            "Topological Sort — order vertices so every edge points forward",
          ],
          complexity: [
            { op: "BFS / DFS", time: "O(V + E)" },
            { op: "Add Edge", time: "O(1)" },
            { op: "Topological Sort", time: "O(V + E)" },
            { op: "Cycle Detection", time: "O(V + E)" },
          ],
          realWorld:
            "Twitter/X-style 'follows' (following someone doesn't mean they follow back), web page links, or task dependencies in a build system.",
          interviewTip:
            "Directed acyclic graphs (DAGs) are the backbone of topological sort — a favorite interview question for scheduling/dependency problems.",
        },
        code: {
          java: `// Directed Graph with BFS traversal in Java
import java.util.*;

public class DirectedGraph {
    Map<String, List<String>> adjacency = new HashMap<>();

    void addVertex(String v) {
        adjacency.putIfAbsent(v, new ArrayList<>());
    }

    void addEdge(String from, String to) {
        addVertex(from);
        addVertex(to);
        adjacency.get(from).add(to); // one direction only
    }

    List<String> bfs(String start) {
        Set<String> visited = new HashSet<>(List.of(start));
        Queue<String> queue = new LinkedList<>(List.of(start));
        List<String> order = new ArrayList<>();

        while (!queue.isEmpty()) {
            String node = queue.poll();
            order.add(node);
            for (String neighbor : adjacency.getOrDefault(node, List.of())) {
                if (visited.add(neighbor)) queue.add(neighbor);
            }
        }
        return order;
    }
}`,
          cpp: `// Directed Graph with BFS traversal in C++
#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class DirectedGraph {
    unordered_map<string, vector<string>> adjacency;

public:
    void addVertex(const string& v) {
        adjacency[v];
    }

    void addEdge(const string& from, const string& to) {
        addVertex(from);
        addVertex(to);
        adjacency[from].push_back(to); // one direction only
    }

    vector<string> bfs(const string& start) {
        unordered_set<string> visited{start};
        queue<string> q;
        q.push(start);
        vector<string> order;

        while (!q.empty()) {
            string node = q.front(); q.pop();
            order.push_back(node);
            for (const string& neighbor : adjacency[node]) {
                if (visited.insert(neighbor).second) q.push(neighbor);
            }
        }
        return order;
    }
};`,
        },
      },
      {
        id: "weighted",
        name: "Weighted Graph",
        tagline: "Every edge carries a cost/weight — used for shortest-path problems.",
        theory: {
          definition:
            "A weighted graph is a graph where every edge carries a numeric weight (cost, distance, or time), used to represent things like distance between cities or the cost of a network link.",
          working:
            "Instead of a plain neighbour list, each vertex stores pairs of (neighbour, weight). Algorithms like Dijkstra's use these weights with a priority queue to always expand the currently-cheapest reachable vertex first, guaranteeing the shortest total-weight path.",
          operations: [
            "Add Vertex — introduce a new node",
            "Add Weighted Edge — connect two vertices with a cost",
            "Dijkstra's Algorithm — find shortest weighted paths from a start vertex",
            "Minimum Spanning Tree — connect all vertices with the least total edge weight",
          ],
          complexity: [
            { op: "Dijkstra (with min-heap)", time: "O((V + E) log V)" },
            { op: "Add Edge", time: "O(1)" },
            { op: "Minimum Spanning Tree (Kruskal)", time: "O(E log E)" },
            { op: "Bellman-Ford (handles negative weights)", time: "O(V × E)" },
          ],
          realWorld:
            "GPS route planning (roads weighted by distance/time), network routing protocols, and flight-price comparison graphs.",
          interviewTip:
            "Know when Dijkstra fails: it doesn't work correctly with negative edge weights — that's when Bellman-Ford is the right tool instead.",
        },
        code: {
          java: `// Weighted Graph with Dijkstra's algorithm in Java
import java.util.*;

public class WeightedGraph {
    Map<String, List<int[]>> adjacency = new HashMap<>(); // stores [neighborIndex, weight]
    Map<String, Integer> index = new HashMap<>();
    List<String> names = new ArrayList<>();

    void addVertex(String v) {
        if (index.containsKey(v)) return;
        index.put(v, names.size());
        names.add(v);
        adjacency.put(v, new ArrayList<>());
    }

    void addEdge(String a, String b, int weight) {
        addVertex(a);
        addVertex(b);
        adjacency.get(a).add(new int[]{index.get(b), weight});
        adjacency.get(b).add(new int[]{index.get(a), weight});
    }

    int[] dijkstra(String start) {
        int n = names.size();
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[index.get(start)] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        pq.offer(new int[]{index.get(start), 0});

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int u = cur[0], d = cur[1];
            if (d > dist[u]) continue;
            for (int[] edge : adjacency.get(names.get(u))) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{v, dist[v]});
                }
            }
        }
        return dist;
    }
}`,
          cpp: `// Weighted Graph with Dijkstra's algorithm in C++
#include <unordered_map>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

class WeightedGraph {
    unordered_map<string, vector<pair<string, int>>> adjacency; // neighbor, weight

public:
    void addVertex(const string& v) {
        adjacency[v];
    }

    void addEdge(const string& a, const string& b, int weight) {
        addVertex(a);
        addVertex(b);
        adjacency[a].push_back({b, weight});
        adjacency[b].push_back({a, weight});
    }

    unordered_map<string, int> dijkstra(const string& start) {
        unordered_map<string, int> dist;
        for (auto& [v, _] : adjacency) dist[v] = INT_MAX;
        dist[start] = 0;

        // min-heap of (distance, vertex)
        priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> pq;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (d > dist[u]) continue;
            for (auto& [v, w] : adjacency[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }
        return dist;
    }
};`,
        },
      },
    ],
  },
  // ---------------------------------------------------------------------
  // The topics below don't have a dedicated 3D visualizer page yet, so
  // they're flagged `comingSoon`. They still show up as cards on the
  // Learn page (so learners can see what's on the roadmap), but their
  // "Start Learning" button is disabled instead of linking to a broken
  // page. Once a Page + Visualizer is built for one of these, just drop
  // the `comingSoon` flag and give it real `subtypes`.
  // ---------------------------------------------------------------------
  {
    id: "hashtable",
    name: "Hash Table",
    tagline: "Maps keys to values using a hash function for near-instant lookup.",
    color: "#f59e0b",
    comingSoon: true,
    subtypes: [],
  },
  {
    id: "heap",
    name: "Heap",
    tagline: "A complete binary tree that keeps the smallest or largest value on top.",
    color: "#ec4899",
    comingSoon: true,
    subtypes: [],
  },
  {
    id: "trie",
    name: "Trie",
    tagline: "A prefix tree used for fast string search and autocomplete.",
    color: "#14b8a6",
    comingSoon: true,
    subtypes: [],
  },
  {
    id: "disjointset",
    name: "Disjoint Set (Union-Find)",
    tagline: "Tracks groups of connected elements — key to Kruskal's MST and cycle detection.",
    color: "#8b5cf6",
    comingSoon: true,
    subtypes: [],
  },
];

// Topics that actually have a working Learn page + 3D visualizer.
// Progress/Dashboard/Profile percentages should be based off this list,
// not the full TOPICS list, so "coming soon" cards (which can never be
// visited) don't drag down a learner's completion percentage.
export const LEARNABLE_TOPICS = TOPICS.filter((t) => !t.comingSoon);

export function findTopic(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().replace(/[\s_-]/g, "");
  return (
    TOPICS.find(
      (t) =>
        t.id === key || t.name.toLowerCase().replace(/[\s_-]/g, "") === key
    ) || null
  );
}

export function getSubtypes(topicId) {
  const topic = findTopic(topicId);
  return topic ? topic.subtypes : [];
}

export function findSubtype(topicId, subtypeId) {
  const subtypes = getSubtypes(topicId);
  if (!subtypes.length) return null;
  return subtypes.find((s) => s.id === subtypeId) || subtypes[0];
}
