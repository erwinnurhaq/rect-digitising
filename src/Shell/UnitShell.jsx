import React from 'react';
import './style.css';
import useUnitDimension from './useUnitDimension';

export default function UnitShell({
  className,
  unit,
  profile,
  floorplan,
  ...props
}) {
  const { x, y, rotate, width, height } = useUnitDimension({
    unit,
    floorplan,
    profile,
  });
  const strokeWidth = (8 * (floorplan.floorplan_ratio || 100)) / 100;

  return (
    <g className={`unit-group ${className}`} {...props}>
      <rect
        className="unit__rect-border"
        x={x}
        y={y}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        transform={`rotate(${rotate} ${x} ${y})`}
      />
      <rect
        className="unit__rect-title-background"
        x={x}
        y={y}
        width={height / 2.2}
        height={height / 10}
        transform={`rotate(${rotate} ${x} ${y})`}
      />
      <text
        className="unit__rect-title"
        x={x + height / 25}
        y={y + height / 15}
        fontSize={height / 15}
        transform={`rotate(${rotate} ${x} ${y})`}
      >
        {unit.unit_floor_identifier} / TS{unit.ts_id}
      </text>
    </g>
  );
}
