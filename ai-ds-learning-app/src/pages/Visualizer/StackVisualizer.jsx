import { Text, RoundedBox } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function Block({ value, y, isTop, color }) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[2.2, 0.9, 1.6]} radius={0.1} smoothness={4} castShadow>
        <meshStandardMaterial color={isTop ? "#f59e0b" : color} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      <Text position={[0, 0, 0.82]} fontSize={0.36} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
      {isTop && (
        <Text position={[1.7, 0, 0.82]} fontSize={0.3} color="#dc2626" anchorX="center" anchorY="middle">
          ← TOP
        </Text>
      )}
    </group>
  );
}

// A node-and-pointer block for the linked-list-based stack, with a
// downward arrow connecting it to the node below (its "next").
function LinkedBlock({ value, y, isTop, color, hasNext }) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[1.9, 0.85, 1.5]} radius={0.1} smoothness={4} castShadow>
        <meshStandardMaterial color={isTop ? "#f59e0b" : color} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      <Text position={[0, 0, 0.78]} fontSize={0.34} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
      {isTop && (
        <Text position={[1.65, 0, 0.78]} fontSize={0.28} color="#dc2626" anchorX="center" anchorY="middle">
          ← TOP
        </Text>
      )}
      {hasNext && (
        <group position={[0, -0.65, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.35, 12]} />
            <meshStandardMaterial color="#4338ca" />
          </mesh>
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.11, 0.24, 12]} />
            <meshStandardMaterial color="#4338ca" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function StackVisualizer({ data = [], color = "#8b5cf6", variant = "arraystack" }) {
  const isLinked = variant === "linkedstack";
  const spacing = isLinked ? 1.15 : 1.05;
  const label = isLinked ? "Linked stack is empty — try Push" : "Stack is empty — try Push";

  return (
    <Scene3D cameraPosition={[6, 4, 8]}>
      {data.length === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.36} color="#8b5cf6" anchorX="center">
          {label}
        </Text>
      )}
      {data.map((value, i) =>
        isLinked ? (
          <LinkedBlock
            key={i}
            value={value}
            y={i * spacing}
            isTop={i === data.length - 1}
            color={color}
            hasNext={i > 0}
          />
        ) : (
          <Block key={i} value={value} y={i * spacing} isTop={i === data.length - 1} color={color} />
        )
      )}
      {isLinked && data.length > 0 && (
        <Text position={[0, -0.9, 0]} fontSize={0.24} color="#9ca3af" anchorX="center">
          NULL (bottom of stack)
        </Text>
      )}
    </Scene3D>
  );
}

export default StackVisualizer;
