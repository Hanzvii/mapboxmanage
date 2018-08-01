import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = "pk.eyJ1IjoiaGFuenZpaSIsImEiOiJjamk5a3Y5amcweHJ2M2tyeGRlaW5kN2xjIn0.NquD2pG7lThD-w5Hxqoh7A";
let MapboxLanguage = require('@mapbox/mapbox-gl-language');
// var img = require("./fly.png");
const Map = {
  map: null,
  marker: {},
  polyline: {},
  init: null,
  //初始化地图
  initMap(obj) {
    this.init = {
      container: obj.container, 
      markerImg: obj.markerImg,//marker图片
    }
    this.map = new mapboxgl.Map({
      container: obj.container,
      style: 'mapbox://styles/mapbox/basic-v9',
      dragRotate: false
    });
    //语言与浏览器语言保持一致
    let language = new MapboxLanguage();
    this.map.addControl(language);
    return this.map;
  },
  //添加marker
  addMarker(position, markerId) {
    if (!!!markerId) {
      throw "addMarker 函数参数错误"
    }
    // const el = document.createElement('div')
    // el.style.backgroundImage = 'url(static/fly.png)'
    // el.style.backgroundRepeat = 'round'
    // el.style.width = '40px'
    // el.style.height = '40px'
    // this.marker[markerId] = new mapboxgl.Marker({
    //   element: el,
    //   // draggable: true
    // }).setLngLat(position).addTo(this.map);
    let _this = this;
    this.map.loadImage(_this.init.markerImg, function(error, image) {
      if (error) throw error;
      if(!_this.map.hasImage('cat')){
        _this.map.addImage('cat', image);
      }
      let point = {
        "type": "Point",
        "coordinates": position
      };
      // console.log(_this.map.getSource("drone"))
      if(_this.map.getSource(markerId) == undefined){
        _this.map.addSource(markerId, { type: 'geojson', data: point });
      }
      _this.map.addLayer({
          "id": markerId,
          "type": "symbol",
          "source": markerId,
          "layout": {
              "icon-image": "cat",
              "icon-rotation-alignment": "auto",
              "icon-size": 1.2,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true
          }
      });
    });
  },
  //设置marker位置
  setMarkerPosition(markerId, position) {
    let point = {
      "type": "Point",
      "coordinates": position
    };
    // this.marker[markerId].setLngLat(position);
    this.map.getSource(markerId).setData(point);
  },
  setMarkerRotate(markerId, rotate) {
    // let obj = this.marker[markerId].getElement();
    // let transformStyle = obj.style.transform
    // let index = this.findStrIndex(obj.style.transform, ')', 1)
    // obj.style.transform = transformStyle.slice(0, index + 1) + ' rotate(' + rotate + 'deg)'
    this.map.setLayoutProperty(markerId, 'icon-rotate', rotate);
  },
  getElementStyle(obj, sName) {
    return (obj.currentStyle || getComputedStyle(obj, false))[sName];
  },
  findStrIndex(str, cha, num) {
    var x = str.indexOf(cha);
    for (var i = 0; i < num; i++) {
      x = str.indexOf(cha, x + 1);
    }
    return x;
  },
  //初始化点击事件
  initClick(res) {
    this.map.on('click', function (e) {
      res(e)
    })
  },
  //初始化polyline
  addPolyline(list,id) {
    this.map.addLayer({
      "id": id,
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": list
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#888",
        "line-width": 8
      }
    });
  },
  updatePolyline(list,id) {
    var point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": list
        }
      }]
    };
    this.map.getSource(id).setData(point);
  }
}
export default Map;