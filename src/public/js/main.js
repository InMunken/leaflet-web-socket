class Session {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.timestamp = new Date();
  }
}

// This is the client.
localData = [];

// Initialize variables
let locationData;
let marker = null;
let token = "hell";

let session;
let socket;

// Save formulary patrs
const modal = document.getElementById("modal");
const inputName = document.getElementById("nombre");
const inputToken = document.getElementById("token");
const boton = document.getElementById("send-button");
const sendLocal = document.getElementById("send-local")

// Start map
const map = L.map("map-template").setView([-34.572267, -58.439947], 11);


boton.onclick = function () {
  let nombre = inputName.value;

  token = inputToken.value;
  
  //modal.remove();

  session = new Session(token, localData);
  console.log(session);

  // It conects to the socket when the button is clicked
  socket = io({
    query: { session: JSON.stringify(session) },
  });


  // It recibes the whole user list to add the respective markers
  socket.on("ingreso-u", (UserList) => {
    UserList.forEach((user) => {
      const markerR = L.marker([user.latlng.lat, user.latlng.lng]);
      markerR.bindPopup(user.nombre);
      markerR.addTo(map);
    });
  });

  // It recibes all the session drawings
  socket.on("ingreso-d", (Dibujoslist) => {
    console.log("dibujando todo")
    Dibujoslist.data.forEach((dibujo) => {
      addDraw(dibujo);
    });
  });

  // When ever it recibes a new user it addest it to the map
  socket.on("usuarioConectado", (data) => {
    
    marker = L.marker([data.latlng.lat, data.latlng.lng]);
    marker.bindPopup(data.nombre);
    marker.addTo(map);
  });

  // When ever it recibes a new drawing is displays on the map
  socket.on("dibujoDeUser", (data) => {
    
    localData.push(data);
    addDraw(data);
  });
};

//leaflet draw handleing 
var drawControl = new L.Control.Draw();
map.addControl(drawControl);

var drawFeatures = new L.FeatureGroup();
map.addLayer(drawFeatures);

map.on("draw:created", function (e) {
  var type = e.layerType;
  var layer = e.layer;

  drawFeatures.addLayer(layer);

  var latlng, latlngs, radius;

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
  };

  //localData.push(data);

  console.log("Todos los dibujos de local data son: ", localData);
  checksAndSend("nuevoDibujo", data);
});

// Add map and request location

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.locate({ enableHighAccuracy: true });

map.on("locationfound", (e) => {
  locationData = e;
  map.setView([e.latlng.lat, e.latlng.lng]);
  marker = L.marker([e.latlng.lat, e.latlng.lng], { autoPanOnFocus: true });
  marker.bindPopup(inputName.value)
  marker.addTo(map);

  checksAndSend("usuarioActualizado",{
    nombre: inputName.value,
    latlng: locationData.latlng,
  });
});
  


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

function checksAndSend(eventName, data){
    if (socket) {
        console.log("Conectado al socket..")
        console.log("Enviando evento: ", eventName, "...")
        socket.emit(eventName, data)
    }else{
        console.log("Se guardariia en local")
        localData.push(data);   
    }
}