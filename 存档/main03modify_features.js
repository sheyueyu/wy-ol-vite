import './style.css';
import Map from 'ol/Map.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';
import Modify from 'ol/interaction/Modify';
// 下面用于确定地图中心 center
const center = [114.1692, 30.494]; //EPSG:4326
const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:3857');
const view = new View({
  center: transformedCenter,
  zoom: 10
});

// 创建地图
const map = new Map({
    target: 'map',
    view: view
  });

// 1.矢量源
const source = new VectorSource({
  format: new GeoJSON(),
  url:'./data/hubei.geojson'
})

// 2. 用我们的矢量源创建一个新的layer，并将其添加到地图中
const layer = new VectorLayer({
    source:source,
});
map.addLayer(layer);

// 3. 创建一个连接到向量源的新交互，并将其添加到 map
map.addInteraction(
  new Modify({
    source: source,
  })
);
