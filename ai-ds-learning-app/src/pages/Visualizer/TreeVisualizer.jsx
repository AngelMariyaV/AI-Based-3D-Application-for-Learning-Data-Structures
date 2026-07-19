import { useMemo } from "react";
import { Text, Line } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

// Classic in-order layout: x = in-order index, y = depth (root at top).
function layoutTree(root) {
  const positions = new Map();
  const edges = [];
  let counter = 0;
  let maxDepth = 0;

  function walk(node, depth) {
    if (!node) return;
    walk(node.left, depth + 1);

    const x = counter++;
    positions.set(node, { x, depth, value: node.value });
    maxDepth = Math.max(maxDepth, depth);

    walk(node.right, depth + 1);
  }
  walk(root, 0);

  function collectEdges(node) {
    if (!node) return;
    const pos = positions.get(node);
    if (node.left) {
      edges.push([pos, positions.get(node.left)]);
      collectEdges(node.left);
    }
    if (node.right) {
      edges.push([pos, positions.get(node.right)]);
      collectEdges(node.right);
    }
  }
  collectEdges(root);

  return { positions, edges, count: counter, maxDepth };
}

function heightOf(node) {
  if (!node) return 0;
  return 1 + Math.max(heightOf(node.left), heightOf(node.right));
}

function balanceFactor(node) {
  return heightOf(node.left) - heightOf(node.right);
}

const EMPTY_LABEL = {
  binary: "Binary tree is empty — try Insert",
  bst: "Tree is empty — try Insert",
  avl: "AVL tree is empty — try Insert",
  heap: "Heap is empty — try Insert",
};

function TreeVisualizer({ root, color = "#10b981", variant = "bst" }) {
  const { positions, edges, count, maxDepth } = useMemo(() => layoutTree(root), [root]);
  const showBalance = variant === "avl";
  const isHeap = variant === "heap";

  const spacingX = 1.6;
  const spacingY = 1.6;
  const offsetX = ((count - 1) * spacingX) / 2;

  const toVec = (pos) => [pos.x * spacingX - offsetX, (maxDepth - pos.depth) * spacingY - (maxDepth * spacingY) / 2, 0];

  return (
    <Scene3D cameraPosition={[0, 3, 12]}>
      {count === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.4} color={color} anchorX="center">
          {EMPTY_LABEL[variant] || "Tree is empty — try Insert"}
        </Text>
      )}

      {edges.map(([a, b], i) => (
        <Line key={i} points={[toVec(a), toVec(b)]} color="#94a3b8" lineWidth={2} />
      ))}

      {[...positions.entries()].map(([node, pos], i) => {
        const [x, y, z] = toVec(pos);
        const isRoot = pos.depth === 0;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color={isHeap && isRoot ? "#f59e0b" : color}
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>
            <Text position={[0, 0, 0.55]} fontSize={0.36} color="white" anchorX="center" anchorY="middle">
              {String(pos.value)}
            </Text>
            {showBalance && (
              <Text position={[0.55, 0.55, 0]} fontSize={0.24} color="#dc2626" anchorX="center">
                {`bf:${balanceFactor(node)}`}
              </Text>
            )}
            {isHeap && isRoot && (
              <Text position={[0, 0.85, 0]} fontSize={0.26} color="#dc2626" anchorX="center">
                MIN
              </Text>
            )}
          </group>
        );
      })}
    </Scene3D>
  );
}

export default TreeVisualizer;
