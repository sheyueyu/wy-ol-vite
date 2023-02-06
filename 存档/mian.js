import './style.css';
import Map from 'ol/Map.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';
import DragAndDrop from 'ol/interaction/DragAndDrop';

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
  
// 1. 创建一个没有初始数据的矢量源（vector source），这个矢量源将存储用户拖放到地图上的数据，不像之前是从远程位置去加载数据
const source = new VectorSource()

// 2. 用我们的空的矢量源创建一个新的layer，并将其添加到地图中
const layer = new VectorLayer({
    source:source,
});
map.addLayer(layer);

// 3. 最后，将创建一个 drag and drop interaction（拖放交互）
// 其中的配置为：和我们的矢量源一起工作，并将其添加到map中
map.addInteraction(
    new DragAndDrop({
      source: source,
      formatConstructors: [GeoJSON],
    })
  );
  

