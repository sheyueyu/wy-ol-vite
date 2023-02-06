import './style.css';
import Map from 'ol/Map.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';

const center = [114.1692, 30.494]; //EPSG:4326
const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:3857');

const view = new View({
  center: transformedCenter,
  zoom: 10
});

const map = new Map({
  target: 'map',
  layers: [
    new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            url:'./data/hubei.geojson'
        })
    })
  ],
  view: view
});
