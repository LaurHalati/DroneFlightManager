import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import VectorSource from "ol/source/Vector";
import Polygon from "ol/geom/Polygon";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import Draw from "ol/interaction/Draw";
import Feature from "ol/Feature";
import Intersects from "ol/format/filter/Intersects";
import Geometry from "ol/geom/Geometry";
import Point from 'ol/geom/Point';

// import LineString from 'ol/geom/LineString';
// import Snap from 'ol/interaction/Snap';
// import LinearRing from 'ol/geom/LinearRing';
// import Projection from 'ol/proj/Projection';
// import Geometry from 'ol/geom/Geometry';
// import Source from "ol/source/Source";
// import * as olProj from 'ol/proj';
// import VectorImage from 'ol/layer/VectorImage';
$('#finalSubmit').css('visibility','hidden');

const fillStyle = new Fill({
  color: [94, 95, 100, 0.3],
});
const strokeStyle = new Stroke({
  color: [46, 45, 45, 1],
  witdth: 1.2,
});
const circelStyle = new CircleStyle({
  fill: new Fill({
    color: [245, 49, 5, 1],
  }),
  radius: 7,
  stroke: strokeStyle,
});
var source1 = new VectorSource({ wrapX: false });

var vector = new VectorLayer({
  source: source1,
});

var raster = new TileLayer({
  source: new OSM(),
});
var map = new Map({
  target: "map",
  layers: [raster, vector],
  view: new View({
    center: [2625757.578372622, 5904479.812124118],
    zoom: 13,
    maxZoom: 18,
    minZoom: 1,
  }),
});
var divText = new Vue({
  el: "#app",
  data: {
    todos: [],
    inputText:""

  },
});

var count =0;
var startTime;
var endTime;
$("#start-time").on("change", function () {
  
  startTime = document.getElementById("start-time");
  var endDate = new Date(startTime.value);
  endDate.setMinutes(endDate.getMinutes() + 30);
  Number.prototype.AddZero = function(b, c) {
    var l = String(b || 10).length - String(this).length + 1;
    return l > 0 ? new Array(l).join(c || "0") + this : this;
  }; //to add zero to less than 10

  var localDateTime =
    [
      endDate.getFullYear(),
      (endDate.getMonth() + 1).AddZero(),
      endDate.getDate().AddZero(),
    ].join("-") +
    "T" +
    [endDate.getHours().AddZero(), endDate.getMinutes().AddZero()].join(":");

  endTime = document.getElementById("end-time");
  endTime.min = startTime;
  endTime.value = localDateTime;
  sendData(startTime,endTime);

})

function sendData(startTime, endTime){

$("form").on("submit", function (e) {
  count++
  var dataString = $(this).serialize();
  //console.log(dataString)
 
  $.ajax({
    data: dataString,
    success: function() {},
  });
  if(count == 1){
    addInteraction(startTime, endTime);

  }
  e.preventDefault();
});
}
map.removeInteraction();

function addInteraction(startTime, endTime) {
  var draw;
  draw = new Draw({
    source: source1,
    type: "Polygon",
  });

  map.addInteraction(draw);
  draw.on("drawend", (evt) => {
    const coordinates = evt.feature.getGeometry().getCoordinates();
    const geometry = new Polygon(coordinates);
    console.log(coordinates);
    const geometry4326 = geometry.transform("EPSG:3857", "EPSG:4326");
    divText.inputText="The polygon that you created has the following coordinates"
    for (let i = 0; i <= geometry4326.flatCoordinates.length - 3; i += 2) {
      var arr = [];
      arr.push(geometry4326.flatCoordinates[i]);
      arr.push(geometry4326.flatCoordinates[i + 1]);
      var text ="Latitude: " + geometry4326.flatCoordinates[i] + " Longitude:" + geometry4326.flatCoordinates[i + 1];
      divText.todos.push({ text: text });

    }

    var data = {
      geometry: { type: "Polygon", coordinates: geometry4326.getCoordinates() },
      startTime:startTime.value,
      endTime:endTime.value,
      
    };
    fetch("http://localhost:8080/drones", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
     
    });
}
function drawPolygonOnMap(coordinates) {
  for(let i=0;i<coordinates[0].length-1;i++){
    const polygonFeature2= new Feature(
      new Point(coordinates[0][i]).transform("EPSG:4326", "EPSG:3857")
      );
      let source2 = new VectorSource({
        features: [polygonFeature2],
      });
      var layer2 = new VectorLayer({
        source: source2,
      });
      map.addLayer(layer2);

  }
  const polygonFeature = new Feature(
    new Polygon(coordinates).transform("EPSG:4326", "EPSG:3857")
  );
  let source = new VectorSource({
    features: [polygonFeature],
  });
  var layer = new VectorLayer({
    source: source,
    style: new Style({
      fill: fillStyle,
      stroke: strokeStyle,
      image: circelStyle,
    }),
  });

  map.addLayer(layer);

}

$("#button").on("click", function() {
  let request = new XMLHttpRequest();  
  var url="http://localhost:8080/drones"+"/"+startTime.value+"_"+endTime.value;
  console.log(url)
   request.open("GET", url);
  request.responseType = "text";
  request.onload = function() {
    // console.log(request.response);
    var test = JSON.parse(request.response);
    test.forEach((o) => {
      //console.log(o.geometry.coordinates[0]);
      
      drawPolygonOnMap(o.geometry.coordinates);
    });
  };
  request.send();

});
// $("#finalSubmit").on("click",function(){
//   var request= new XMLHttpRequest();
//   request.open("GET","http://localhost:8080/drones");
//   request.responseType = "text";
//   request.onload = function() {
//     // console.log(request.response);
//     var test = JSON.parse(request.response);
//     test.forEach((o) => {
//       //console.log(o.geometry.coordinates[0]);
      
//       drawPolygonOnMap(o.geometry.coordinates);
//     });
//   };
//   request.send();
// })
