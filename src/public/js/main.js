//this is the client.
localData =
    [

    ]

const session = new Session("id1", localData)

const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io({
    query: { session: JSON.stringify(session) }
});

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

map.on("draw:created", function (e) {
    var type = e.layerType;
    var layer = e.layer;

    drawFeatures.addLayer(layer);

    var latlng, latlngs, radius;

    if (type === 'marker') {
        latlng = layer.getLatLng();
        latlngs = null;
        radius = null;
    } else if (type === 'circle') {
        latlng = layer.getLatLng();
        radius = layer.getRadius();
        latlngs = null;
    } else if (type === 'circlemarker') {
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
        radius: radius
    };

    localData.push(Data)
    socket.emit('nuevoDibujo', data);
});



//creación del mapa y pedido de locación

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })

map.on('locationfound', e => {
    locationData = e;
    map.setView([e.latlng.lat, e.latlng.lng]);
    marker = L.marker([e.latlng.lat, e.latlng.lng], { autoPanOnFocus: true });
    socket.emit('usuarioActualizado', { nombre: "nombre", latlng: locationData.latlng })

})

//ingreso al web-socket


socket.on('ingreso-u', UserList => {
    UserList.forEach(user => {
        const markerR = L.marker([(user.latlng.lat), (user.latlng.lng)])
        markerR.bindPopup(user.nombre);
        markerR.addTo(map)
    })
})

socket.on('ingreso-d', Dibujoslist => {
    Dibujoslist.forEach(dibujo => {
        addDraw(dibujo)
    })
})




// recibe 
socket.on('usuarioConectado', data => { //info de que alguien se conectó 
    marker = L.marker([(data.latlng.lat), data.latlng.lng]);
    marker.bindPopup(data.nombre);
    marker.addTo(map);
});


socket.on('dibujoDeUser', (data) => { //un dibujo der alguien más 
    localData.push(data)
    addDraw(data)
});


function addDraw(data) {
    let layer;
    let layerType = data.layerType;

    console.log(data.layerType);
    if (data.layerType === 'marker') {
        layer = L.marker([data.latlng.lat, data.latlng.lng], { autoPanOnFocus: true });
    }
    else if (data.layerType === 'polyline') {
        layer = L.polyline(data.latlngs);
    } else if (data.layerType === 'polygon') {
        layer = L.polygon(data.latlngs);
    } else if (data.layerType === 'rectangle') {
        layer = L.rectangle(data.latlngs);
    } else if (data.layerType === 'circle') {
        layer = L.circle(data.latlng, { radius: data.radius });
    } else if (data.layerType === 'circlemarker') {
        layer = L.circleMarker(data.latlng, { radius: data.radius });
    }

    layer.addTo(map);
}


// boton.onclick = function () {

//     let nombre = inputName.value;
//     console.log(nombre)

//     marker.bindPopup(nombre);
//     marker.addTo(map);
//     socket.emit('usuarioActualizado', { nombre: nombre, latlng: locationData.latlng })

//     modal.remove()
// }