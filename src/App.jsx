import React from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { mockUnits, defaultUnit, floorplan, profile } from './mocks';
import FloorplanViewer from './FloorplanViewer';
import UnitShell from './Shell/UnitShell';
import UnitDigitisingShell from './Shell/UnitDigitisingShell';
import UnitForm from './UnitForm';

export default function App() {
  const [units, setUnits] = React.useState(mockUnits);
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  const [isDigitising, setIsDigitising] = React.useState(false);

  const dragHandler = drag()
    .on('start', function () {
      select(this).attr('data-moved', 'moved');
    })
    .on('drag', function (event) {
      const x = parseFloat(this.getAttribute('x'));
      const y = parseFloat(this.getAttribute('y'));
      const rotate = parseFloat(
        this.getAttribute('transform').split(' ')[0].split('(')[1]
      );
      setCoordinates(x + event.dx, y + event.dy, rotate);
    })
    .on('end', function () {
      select(this).attr('data-moved', null);
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
    setCoordinates(...coordinates, selectedUnit?.rotate);
  }

  React.useEffect(() => {
    if (selectedUnit) {
      select('.unit__rect-digitising-selected').call(dragHandler);
    } else {
      select('.unit__rect-digitising-selected')
        .on('mousedown.start', null)
        .on('mousedown.drag', null)
        .on('mousedown.end', null);
    }
  }, [selectedUnit]); // eslint-disable-line

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '100%', height: '70vh', padding: '40px' }}>
        <FloorplanViewer
          floorplan={floorplan}
          onSVGClick={onSVGClick}
          onSVGClickDeps={[isDigitising]}
        >
          {isDigitising ? (
            <React.Fragment>
              {units
                .filter((unit) => unit.id !== selectedUnit?.id)
                .map((unit) => (
                  <UnitDigitisingShell
                    key={unit.id}
                    unit={unit}
                    profile={profile}
                    floorplan={floorplan}
                  />
                ))}
              <UnitDigitisingShell
                unit={selectedUnit}
                profile={profile}
                floorplan={floorplan}
                isSelected
              />
            </React.Fragment>
          ) : (
            units.map((unit) => (
              <UnitShell
                key={unit.id}
                className={''}
                unit={unit}
                profile={profile}
                floorplan={floorplan}
              />
            ))
          )}
        </FloorplanViewer>
      </div>
      <div style={{ marginBottom: '20px' }}>
        {isDigitising ? (
          <UnitForm
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
