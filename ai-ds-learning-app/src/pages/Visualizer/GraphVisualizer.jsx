import { useMemo } from "react";
import { Text, Line } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function EdgeArrow({ from, to }) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const angle = Math.atan2(dy, dx);
  // Stop the arrowhead short of the node sphere's surface.
  const dist = Math.hypot(dx, dy);
  const t = dist === 0 ? 0 : (dist - 0.65) / dist;
  const tipX = from[0] + dx * t;
  const tipY = from[1] + dy * t;

  return (
    <mesh position={[tipX, tipY, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
      <coneGeometry args={[0.16, 0.36, 12]} />
      <meshStandardMaterial color="#4338ca" />
    </mesh>
  );
}

function GraphVisualizer({
  nodes = [],
  edges = [],
  visited = [],
  activeNode = null,
  color = "#ef4444",
  variant = "undirected",
}) {
  const radius = Math.max(2.2, nodes.length * 0.55);
  const isDirected = variant === "directed";
  const isWeighted = variant === "weighted";

  const positions = useMemo(() => {
    const map = new Map();
    nodes.forEach((id, i) => {
      const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2;
      map.set(id, [Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
    });
    return map;
  }, [nodes, radius]);

  return (
    <Scene3D cameraPosition={[0, 0, radius * 2.4]}>
      {nodes.length === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.4} color="#ef4444" anchorX="center">
          Graph is empty — add a vertex
        </Text>
      )}

      {edges.map((edge, i) => {
        const [a, b, weight] = edge;
        const pa = positions.get(a);
        const pb = positions.get(b);
        if (!pa || !pb) return null;
        const mid = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2];
        return (
          <group key={i}>
            <Line points={[pa, pb]} color="#94a3b8" lineWidth={2} />
            {isDirected && <EdgeArrow from={pa} to={pb} />}
            {isWeighted && weight !== undefined && (
              <Text position={[mid[0], mid[1] + 0.28, mid[2]]} fontSize={0.26} color="#b45309" anchorX="center">
                {String(weight)}
              </Text>
            )}
          </group>
        );
      })}

      {nodes.map((id) => {
        const pos = positions.get(id);
        const isVisited = visited.includes(id);
        const isActive = activeNode === id;
        return (
          <group key={id} position={pos}>
            <mesh castShadow>
              <sphereGeometry args={[0.55, 32, 32]} />
              <meshStandardMaterial
                color={isActive ? "#f59e0b" : isVisited ? "#22c55e" : color}
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>
            <Text position={[0, 0, 0.6]} fontSize={0.36} color="white" anchorX="center" anchorY="middle">
              {String(id)}
            </Text>
          </group>
        );
      })}
    </Scene3D>
  );
}

export default GraphVisualizer;
