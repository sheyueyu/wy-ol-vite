import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

// 创建地图
const center = [114.1692, 30.494]; //EPSG:4326
const view = new View({
  center: center, //EPSG:4326
   projection: 'EPSG:4326',
  zoom: 10
})
const map =new Map({
  target: 'map-container',
  view: view,
});

// 以天地图为底图——影像底图（地图瓦片获取）
let img_w_url = "http://t0.tianditu.gov.cn/img_w/wmts?" +
    "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
    "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=947c022b846143f75c000a5b566b266d";
let img_w = new TileLayer({
    source: new XYZ({
        url: img_w_url
    }) //
});
// ---------------------------------
// 矢量源
const sourceGeoJson = new VectorSource({
  format: new GeoJSON(),
  url:'./data/hubei.geojson'
});
// 根据矢量源构建图层  layerGeoJson
const layerGeoJson = new VectorLayer({
  source:sourceGeoJson,
});


map.addLayer(img_w); //底图
map.addLayer(layerGeoJson); //由geojson数据构建的图层
