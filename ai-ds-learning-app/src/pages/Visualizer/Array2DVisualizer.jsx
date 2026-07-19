import { Text, RoundedBox } from "@react-three/drei";
import Scene3D from "../../components/Scene3D/Scene3D";

function Cell2D({ value, x, z, color }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[1.2, 1.1, 1.2]} radius={0.1} smoothness={4} castShadow>
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      <Text position={[0, 0, 0.62]} fontSize={0.36} color="white" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
    </group>
  );
}

function Array2DVisualizer({ grid = [], color = "#6366f1" }) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const spacing = 1.55;
  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetZ = ((rows - 1) * spacing) / 2;

  return (
    <Scene3D cameraPosition={[0, 8, 9]}>
      {rows === 0 && (
        <Text position={[0, 0.3, 0]} fontSize={0.4} color="#6366f1" anchorX="center">
          Matrix is empty — try Add Row
        </Text>
      )}
      {grid.map((row, r) =>
        row.map((value, c) => (
          <Cell2D
            key={`${r}-${c}`}
            value={value}
            x={c * spacing - offsetX}
            z={r * spacing - offsetZ}
            color={color}
          />
        ))
      )}
      {rows > 0 && (
        <>
          <Text position={[0, -1.3, offsetZ + 1]} fontSize={0.26} color="#94a3b8" anchorX="center">
            {rows} rows × {cols} cols
          </Text>
        </>
      )}
    </Scene3D>
  );
}

export default Array2DVisualizer;
