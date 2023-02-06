import './style.css';
import Map from 'ol/Map.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';
import Draw from 'ol/interaction/Draw';
import {Style,Fill,Stroke} from 'ol/style';
import { returnOrUpdate } from 'ol/extent';

// 下面用于确定地图中心 center
const center = [114.1692, 30.494]; //EPSG:4326
const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:3857');
const view = new View({
  center: transformedCenter,
  zoom: 5
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


const style1 = new Style({
    fill: new Fill({color: 'red'}),
    stroke: new Stroke({
            color:'black'
        })
  });
const style2 = new Style({
    fill: new Fill({color: 'green'}),
    stroke: new Stroke({
        color:'black'
    })
  });
  
const layer = new VectorLayer({
    source:source,
    // 根据feature的属性去设置feature的样式
    style:function(feature,resolution){
        // TODO:根据feature的name去设置feature的样式，如果feature的name = "武汉市"，则显示为红色
        const name  = feature.get('name');//获取feature的name
        if(name ==='武汉市'){
            return style1;
        }else{
            return style2;
        }
    }
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
source.on('change',function(){
   const features = source.getFeatures();//获取features中的所有要素；
   const json = format.writeFeatures(features) ; //format是一个GeoJSON对象，将要素写入GeoJSON
   download.href =
   'data:application/json;charset=utf-8,' + encodeURIComponent(json); 
});