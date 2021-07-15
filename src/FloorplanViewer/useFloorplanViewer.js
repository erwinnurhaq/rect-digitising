import React from 'react';
import { select, pointer } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';

export default function useFloorplanViewer({
  uniqueId,
  floorplan,
  onSVGClick,
  onSVGClickDeps,
}) {
  const SVGREF = React.useRef(null);
  const D3SVGREF = React.useRef(null);
  const D3ZOOMREF = React.useRef(null);
  const identifier = uniqueId ? `__${uniqueId}` : '';

  function zoomIn() {
    D3SVGREF.current
      .transition()
      .duration(750)
      .call(D3ZOOMREF.current.scaleBy, 2);
  }

  function zoomOut() {
    D3SVGREF.current.transition().call(D3ZOOMREF.current.scaleBy, 0.5);
  }

  function resetView() {
    D3SVGREF.current
      .transition()
      .call(D3ZOOMREF.current.transform, zoomIdentity);
  }

  React.useEffect(() => {
    D3SVGREF.current = select(SVGREF.current);
    D3ZOOMREF.current = zoom()
      .scaleExtent([1, 7])
      .on('zoom', ({ transform }) => {
        D3SVGREF.current
          .select(`.floorplan-svg-group${identifier}`)
          .attr(
            'transform',
            `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
          );
      });
    D3SVGREF.current
      .call(D3ZOOMREF.current)
      .on('wheel.zoom', null)
      .on('dblclick.zoom', null);
  }, [floorplan]); // eslint-disable-line

  React.useEffect(() => {
    D3SVGREF.current
      .select(`.floorplan-svg-group${identifier}`)
      .on('click', (e) => onSVGClick(e, pointer(e)));
  }, [floorplan, ...onSVGClickDeps]); // eslint-disable-line

  return { identifier, SVGREF, zoomIn, zoomOut, resetView };
}
