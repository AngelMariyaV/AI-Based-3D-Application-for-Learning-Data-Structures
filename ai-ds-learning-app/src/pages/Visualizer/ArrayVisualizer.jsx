import { Text, RoundedBox } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function Cell({ value, index, x, highlighted, color }) {
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.12} smoothness={4} castShadow>
        <meshStandardMaterial
          color={highlighted ? "#f59e0b" : color}
          metalness={0.15}
          roughness={0.35}
        />
      </RoundedBox>
      <Text position={[0, 0, 0.72]} fontSize={0.42} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
      <Text position={[0, -1.05, 0]} fontSize={0.28} color="#4338ca" anchorX="center" anchorY="middle">
        {index}
      </Text>
    </group>
  );
}

function GhostCell({ x }) {
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.35} />
      </RoundedBox>
    </group>
  );
}

// Next power-of-two capacity >= size, minimum 4 (mirrors how ArrayList/vector grow).
function nextCapacity(size) {
  let cap = 4;
  while (cap < size) cap *= 2;
  return cap;
}

function ArrayVisualizer({ data = [], highlighted = [], color = "#6366f1", variant = "oned" }) {
  const isDynamic = variant === "dynamic";
  const capacity = isDynamic ? nextCapacity(Math.max(data.length, 1)) : data.length;
  const totalSlots = Math.max(capacity, data.length);

  const spacing = 1.8;
  const offset = ((totalSlots - 1) * spacing) / 2;

  return (
    <Scene3D cameraPosition={[0, 5, 9]}>
      {data.length === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.4} color="#6366f1" anchorX="center">
          Array is empty — try Insert
        </Text>
      )}
      {data.map((value, i) => (
        <Cell
          key={i}
          value={value}
          index={i}
          x={i * spacing - offset}
          highlighted={highlighted.includes(i)}
          color={color}
        />
      ))}
      {isDynamic &&
        Array.from({ length: totalSlots - data.length }, (_, i) => data.length + i).map((slot) => (
          <GhostCell key={slot} x={slot * spacing - offset} />
        ))}
      {isDynamic && data.length > 0 && (
        <Text position={[0, -2, 0]} fontSize={0.28} color="#94a3b8" anchorX="center">
          size {data.length} / capacity {capacity} — doubles when full
        </Text>
      )}
    </Scene3D>
  );
}

export default ArrayVisualizer;
