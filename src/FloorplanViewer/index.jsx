import React from 'react';
import './style.css';
import useFloorplanViewer from './useFloorplanViewer';

const defaultFloorplan = {
  floorplan_url: '',
  width: 100,
  height: 100,
};

export default function FloorplanViewer(props) {
  const { floorplan = defaultFloorplan, children, ...prop } = props;
  const { identifier, SVGREF, zoomIn, zoomOut, resetView } = useFloorplanViewer(
    { floorplan, ...prop }
  );

  return (
    <div
      data-testid="floorplan-viewer__container"
      className={`floorplan-viewer__container ${identifier}`}
    >
      <svg
        ref={SVGREF}
        className={`floorplan-svg${identifier}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${floorplan?.width || 100} ${floorplan?.height || 100}`}
      >
        <g
          className={`floorplan-svg-group${identifier}`}
          transform="translate(0,0) scale(1)"
        >
          <image
            className={`floorplan-image${identifier}`}
            xlinkHref={floorplan?.floorplan_url || ''}
            width={floorplan?.width || 100}
            height={floorplan?.height || 100}
          />
          {children}
        </g>
      </svg>
      <div
        id="button-zoom-container"
        className="floorplan-viewer__button-zoom-container"
      >
        <div
          role="button"
          className={`zoom-button zoom-in${identifier}`}
          onClick={zoomIn}
        >
          <i className="zoom-in icon" />
        </div>
        <div
          role="button"
          className={`zoom-button zoom-out${identifier}`}
          onClick={zoomOut}
        >
          <i className="zoom-out icon" />
        </div>
        <div
          role="button"
          className={`zoom-button reset-view${identifier}`}
          onClick={resetView}
        >
          <i className="expand icon" />
        </div>
      </div>
    </div>
  );
}
