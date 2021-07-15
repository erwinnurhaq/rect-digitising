export default function useUnitDimension({ unit, floorplan, profile }) {
  const x = unit.coordinates[0] * floorplan.width;
  const y = unit.coordinates[1] * floorplan.height;
  const rotation = `${unit.rotate} ${x} ${y}`;
  const width = (unit.length || profile.length) * floorplan.floorplan_ratio;
  const height = (unit.width || profile.width) * floorplan.floorplan_ratio;

  return { x, y, rotation, width, height };
}
