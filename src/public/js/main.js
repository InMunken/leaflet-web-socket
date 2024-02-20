//this is the client.

const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io();

const modal = document.getElementById("modal")
const inputName = document.getElementById("nombre")
const boton = document.getElementById("send-button")

let locationData;
let marker = null;

var drawControl = new L.Control.Draw()
map.addControl(drawControl)

var drawFeatures = new L.FeatureGroup();
map.addLayer(drawFeatures)

map.on("draw:created", function(e){
    var type = e.layerType;
    var layer = e.layer;

    drawFeatures.addLayer(layer);

    var data = {
        layerType: type,
        latlngs: layer.getLatLngs() 
    };

    socket.emit('nuevoDibujo', data);
});




L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })

socket.on('ingreso',UserList => {
    UserList.forEach(user => {
        const markerR = L.marker([(user.latlng.lat), (user.latlng.lng)])
        markerR.bindPopup(user.nombre);
        markerR.addTo(map)
    })   
})

socket.on('usuarioConectado', data => {
    marker = L.marker([(data.latlng.lat), data.latlng.lng]);
    marker.bindPopup(data.nombre);
    marker.addTo(map);
});

socket.on('dibujoDeUser', (data) => {
    let layer;

    console.log(data.layerType);
    if (data.layerType === 'marker') {
        layer = L.marker(data.latlngs[0]);
    } else if (data.layerType === 'polyline') {
        layer = L.polyline(data.latlngs);
    } else if (data.layerType === 'polygon') {
        layer = L.polygon(data.latlngs);
    } 

    layer.addTo(map);
});


map.on('locationfound', e => {
    locationData = e;
    map.setView([e.latlng.lat, e.latlng.lng]);
    marker = L.marker([e.latlng.lat, e.latlng.lng], { autoPanOnFocus: true });
    
})


boton.onclick = function () {

    let nombre = inputName.value;
    console.log(nombre)

    marker.bindPopup(nombre);
    marker.addTo(map);
    socket.emit('usuarioActualizado', { nombre: nombre, latlng: locationData.latlng })

    modal.remove()
}