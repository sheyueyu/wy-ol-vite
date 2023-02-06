import './style.css';
import Map from 'ol/Map.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';
import Draw from 'ol/interaction/Draw';

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

// 矢量源
const source = new VectorSource({
  format: new GeoJSON(),
  url:'./data/hubei.geojson'
})

// 用我们的矢量源创建一个新的layer，并将其添加到地图中
const layer = new VectorLayer({
    source:source,
});
map.addLayer(layer); //将图层加入到map中

map.addInteraction(
    new Draw({
      type:'Polygon', 
      source: source,
    })
  );

/**--------实现清除features功能------------------
 * 
 *      - vector source有一个source.clear()方法。
 *      - 我们希望点击Clear按钮就能调用source.clear()
 */
const clear = document.getElementById('clear');
// 给clear按钮添加一个监听器
clear.addEventListener('click',function(){
    source.clear();
});

/**-----------实现download功能
 * 
 * - 为了序列化(serialize)我们的feature data，我们将用GeoJSON格式
 * - 每次source中`change` 事件发生时，我们将序列化features，并为锚元素的`herf`属性构造一个数据URL
 */
const format = new GeoJSON({featureProjection:'EPSG:3857'});//`format`变量是一个Geojson对象
const download = document.getElementById('download');

//  - 给source绑定一个"change"事件处理器
//  - 当source发生变化时，"change"事件处理器会被触发，并将source中所有的要素写入GeoJSON
//  - 最后，下载链接设置为GeoJSON格式数据

source.on('change',function(){
   const features = source.getFeatures();//获取features中的所有要素；
   const json = format.writeFeatures(features) ; //format是一个GeoJSON对象，将要素写入GeoJSON
   download.href =
   'data:application/json;charset=utf-8,' + encodeURIComponent(json); 
});