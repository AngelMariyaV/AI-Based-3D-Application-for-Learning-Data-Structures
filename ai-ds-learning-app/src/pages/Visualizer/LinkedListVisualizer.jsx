import { Text, RoundedBox, Line } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function Node({ value, x, isHead, isTail, color }) {
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[1.6, 1.2, 1.2]} radius={0.12} smoothness={4} castShadow>
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      <Text position={[0, 0, 0.62]} fontSize={0.38} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
      {isHead && (
        <Text position={[0, 1.15, 0]} fontSize={0.28} color="#059669" anchorX="center">
          HEAD
        </Text>
      )}
      {isTail && (
        <Text position={[0, -1.15, 0]} fontSize={0.26} color="#dc2626" anchorX="center">
          TAIL
        </Text>
      )}
    </group>
  );
}

// Forward arrow, pointing from left node to right node.
function ForwardArrow({ x, y = 0 }) {
  return (
    <group position={[x, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <mesh position={[-0.15, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#4338ca" />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <coneGeometry args={[0.13, 0.28, 12]} />
        <meshStandardMaterial color="#4338ca" />
      </mesh>
    </group>
  );
}

// Backward arrow (for doubly linked lists), pointing from right node to left node.
function BackwardArrow({ x, y = 0 }) {
  return (
    <group position={[x, y, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh position={[-0.15, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <coneGeometry args={[0.13, 0.28, 12]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

// Curved arc connecting the last node back to the head, for circular variants.
function LoopArrow({ fromX, toX, y = -1.9, color = "#4338ca" }) {
  const points = [];
  const segments = 24;
  const dip = -1.1;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = fromX + (toX - fromX) * t;
    const arc = Math.sin(t * Math.PI) * dip;
    points.push([x, y + arc, 0]);
  }
  return (
    <group>
      <Line points={points} color={color} lineWidth={2.5} />
      <mesh position={[toX, y, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.14, 0.3, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[(fromX + toX) / 2, y + dip - 0.35, 0]} fontSize={0.24} color={color} anchorX="center">
        loops back to head
      </Text>
    </group>
  );
}

function LinkedListVisualizer({ data = [], color = "#f59e0b", variant = "singly" }) {
  const isDoubly = variant === "doubly" || variant === "circulardoubly";
  const isCircular = variant === "circularsingly" || variant === "circulardoubly";

  const spacing = 2.3;
  const offset = ((data.length - 1) * spacing) / 2;
  const posX = (i) => i * spacing - offset;

  return (
    <Scene3D cameraPosition={[0, 5, 11]}>
      {data.length === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.4} color="#f59e0b" anchorX="center">
          List is empty — try Insert
        </Text>
      )}

      {data.map((value, i) => (
        <Node
          key={i}
          value={value}
          x={posX(i)}
          isHead={i === 0}
          isTail={isDoubly && i === data.length - 1 && data.length > 1}
          color={color}
        />
      ))}

      {data.map((_, i) =>
        i < data.length - 1 ? (
          <group key={`fwd-${i}`}>
            <ForwardArrow x={posX(i) + spacing / 2} y={isDoubly ? 0.22 : 0} />
            {isDoubly && <BackwardArrow x={posX(i) + spacing / 2} y={-0.22} />}
          </group>
        ) : null
      )}

      {data.length > 0 && !isCircular && (
        <Text position={[posX(data.length), 0, 0]} fontSize={0.34} color="#9ca3af" anchorX="center">
          NULL
        </Text>
      )}
      {data.length > 0 && isDoubly && !isCircular && (
        <Text position={[posX(0) - spacing, 0, 0]} fontSize={0.34} color="#9ca3af" anchorX="center">
          NULL
        </Text>
      )}

      {isCircular && data.length > 1 && (
        <LoopArrow fromX={posX(data.length - 1)} toX={posX(0)} y={-1.9} color="#4338ca" />
      )}
      {isCircular && isDoubly && data.length > 1 && (
        <LoopArrow fromX={posX(0)} toX={posX(data.length - 1)} y={1.9} color="#f59e0b" />
      )}
      {isCircular && data.length === 1 && (
        <Text position={[posX(0), -1.7, 0]} fontSize={0.26} color="#4338ca" anchorX="center">
          points to itself
        </Text>
      )}
    </Scene3D>
  );
}

export default LinkedListVisualizer;
