// crear el mapa
let mapa = L.map('map').setView([-17.391, -65.519], 7);

// agregar el mapa base
let mapaBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
{
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

mapaBase.addTo(mapa);

// crear geojson
var puntos = L.geoJSON.AJAX("estatuas-bol.geojson");

puntos.addTo(map);