import React from 'react';
import { select, selectAll } from 'd3-selection';
import { drag } from 'd3-drag';

import { mockUnits, defaultUnit, floorplan, profile } from './mocks';
import FloorplanViewer from './FloorplanViewer';
import UnitShell from './Shell/UnitShell';
import UnitDigitisingShell from './Shell/UnitDigitisingShell';
import isPolygonsIntersect from './utils/isPolygonIntersect';
import UnitForm from './UnitForm';

export default function App() {
  const [units, setUnits] = React.useState(mockUnits);
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  const [isDigitising, setIsDigitising] = React.useState(false);
  const [unitMoveValue, setUnitMoveValue] = React.useState('');
  const moveClickRef = React.useRef(null);

  function transformXY(x, y, rotation, baseX, baseY) {
    if (rotation === 0) return { x, y };

    const transformedX =
      (x - baseX) * Math.cos((rotation * Math.PI) / 180) -
      (y - baseY) * Math.sin((rotation * Math.PI) / 180);
    const transformedY =
      (x - baseX) * Math.sin((rotation * Math.PI) / 180) +
      (y - baseY) * Math.cos((rotation * Math.PI) / 180);

    return { x: baseX + transformedX, y: baseY + transformedY };
  }

  function getRotationValue(node) {
    const rotate = node.getAttribute('transform');
    return parseFloat(rotate.split(' ')[0].split('(')[1]);
  }

  function getUnitPolygon(node) {
    if (node.tagName === 'circle') {
      const x = parseFloat(node.getAttribute('cx'));
      const y = parseFloat(node.getAttribute('cy'));
      const transform = node
        .getAttribute('transform')
        .replace(/[\(\)]/g, ' ')
        .split(' ');
      const rotate = parseFloat(transform[1]);
      const baseX = parseFloat(transform[2]);
      const baseY = parseFloat(transform[3]);
      return [transformXY(x, y, rotate, baseX, baseY)];
    }

    const { x, y, width, height } = node.getBBox();
    const rotate = getRotationValue(node);
    const topLeft = { x, y };
    const topRight = transformXY(x + width, y, rotate, x, y);
    const bottomLeft = transformXY(x, y + height, rotate, x, y);
    const bottomRight = transformXY(x + width, y + height, rotate, x, y);

    return [topLeft, topRight, bottomRight, bottomLeft];
  }

  function checkCollision(node, otherNodesClass) {
    const collidedElement = [];

    selectAll(otherNodesClass).attr('data-touched', function () {
      if (this === node) return null;
      if (isPolygonsIntersect(getUnitPolygon(node), getUnitPolygon(this))) {
        collidedElement.push(this);
        return true;
      }
      return null;
    });

    return collidedElement;
  }

  const dragHandler = drag()
    .on('start', function () {
      select(this).attr('data-moved', true);
      clearUnitMoveForm();
    })
    .on('drag', function (event) {
      const x = parseFloat(this.getAttribute('x'));
      const y = parseFloat(this.getAttribute('y'));
      const rotate = getRotationValue(this);
      this.setAttribute('x', x + event.dx);
      this.setAttribute('y', y + event.dy);

      if (checkCollision(this, '.unit__rect-border').length > 0) {
        this.setAttribute('x', x);
        this.setAttribute('y', y);
        setCoordinates(x, y, rotate);
      } else {
        setCoordinates(x + event.dx, y + event.dy, rotate);
      }
    })
    .on('end', function () {
      select(this).attr('data-moved', null);
      const node = this;
      let collidedNode = null;
      let direction = '';
      selectAll('.unit-rect-digitising-arrow').each(function () {
        const collided = checkCollision(this, '.unit__rect-border');
        if (collided.length > 0) {
          collidedNode = collided[0];
          direction = this.getAttribute('data-snapdirection');
        }
      });
      snapToUnit(node, collidedNode, direction);
    });

  function setCoordinates(x, y, rotate) {
    setSelectedUnit((prev) => ({
      ...prev,
      rotate,
      coordinates: [
        parseFloat((x / floorplan.width).toFixed(7)),
        parseFloat((y / floorplan.height).toFixed(7)),
      ],
    }));
  }

  function getSnapMoveValue(rectNode, targetRectNode, direction) {
    switch (direction) {
      case 'top':
        return parseFloat(rectNode.getAttribute('height'));
      case 'right':
        return parseFloat(targetRectNode.getAttribute('width'));
      case 'bottom':
        return parseFloat(targetRectNode.getAttribute('height'));
      case 'left':
        return parseFloat(rectNode.getAttribute('width'));
      default:
        return 0;
    }
  }

  function snapToUnit(rectNode, targetRectNode, direction) {
    if (!targetRectNode) return;
    const moveValue = getSnapMoveValue(rectNode, targetRectNode, direction);
    const rotate = getRotationValue(targetRectNode);
    const { x, y } = getMovedCoordinates(moveValue, {
      direction,
      x: parseFloat(targetRectNode.getAttribute('x')),
      y: parseFloat(targetRectNode.getAttribute('y')),
      rotate,
    });
    setCoordinates(x, y, rotate);
  }

  function onEditClick(unit) {
    setSelectedUnit(unit);
    setIsDigitising(true);
  }

  function onAddClick() {
    setSelectedUnit(defaultUnit());
    setIsDigitising(true);
  }

  function onCancelClick() {
    setSelectedUnit(null);
    setIsDigitising(false);
  }

  function onSaveClick() {
    const isExist = units.find((unit) => unit.id === selectedUnit?.id);
    if (isExist) {
      setUnits(
        units.map((unit) =>
          unit.id === selectedUnit?.id ? selectedUnit : unit
        )
      );
    } else {
      setUnits([...units, selectedUnit]);
    }
    onCancelClick();
  }

  function onSVGClick(e, coordinates) {
    if (!isDigitising) return;
    if (!e.target.classList.contains('floorplan-image')) return;
    setCoordinates(...coordinates, selectedUnit?.rotate);
    clearUnitMoveForm();
  }

  function showUnitTooltips(e, unitData) {
    select(e.currentTarget).on('mousemove', (moveEvent) => {
      select('#unit-tooltip')
        .style('opacity', 1)
        .style('top', `${moveEvent.clientY}px`)
        .style('left', `${moveEvent.clientX}px`)
        .html(
          `<b>Unit</b><br/>${unitData.unit_floor_identifier}/TS${unitData.ts_id}`
        );
    });
  }

  function hideUnitTooltips(e) {
    select('#unit-tooltip').style('opacity', 0);
    select(e.currentTarget).on('mousemove', null);
  }

  function getMovedCoordinates(value, { direction, x, y, rotate }) {
    switch (direction) {
      case 'top':
        return transformXY(x, y - value, rotate, x, y);
      case 'right':
        return transformXY(x + value, y, rotate, x, y);
      case 'bottom':
        return transformXY(x, y + value, rotate, x, y);
      case 'left':
        return transformXY(x - value, y, rotate, x, y);
      default:
        return;
    }
  }

  function onUnitMoveApply() {
    const moveValue = unitMoveValue * floorplan.floorplan_ratio;
    const { x, y } = getMovedCoordinates(moveValue, moveClickRef.current);
    setCoordinates(x, y, moveClickRef.current.rotate);
    clearUnitMoveForm();
  }

  function onUnitMoveArrowClick(e, unitMoveProp) {
    moveClickRef.current = unitMoveProp;
    select('#unit-move-form')
      .style('opacity', 1)
      .style('pointer-events', 'all')
      .style('top', `${e.clientY - 20}px`)
      .style('left', `${e.clientX + 10}px`);
  }

  function clearUnitMoveForm() {
    select('#unit-move-form')
      .style('opacity', 0)
      .style('pointer-events', 'none');
    moveClickRef.current = null;
    setUnitMoveValue('');
  }

  React.useEffect(() => {
    if (isDigitising) {
      select('.unit__rect-digitising-selected').call(dragHandler);
    } else {
      select('.unit__rect-digitising-selected')
        .on('mousedown.start', null)
        .on('mousedown.drag', null)
        .on('mousedown.end', null);
      selectAll('.unit__rect-border').attr('data-touched', null);
    }
  }, [isDigitising]); // eslint-disable-line

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '100%', height: '70vh', padding: '40px' }}>
        <div id="unit-tooltip" />
        <div id="unit-move-form">
          <input
            type="number"
            value={unitMoveValue}
            onChange={(e) => setUnitMoveValue(e.target.value)}
          />
          <button type="button" onClick={onUnitMoveApply}>
            Apply
          </button>
          <button type="button" onClick={clearUnitMoveForm}>
            Cancel
          </button>
        </div>
        <FloorplanViewer
          floorplan={floorplan}
          onSVGClick={onSVGClick}
          onSVGClickDeps={[isDigitising, selectedUnit]}
        >
          {units
            .filter((unit) => unit.id !== selectedUnit?.id)
            .map((unit) => (
              <UnitShell
                key={unit.id}
                className={''}
                unit={unit}
                profile={profile}
                floorplan={floorplan}
                onMouseEnter={(e) => showUnitTooltips(e, unit)}
                onMouseLeave={hideUnitTooltips}
              />
            ))}
          {isDigitising && (
            <UnitDigitisingShell
              unit={selectedUnit}
              profile={profile}
              floorplan={floorplan}
              onMoveArrowClick={onUnitMoveArrowClick}
              isSelected
            />
          )}
        </FloorplanViewer>
      </div>
      <div style={{ marginBottom: '20px' }}>
        {isDigitising ? (
          <UnitForm
            profile={profile}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
            onSave={onSaveClick}
            onCancel={onCancelClick}
          />
        ) : (
          <button type="button" onClick={onAddClick}>
            ADD
          </button>
        )}
      </div>
      <ul>
        {units.map((unit) => (
          <li key={unit.id}>
            <span>UNIT {unit.unit_floor_identifier} </span>
            <button type="button" onClick={() => onEditClick(unit)}>
              EDIT
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
