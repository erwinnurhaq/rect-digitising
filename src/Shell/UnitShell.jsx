import React from 'react';
import './style.css';
import useUnitDimension from './useUnitDimension';

export default function UnitShell({ className, unit, profile, floorplan }) {
  const { x, y, rotation, width, height } = useUnitDimension({
    unit,
    floorplan,
    profile,
  });
  const strokeWidth = (8 * (floorplan.floorplan_ratio || 100)) / 100;

  return (
    <g className={`unit-group ${className}`} transform={`rotate(${rotation})`}>
      <rect
        className="unit__rect-border"
        x={x}
        y={y}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
      />
      <rect
        className="unit__rect-title-background"
        x={x}
        y={y}
        width={height / 2.2}
        height={height / 10}
      />
      <text
        className="unit__rect-title"
        x={x + height / 25}
        y={y + height / 15}
        fontSize={height / 15}
      >
        {unit.unit_floor_identifier} / TS{unit.ts_id}
      </text>
    </g>
  );
}
