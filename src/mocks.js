import Image from './image.png';

export const floorplan = {
  floorplan_url: Image,
  floorplan_ratio: 50,
  width: 2100,
  height: 1800,
};

export const profile = {
  floor_id: 63,
  width: 3,
  length: 4,
  height: 2.7,
};

export const mockUnits = [
  {
    id: 4,
    floor_id: 63,
    unit_floor_identifier: 3,
    rotate: 45,
    remark: 'Unit 3',
    coordinates: [0.7305194, 0.7762547],
    mac_address: '24:6F:28:3F:C7:D0',
    ts_id: 29,
    version: '1.0',
    zone: 'Curie',
  },
  {
    id: 5,
    floor_id: 63,
    unit_floor_identifier: 4,
    rotate: 0,
    remark: '',
    coordinates: [0.8257575, 0.7762547],
    mac_address: '84:0D:8E:D0:AB:54',
    ts_id: 64,
    version: '1.0',
    zone: 'Curie',
  },
];

export const defaultUnit = () => ({
  id: Math.floor(Math.random() * 100),
  floor_id: 63,
  unit_floor_identifier: Math.floor(Math.random() * 100),
  rotate: 0,
  remark: '',
  coordinates: [0, 0],
  mac_address: '',
  ts_id: Math.floor(Math.random() * 100),
  version: '',
  zone: '',
});
