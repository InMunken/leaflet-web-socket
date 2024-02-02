//ign -34.572267, -58.439947


const map = L.map('map-template').setView([-34.572267, -58.439947], 11);

const socket = io();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({ enableHighAccuracy: true })
map.on('locationfound', e => {

    const marker = L.marker([e.latlng.lat, e.latlng.lng]);

    marker.bindPopup('Soy yo el que está acá');

    marker.addTo(map);

})


const marker = L.marker([-34.672267, -58.439947]);

marker.bindPopup('esto es una prueba');

marker.addTo(map);