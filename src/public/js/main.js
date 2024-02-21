//this is the client.

const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io();

// const modal = document.getElementById("modal")
// const inputName = document.getElementById("nombre")
// const boton = document.getElementById("send-button")


//inicio variables

let locationData;
let marker = null;


//manejo de leaflet draw

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

//creación del mapa y pedido de locación

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })


//ingreso al web-socket


socket.on('ingreso-u',UserList => {
    UserList.forEach(user => {
        const markerR = L.marker([(user.latlng.lat), (user.latlng.lng)])
        markerR.bindPopup(user.nombre);
        markerR.addTo(map)
    })   
})

// recibe 
socket.on('usuarioConectado', data => { //info de que alguien se conectó 
    marker = L.marker([(data.latlng.lat), data.latlng.lng]);
    marker.bindPopup(data.nombre);
    marker.addTo(map);
});

socket.on('dibujoDeUser', (data) => { //un dibujo der alguien más 
    const layerTypes = {
        'marker': L.marker,
        'polyline': L.polyline,
        'polygon': L.polygon,
        'rectangle': L.rectangle
    };

    const layerFunction = layerTypes[data.layerType];
    if (layerFunction) {
        const layer = data.layerType === 'marker' ? layerFunction(data.latlngs[0]) : layerFunction(data.latlngs);
        layer.addTo(map);
    } else {
        console.error(`Layer type ${data.layerType} not supported`);
    }
});


map.on('locationfound', e => {
    locationData = e;
    map.setView([e.latlng.lat, e.latlng.lng]);
    marker = L.marker([e.latlng.lat, e.latlng.lng], { autoPanOnFocus: true });
    
})


// boton.onclick = function () {

//     let nombre = inputName.value;
//     console.log(nombre)

//     marker.bindPopup(nombre);
//     marker.addTo(map);
//     socket.emit('usuarioActualizado', { nombre: nombre, latlng: locationData.latlng })

//     modal.remove()
// }