import React from 'react';
import './style.css';
import useUnitDimension from './useUnitDimension';

export default function UnitDigitisingShell({
  unit,
  profile,
  floorplan,
  isSelected,
  onMoveArrowClick,
}) {
  const unitDimension = useUnitDimension({ unit, floorplan, profile });
  const { x, y, rotate, width, height } = unitDimension;
  const strokeWidth =
    ((isSelected ? 16 : 8) * (floorplan.floorplan_ratio || 100)) / 100;

  const onCircleClick = (e, direction) =>
    onMoveArrowClick(e, { direction, x, y, rotate });

  return (
    <g>
      <rect
        className={`unit__rect-digitising ${
          isSelected ? 'unit__rect-digitising-selected' : ''
        }`}
        x={x}
        y={y}
        transform={`rotate(${rotate} ${x} ${y})`}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
      />
      <circle
        className="unit-rect-digitising-arrow"
        r={5}
        cx={x + width / 2}
        cy={y - height / 10}
        transform={`rotate(${rotate} ${x} ${y})`}
        onClick={(e) => onCircleClick(e, 'top')}
      />
      <circle
        className="unit-rect-digitising-arrow"
        r={5}
        cx={x + width + height / 10}
        cy={y + height / 2}
        transform={`rotate(${rotate} ${x} ${y})`}
        onClick={(e) => onCircleClick(e, 'right')}
      />
      <circle
        className="unit-rect-digitising-arrow"
        r={5}
        cx={x + width / 2}
        cy={y + height + height / 10}
        transform={`rotate(${rotate} ${x} ${y})`}
        onClick={(e) => onCircleClick(e, 'bottom')}
      />
      <circle
        className="unit-rect-digitising-arrow"
        r={5}
        cx={x - height / 10}
        cy={y + height / 2}
        transform={`rotate(${rotate} ${x} ${y})`}
        onClick={(e) => onCircleClick(e, 'left')}
      />
    </g>
  );
}
