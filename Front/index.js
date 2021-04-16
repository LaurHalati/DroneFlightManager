import "ol/ol.css";
import * as olProj from 'ol/proj';

import VectorImage from 'ol/layer/VectorImage';
import GeoJSON from 'ol/format/GeoJSON';

import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Source from "ol/source/Source";
import Style from "ol/style/Style";
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import VectorSource from "ol/source/Vector";

import LinearRing from 'ol/geom/LinearRing';
import Projection from 'ol/proj/Projection';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';


import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Snap from 'ol/interaction/Snap';




const fillStyle = new Fill({
    color:[94,95,100,0.3]
})
const strokeStyle = new Stroke({
    color:[46,45,45,1],
    witdth:1.2
})
const circelStyle = new CircleStyle({
    fill: new Fill({
        color:[245,49,5,1]
    }),
    radius:7,
    stroke:strokeStyle
})
var source1 = new VectorSource({wrapX: false});

var vector = new VectorLayer({
  source: source1,
});

var source = new VectorSource({
    url:'data/geojson/map.geojson',
    format: new GeoJSON()
    })
    var vectorLayer = new VectorLayer({
        source: source,
        style: new Style({
            fill:fillStyle,
            stroke:strokeStyle,
            image:circelStyle
        }),
      });
  var raster =new TileLayer({
        source: new OSM(),
      })
var map = new Map({
    target: "map",
    layers: [
      raster,vector
    ],
    view: new View({
      center: [2624601.46831981,  5903371.475213967],
      zoom: 10,
      maxZoom:18,
      minZoom:1,
    }),
    
  });
  var app4 = new Vue({
    el: '#app',
    data: {
      todos: [

      ]   
     }
  });


var source2 = new VectorSource({
  url:"data/geojson/map.json",
  format: new GeoJSON()
  })
  var vectorLayer2 = new VectorLayer({
      source: source2,
      style: new Style({
          fill:fillStyle,
          stroke:strokeStyle,
          image:circelStyle
      }),
    });        
    var coordinates = []
   
  
    var draw; 
function addInteraction() {
  draw = new Draw({
      source: source1,
      type: 'Polygon',
    });

    map.addInteraction(draw);
    draw.on('drawend', (evt) => {
      var coordonate = []
      const coordinates = evt.feature.getGeometry().getCoordinates();
      const geometry = new Polygon(coordinates);
      const geometry4326 = geometry.transform('EPSG:3857', 'EPSG:4326');
      for (let i =0 ;i< geometry4326.flatCoordinates.length-2;i+=2){
        var arr= []
        arr.push ( geometry4326.flatCoordinates[i])
        arr.push( geometry4326.flatCoordinates[i+1])
             var text= "Latitude: "+ geometry4326.flatCoordinates[i] + " Longitude:"+geometry4326.flatCoordinates[i+1]
             app4.todos.push({ text: text })
        coordonate.push(arr)
      }
      var data = {'coordinates':(coordonate)}
      fetch('http://localhost:8080/drones', {
       method: 'POST', // or 'PUT'
       headers: {
        'Content-Type': 'application/json', 'charset': 'utf-8'
       },
       body: JSON.stringify(data),
     })
     .then(response => response.json())
     .then(data => {
       console.log('Success:', data);
     })
     .catch((error) => {
       console.error('Error:', error);
     });
      console.log(coordonate)
    });
}
$( "form" ).on( "submit", function(e) {
 
  var dataString = $(this).serialize();
   
  $.ajax({
    
    data: dataString,
    success: function () {
 
    }
  });
  addInteraction();
  e.preventDefault();
});

map.removeInteraction()
