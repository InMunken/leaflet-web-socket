// Initialize variables
let locationData;
let marker = null;
let token = "hell";

let socket;

// Start map
const map = L.map("map-template").setView([-34.572267, -58.439947], 11);

socket = io();

// When ever it recibes a new drawing is displays on the map
socket.on("dibujoDeUser", (data) => {

  console.log("hel")


  addDraw(data);

});

//leaflet draw handleing
var drawControl = new L.Control.Draw();
map.addControl(drawControl);

var drawFeatures = new L.FeatureGroup();
map.addLayer(drawFeatures);

map.on("draw:created", function (e) {
  var type = e.layerType;
  var layer = e.layer;

  drawFeatures.addLayer(layer);

  var latlng = null;
  var latlngs = null;
  var radius = null;
  var name = null;

  if (type === "marker") {
    latlng = layer.getLatLng();
    latlngs = null;
    radius = null;
  } else if (type === "circle") {
    latlng = layer.getLatLng();
    radius = layer.getRadius();
    latlngs = null;
  } else if (type === "circlemarker") {
    latlng = layer.getLatLng();
    radius = layer.getRadius();
    latlngs = null;
  } else {
    latlngs = layer.getLatLngs();
    latlng = null;
    radius = null;
  }

  var data = {
    layerType: type,
    latlngs: latlngs,
    latlng: latlng,
    radius: radius,
    name: null,
  };

  //localData.push(data);
  

  checksAndSend("nuevoDibujo", data);
});



// Add map and request location

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function addDraw(data) {
  let layer;
  let layerType = data.layerType;

  console.log(data.layerType);

  if (data.layerType === "marker") {
    layer = L.marker([data.latlng.lat, data.latlng.lng], {
      autoPanOnFocus: true,
    });
  } else if (data.layerType === "polyline") {
    layer = L.polyline(data.latlngs);
  } else if (data.layerType === "polygon") {
    layer = L.polygon(data.latlngs);
  } else if (data.layerType === "rectangle") {
    layer = L.rectangle(data.latlngs);
  } else if (data.layerType === "circle") {
    layer = L.circle(data.latlng, { radius: data.radius });
  } else if (data.layerType === "circlemarker") {
    layer = L.circleMarker(data.latlng, { radius: data.radius });
  }

  layer.addTo(map);
}

function checksAndSend(eventName, data) {
  if (socket) {
    console.log("Conectado al socket..");
    console.log("Enviando evento: ", eventName, "...");
    socket.emit(eventName, data);
  } else {
    console.log("Se guardaría en local");
    //localData.push(data);
  }
}
