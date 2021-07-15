import React from 'react';

export default function Form({
  selectedUnit,
  setSelectedUnit,
  onSave,
  onCancel,
}) {
  const formatCoordinate = (val) => parseFloat(parseFloat(val).toFixed(7));
  return (
    <React.Fragment>
      <input
        type="number"
        step="0.001"
        placeholder="x"
        value={selectedUnit.coordinates[0]}
        onChange={(e) =>
          setSelectedUnit({
            ...selectedUnit,
            coordinates: [
              formatCoordinate(e.target.value),
              selectedUnit.coordinates[1],
            ],
          })
        }
      />
      <input
        type="number"
        step="0.001"
        placeholder="y"
        value={selectedUnit.coordinates[1]}
        onChange={(e) =>
          setSelectedUnit({
            ...selectedUnit,
            coordinates: [
              selectedUnit.coordinates[0],
              formatCoordinate(e.target.value),
            ],
          })
        }
      />
      <input
        type="number"
        placeholder="rotate"
        value={selectedUnit.rotate}
        onChange={(e) =>
          setSelectedUnit({
            ...selectedUnit,
            rotate: parseFloat(e.target.value),
          })
        }
      />
      <button type="button" onClick={onSave}>
        SAVE
      </button>
      <button type="button" onClick={onCancel}>
        CANCEL
      </button>
    </React.Fragment>
  );
}
