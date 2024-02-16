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