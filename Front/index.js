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
import Point from "ol/geom/Point";
import * as turf from "@turf/turf";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import { defaults as defaultControls } from "ol/control";
import LineString from "ol/geom/LineString";
import Text from "ol/style/Text";
import Projection from "ol/proj/Projection";
import { getLength } from "ol/sphere";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";

// import Snap from 'ol/interaction/Snap';
// import LinearRing from 'ol/geom/LinearRing';
// import Geometry from 'ol/geom/Geometry';
// import Source from "ol/source/Source";
// import * as olProj from 'ol/proj';
// import VectorImage from 'ol/layer/VectorImage';

function stateChange(newState) {
  setTimeout(function() {
    if (newState == -1) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    if (newState == 0) {
      divText.warningText = "";
    }
  }, 2500);
}

$("#finalSubmit").css("visibility", "hidden");

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

var listener;
var sketch;
var measureTooltipElement;
var measureTooltip;
var pointerMoveHandler = function(evt) {
  if (evt.dragging) {
    return;
  }
};

var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: "EPSG:4326",
});
var map = new Map({
  controls: defaultControls().extend([mousePositionControl]),
  target: "map",
  layers: [raster, vector],
  view: new View({
  center: [2625757.578372622, 5904479.812124118],
  zoom: 13,maxZoom: 18,minZoom: 1,}),});

map.on("pointermove", pointerMoveHandler);

mousePositionControl.setProjection("EPSG:4326");
mousePositionControl.setCoordinateFormat(createStringXY(7));

var divText = new Vue({
  el: "#app",
  data: {
    coordinatesText: "",
    inputText: "",
    warningText: "",
  },
});
$("#submitGEO").on("click", function() {
  const selectedFile = document.getElementById("geoInput").files[0];
  let pasteJson;
  if (selectedFile) {
    var reader = new FileReader();
    reader.readAsText(selectedFile, "UTF-8");
    reader.onload = function(evt) {
      try {
        pasteJson = jQuery.parseJSON(evt.target.result);
        console.log(pasteJson);
      } catch (error) {
        console.log(error);
        divText.warningText ="The GeoJSON you want to paste is not correctly formated!";
        stateChange(0);
      }
      if (
        pasteJson.hasOwnProperty("type") &&pasteJson.type == "FeatureCollection") {
        for (let i = 0; i < pasteJson.features.length; i++) {
          if (pasteJson.features[i].geometry.type == "Polygon")
            drawPolygonOnMap(pasteJson.features[i].geometry.coordinates, "fromdb");
        }
      }
      if (pasteJson.hasOwnProperty("type") && pasteJson.type == "Polygon") {
        drawPolygonOnMap(pasteJson.coordinates, "fromdb");
      }
    };
    reader.onerror = function(evt) {
      //TODO
    };
  }
});

var count = 0;
var startTime;
var endTime;
$("#start-time").on("change", function() {
  startTime = document.getElementById("start-time");
  var endDate = new Date(startTime.value);
  endDate.setMinutes(endDate.getMinutes() + 30);
  Number.prototype.AddZero = function(b, c) {
    var l = String(b || 10).length - String(this).length + 1;
    return l > 0 ? new Array(l).join(c || "0") + this : this;
  }; //to add zero to less than 10
  var localDateTime =
    [endDate.getFullYear(),(endDate.getMonth() + 1).AddZero(),endDate.getDate().AddZero(),].join("-") +"T" +
    [endDate.getHours().AddZero(), endDate.getMinutes().AddZero()].join(":");
  endTime = document.getElementById("end-time");
  endTime.min = startTime;
  endTime.value = localDateTime;
  sendData(startTime, endTime);
});
var draw;
draw = new Draw({
  source: source1,
  type: "Polygon",
});

function sendData(startTime, endTime) {
  $("form").on("submit", function(e) {
    e.preventDefault();
    map.addInteraction(draw);
    createMeasureTooltip();
    count++;
    if (count == 1) {
      addInteraction(startTime, endTime,"planning");
    }
  });
}

map.removeInteraction();

function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
  });
  map.addOverlay(measureTooltip);
}

function addInteraction(startTime, endTime,interaction) {
  var clickCoords=0;
  map.on("click",function(e){
    clickCoords= e.coordinate;
  })
  map.on("pointermove",function(e){
    var output;
    var edgesarr = [];
    edgesarr.push(clickCoords);
    edgesarr.push(e.coordinate);
    if(clickCoords!=0){ 
    output = formatLength(new LineString(edgesarr));
    var tooltipCoord;
    tooltipCoord = clickCoords;
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
    }
   });
  draw.on("drawend", (evt) => { 
    map.removeOverlay(measureTooltip)
    const coordinates = evt.feature.getGeometry().getCoordinates();
    const geometry = new Polygon(coordinates);
    const geometry4326 = geometry.transform("EPSG:3857", "EPSG:4326");
    divText.inputText ="The polygon that you created has the following coordinates";
    drawPolygonOnMap(geometry4326.getCoordinates(), "toDraw");
    var data = {
      geometry: { type: "Polygon", coordinates: geometry4326.getCoordinates() },
      startTime: startTime.value,
      endTime: endTime.value,
    };
    map.removeInteraction(draw);

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
        console.log(geometry4326.getCoordinates());
        if (data[0].name == "intersectie") {
          checkIntersection(data, geometry4326.getCoordinates());
        } else {
          console.log("Success:");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

var formatLength = function(line) {
  var length = getLength(line);
  var output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

var polygonNo = 1;

function drawPolygonOnMap(coordinates, source) {
  if (source == "fromdb") {
    for (let i = 0; i < coordinates[0].length - 1; i++) {
      const polygonFeature2 = new Feature(
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
  } else if (source == "toDraw") {
    divText.coordinatesText +=
      "Flight plan number " + polygonNo + " has the following coordinates: ";
    for (let i = 0; i < coordinates[0].length - 1; i++) {
      const points = new Feature(
        new Point(coordinates[0][i]).transform("EPSG:4326", "EPSG:3857")
      );
      divText.coordinatesText +="\n" +"Point " + (i + 1) +": Latitude: " +coordinates[0][i][0] +" Longitude: " +coordinates[0][i][1];
      let source2 = new VectorSource({
        features: [points],
      });
      var layer2 = new VectorLayer({
        source: source2,
      });
      map.addLayer(layer2);
    }
    divText.coordinatesText += "\n";
    const fillEdges = new Fill({
      color: [53, 245, 5, 1],
    });
    for (let i = 0; i < coordinates[0].length - 1; i++) {
      var edgesarr = [];
      edgesarr.push(coordinates[0][i]);
      edgesarr.push(coordinates[0][i + 1]);
      const edges = new Feature(
        new LineString(edgesarr).transform("EPSG:4326", "EPSG:3857")
      );
      let sourceEdges = new VectorSource({
        features: [edges],
      });

      var layerEdge = new VectorLayer({
        source: sourceEdges,
        style: new Style({
          fill: fillEdges,
          stroke: strokeStyle,
          text: new Text({
            font: "14px Calibri",
            fill: new Fill({ color: "#000" }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
            text: formatLength(
              new LineString(edgesarr).transform("EPSG:4326", "EPSG:3857")
            ),
          }),
        }),
      });
      map.addLayer(layerEdge);
    }
    polygonNo++;
  }
}
$("#button").on("click", function() {
  let request = new XMLHttpRequest();
  var url ="http://localhost:8080/drones" +"/" +startTime.value +"_" +endTime.value;
  console.log(url);
  request.open("GET", url);
  request.responseType = "text";
  request.onload = function() {
    var test = JSON.parse(request.response);
    test.forEach((o) => {
      drawPolygonOnMap(o.geometry.coordinates, "fromdb");
    });
  };
  request.send();
});

function checkIntersection(toDraw, drawnCoords) {
  const userPolygon = new Feature(
    new Polygon(drawnCoords).transform("EPSG:4326", "EPSG:3857")
  );
  for (let i = 0; i < toDraw.length; i++) {
    const polygonFeature = new Feature(
      new Polygon(toDraw[i].geometry.coordinates).transform("EPSG:4326","EPSG:3857" ));
    var format = new GeoJSON();
    var intersection = format.readFeature(
      turf.intersect(
        format.writeFeatureObject(userPolygon),
        format.writeFeatureObject(polygonFeature)
      )
    );
    const fillStyle2 = new Fill({
      color: [245, 49, 5, 0.7],
    });
    let source = new VectorSource({
      features: [intersection],
    });
    var layer = new VectorLayer({
      source: source,
      style: new Style({
        fill: fillStyle2,
        stroke: strokeStyle,
        image: circelStyle,
      }),
    });
    map.addLayer(layer);
  }
}
