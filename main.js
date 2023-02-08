import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Style, Fill, Stroke} from 'ol/style';
import './style.css';
import {Draw, Modify}from 'ol/interaction';
// 创建地图
const center = [114.1692, 30.494]; //EPSG:4326
const view = new View({
  center: center, //EPSG:4326
   projection: 'EPSG:4326',
  zoom: 13
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
  // url:'./data/hubei.geojson'
  url:'./data/new_parcels2023-02-07.geojson'
});
// 根据矢量源构建图层  layerGeoJson,并根据不同的parcel_type设置不同的颜色

let arrColor = ["#FFFF00", "#0000FF", "#DC143C","#800000","#40E0D0","#708090","#FFC0CB" ,"#FFFFFF"]
const boundaryColor = 'rgba(252, 249, 242)' //设置边界颜色
const style1 = new Style({
  fill: new Fill({
    color: arrColor[0]
  }),
  stroke: new Stroke({
          color:boundaryColor
      })
});
const style2 = new Style({
  fill:new Fill({
    color: arrColor[1]
  }),
  stroke: new Stroke({
    color:boundaryColor
})
});
const style3 = new Style({
  fill:new Fill({
    color:arrColor[2]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});
const style4 = new Style({
  fill:new Fill({
    color:arrColor[3]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});
const style5 = new Style({
  fill:new Fill({
    color:arrColor[4]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});
const style6 = new Style({
  fill:new Fill({
    color:arrColor[5]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});
const style7 = new Style({
  fill:new Fill({
    color:arrColor[6]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});
const style8 = new Style({
  fill:new Fill({
    color:arrColor[7]
  }),
  stroke: new Stroke({
  color:boundaryColor
})
});



const layerGeoJson = new VectorLayer({
  source:sourceGeoJson,
  style : function(feature,resolution){
    // TODO:根据feature中的parcel_type属性去设置feature的样式
    const parcelType = feature.get('parcel_type')
    if(parcelType===1){
      return style1;
    }else if(parcelType===2){
      return style2;
    }else if(parcelType===3){
      return style3;
    }else if(parcelType===4){
      return style4;
    }else if(parcelType===5){
      return style5;
    }else if(parcelType===6){
      return style6;
    }else if(parcelType===7){
      return style7;
    }else {
      return style8;
    }
  },
  opacity :0.7
});


map.addLayer(img_w); //底图
map.addLayer(layerGeoJson); //由geojson数据构建的图层


//  ------实现，editor --------
let clickCount = 0;
let modifyInteraction;
const eiditor = document.getElementById("editor") ;
// 绑定事件,点击按钮后，就能开始编辑
eiditor.addEventListener('click',function(){
  clickCount++;
  if (clickCount % 2 === 1){
    eiditor.innerText = "退出编辑";
    modifyInteraction = new Modify({
        source:sourceGeoJson,//修改的是传入的Geojson数据；
      });
    map.addInteraction(modifyInteraction);
  }else{
    eiditor.innerText = "编辑";
    map.removeInteraction(modifyInteraction);
  }
  
})

// 实现，add polygon的功能
//  ------实现，当点击按钮Editor时能触发编辑功能
// let 
const addPolygon = document.getElementById("addPolygon") ;
// 绑定事件,点击按钮后，就能开始编辑
addPolygon.addEventListener('click',function(){
  // 增加一个交互功能
  map.addInteraction(
    new Draw({
      type:"Polygon",
      source:sourceGeoJson,//修改的是传入的Geojson数据；
    })
  )
})


// clear 功能
/**--------实现清除features功能------------------
 * 
 *      - vector source有一个source.clear()方法。
 *      - 我们希望点击Clear按钮就能调用source.clear()
 */
const clear = document.getElementById('clear');
// 给clear按钮添加一个监听器
clear.addEventListener('click',function(){
  sourceGeoJson.clear();
});


// download功能


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

sourceGeoJson.on('change',function(){
   const features = sourceGeoJson.getFeatures();//获取features中的所有要素；
   const json = format.writeFeatures(features) ; //format是一个GeoJSON对象，将要素写入GeoJSON
   download.href =
   'data:application/json;charset=utf-8,' + encodeURIComponent(json); 
});


