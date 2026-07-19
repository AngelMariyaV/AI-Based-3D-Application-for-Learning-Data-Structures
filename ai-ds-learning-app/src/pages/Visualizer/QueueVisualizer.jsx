import { Text, RoundedBox } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function Cell({ value, x, y = 0, z = 0, rotationY = 0, isFront, isRear, tag, color }) {
  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.12} smoothness={4} castShadow>
        <meshStandardMaterial color={isFront || isRear ? "#f59e0b" : color} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      <Text position={[0, 0, 0.72]} fontSize={0.42} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
      {tag && (
        <Text position={[0, -1.05, 0.72]} fontSize={0.24} color="#4338ca" anchorX="center" anchorY="middle">
          {tag}
        </Text>
      )}
      {isFront && (
        <Text position={[0, 1.1, 0]} fontSize={0.28} color="#059669" anchorX="center">
          FRONT
        </Text>
      )}
      {isRear && (
        <Text position={[0, tag ? -1.35 : -1.1, 0]} fontSize={0.28} color="#dc2626" anchorX="center">
          REAR
        </Text>
      )}
    </group>
  );
}

function GhostSlot({ x, y = 0 }) {
  return (
    <group position={[x, y, 0]}>
      <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.35} />
      </RoundedBox>
    </group>
  );
}

function SimpleQueue({ data, color }) {
  const spacing = 1.8;
  const offset = ((data.length - 1) * spacing) / 2;
  return (
    <>
      {data.map((value, i) => (
        <Cell
          key={i}
          value={value}
          x={i * spacing - offset}
          isFront={i === 0 && data.length > 0}
          isRear={i === data.length - 1 && data.length > 1}
          color={color}
        />
      ))}
    </>
  );
}

function DequeQueue({ data, color }) {
  const spacing = 1.8;
  const offset = ((data.length - 1) * spacing) / 2;
  return (
    <>
      {data.map((value, i) => (
        <Cell
          key={i}
          value={value}
          x={i * spacing - offset}
          isFront={i === 0}
          isRear={i === data.length - 1 && data.length > 1}
          color={color}
        />
      ))}
    </>
  );
}

function PriorityQueue({ data, color }) {
  // data is kept sorted ascending by the page — lower number = higher priority.
  const spacing = 1.8;
  const offset = ((data.length - 1) * spacing) / 2;
  return (
    <>
      {data.map((value, i) => (
        <Cell
          key={i}
          value={value}
          x={i * spacing - offset}
          isFront={i === 0}
          tag={`priority ${value}`}
          color={color}
        />
      ))}
    </>
  );
}

function CircularQueue({ data, color, capacity = 6 }) {
  const radius = 2.6;
  const slots = Array.from({ length: capacity }, (_, i) => i);
  return (
    <>
      {slots.map((i) => {
        const angle = (i / capacity) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const filled = i < data.length;
        if (!filled) {
          return <GhostSlot key={i} x={x} y={0} />;
        }
        return (
          <group key={i} position={[x, 0, z]}>
            <Cell
              value={data[i]}
              x={0}
              isFront={i === 0}
              isRear={i === data.length - 1 && data.length > 1}
              color={color}
            />
          </group>
        );
      })}
      <Text position={[0, -2.1, 0]} fontSize={0.26} color="#94a3b8" anchorX="center">
        capacity {data.length}/{capacity} — wraps around when full
      </Text>
    </>
  );
}

function QueueVisualizer({ data = [], color = "#0ea5e9", variant = "simple" }) {
  const emptyLabel =
    variant === "circular"
      ? "Circular queue is empty — try Enqueue"
      : variant === "deque"
      ? "Deque is empty — try Push Front/Back"
      : variant === "priority"
      ? "Priority queue is empty — try Insert"
      : "Queue is empty — try Enqueue";

  return (
    <Scene3D cameraPosition={variant === "circular" ? [0, 6, 8] : [0, 5, 9]}>
      {data.length === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.36} color="#0ea5e9" anchorX="center">
          {emptyLabel}
        </Text>
      )}
      {variant === "circular" && <CircularQueue data={data} color={color} />}
      {variant === "deque" && <DequeQueue data={data} color={color} />}
      {variant === "priority" && <PriorityQueue data={data} color={color} />}
      {(variant === "simple" || !variant) && <SimpleQueue data={data} color={color} />}
    </Scene3D>
  );
}

export default QueueVisualizer;
