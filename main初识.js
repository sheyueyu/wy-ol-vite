import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [30.4941, 114.1669],
    // projection: 'EPSG:3857',
    zoom: 1,
    // projection: 'EPSG:3857',//投影坐标系
    // 如果没有指定(如上面的代码片段) ，默认的投影是 SpherealMercator (EPSG: 3857) ，以米作为映射单位。
  }),
});
