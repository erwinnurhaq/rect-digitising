import React from 'react';
import './style.css';
import useUnitDimension from './useUnitDimension';

export default function UnitDigitisingShell({
  unit,
  profile,
  floorplan,
  isSelected,
}) {
  const { x, y, rotation, width, height } = useUnitDimension({
    unit,
    floorplan,
    profile,
  });
  const strokeWidth =
    ((isSelected ? 16 : 8) * (floorplan.floorplan_ratio || 100)) / 100;

  return (
    <rect
      className={`unit__rect-digitising ${
        isSelected ? 'unit__rect-digitising-selected' : ''
      }`}
      x={x}
      y={y}
      transform={`rotate(${rotation})`}
      width={width}
      height={height}
      strokeWidth={strokeWidth}
    />
  );
}
