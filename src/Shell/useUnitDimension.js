export default function useUnitDimension({ unit, floorplan, profile }) {
  const x = unit.coordinates[0] * floorplan.width;
  const y = unit.coordinates[1] * floorplan.height;
  const rotate = unit.rotate;
  const width =
    (unit.customProfile?.length || profile.length) * floorplan.floorplan_ratio;
  const height =
    (unit.customProfile?.width || profile.width) * floorplan.floorplan_ratio;

  return { x, y, rotate, width, height };
}
