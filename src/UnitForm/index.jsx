import React from 'react';

export default function Form({
  profile,
  selectedUnit,
  setSelectedUnit,
  onSave,
  onCancel,
}) {
  const [isCustomProfiled, setIsCustomProfiled] = React.useState(
    selectedUnit.customProfile !== null ? true : false
  );
  const customProfileRef = React.useRef(selectedUnit.customProfile);

  function formatCoordinate(val) {
    return parseFloat(parseFloat(val).toFixed(7));
  }

  function onToggleCustomProfile(e) {
    setSelectedUnit({
      ...selectedUnit,
      customProfile: e.target.checked
        ? customProfileRef.current || profile
        : customProfileRef.current,
    });
    setIsCustomProfiled(e.target.checked);
  }

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <label htmlFor="setCustomProfile">Custom Unit Profile </label>
        <input
          type="checkbox"
          id="setCustomProfile"
          name="setCustomProfile"
          checked={isCustomProfiled}
          onChange={onToggleCustomProfile}
        />
        <input
          type="number"
          step="0.1"
          min={0}
          placeholder="width"
          value={selectedUnit.customProfile?.width || ''}
          disabled={!isCustomProfiled}
          onChange={(e) =>
            setSelectedUnit({
              ...selectedUnit,
              customProfile: {
                ...selectedUnit.customProfile,
                width: Math.abs(parseFloat(e.target.value)),
              },
            })
          }
        />
        <input
          type="number"
          step="0.1"
          min={0}
          placeholder="length"
          value={selectedUnit.customProfile?.length || ''}
          disabled={!isCustomProfiled}
          onChange={(e) =>
            setSelectedUnit({
              ...selectedUnit,
              customProfile: {
                ...selectedUnit.customProfile,
                length: Math.abs(parseFloat(e.target.value)),
              },
            })
          }
        />
        <input
          type="number"
          step="0.1"
          min={0}
          placeholder="height"
          value={selectedUnit.customProfile?.height || ''}
          disabled={!isCustomProfiled}
          onChange={(e) =>
            setSelectedUnit({
              ...selectedUnit,
              customProfile: {
                ...selectedUnit.customProfile,
                height: Math.abs(parseFloat(e.target.value)),
              },
            })
          }
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" onClick={onSave}>
          SAVE
        </button>
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </React.Fragment>
  );
}
