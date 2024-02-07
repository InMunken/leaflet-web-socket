//this is the client.

const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io();

const boton = document.getElementById("burrrron")

let locationData;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })


socket.on('usuarioConectado', (coords, userinformation) =>{
    const marker = L.marker([(coords.lat), coords.lng]);
    marker.bindPopup(userinformation);
    marker.addTo(map);
});

boton.onclick = function() {
    
    map.on('locationfound', e => {
        locationData = e;
        const marker = L.marker([e.latlng.lat, e.latlng.lng]);
        marker.bindPopup('Soy yo el que está acá');
        marker.addTo(map);
        socket.emit('usuarioActualizado', e.latlng)
    })

    
}