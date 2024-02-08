//this is the client.

const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io();

const modal = document.getElementById("modal")
const inputName = document.getElementById("nombre")
const boton = document.getElementById("send-button")

let locationData;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })


socket.on('usuarioConectado', data =>{
    const marker = L.marker([(data.latlng.lat), data.latlng.lng]);
    marker.bindPopup(data.nombre);
    marker.addTo(map);
});

boton.onclick = function() {

    let nombre = inputName.value;
    console.log(nombre)

    map.on('locationfound', e => {
        locationData = e;

        map.setView([e.latlng.lat, e.latlng.lng]);
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {autoPanOnFocus: true});
        marker.bindPopup(nombre);
        marker.addTo(map);
        
        socket.emit('usuarioActualizado', {nombre: nombre, latlng: e.latlng})
    })

    modal.remove()
    
}