

console.log("Script cargado correctamente");




// Primero creamos el mapa
var map = L.map('map', {
  center: [-17.413977, -66.16528], 
  zoom: 5.4, 
  minZoom: 5.4, 
  maxZoom: 18,
  maxBounds: [
      [-22.9, -69.6],  
      [-9.6, -57.5]    
  ],
  maxBoundsViscosity: 1.0
});

// mapas
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



const customIcon = L.icon({
  iconUrl: 'icon.png', 
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35]
});

//cargar mapas y datos 
fetch('muestra.geojson')
  .then(response => response.json())
  .then(data => {
    const layer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const props = feature.properties;
        const id = Math.random().toString(36).substring(2, 9);

        const urlDisplay = props.url ? 
          `<div style="margin-top:5px;">
             <strong>Enlace:</strong> 
             <a href="${props.url}" target="_blank" style="color: #1a73e8; text-decoration: none; word-break: break-all;">
               ${props.url}
             </a>
           </div>` : 
          '<div style="margin-top:5px;"><strong>Enlace:</strong> No disponible</div>';

        let popupContent = `
          <div id="popup-${id}" style="max-width: 300px;">
            <strong style="font-size: 16px;">${props.nombre}</strong><br>
            <span style="color: #555;">${props.ciudad}</span><br>
            <p style="margin: 8px 0;">${props.descripcion}</p>
            ${props.url ? `<img src="${props.url}" alt="Imagen" style="width:100%; margin:5px 0; border-radius:5px; border:1px solid #eee;">` : ''}
            
            <a href="#" class="toggle-info" data-target="info-${id}" 
               style="display: inline-block; margin: 5px 0; color: #1a73e8; text-decoration: none; font-weight: bold;">
              ▶ Conozca más
            </a>
            
            <div id="info-${id}" style="display:none; margin-top:8px; padding-top:8px; border-top:1px solid #eee;">
              <strong>Tema:</strong> ${props.tema}<br>
              <strong>Personaje destacado:</strong> ${props.personaje_destacado}<br>
              <strong>Género:</strong> ${props.genero}<br>
              <strong>Estado:</strong> ${props.estado}<br>
              <strong>Lugar:</strong> ${props.lugar}<br>
              <strong>Año:</strong> ${props.year}<br>
              <strong>Organización:</strong> ${props.organizacion}<br>
              <strong>Mapeador:</strong> ${props.Mapeador}<br>
              ${urlDisplay}
            </div>
          </div>
        `;

        return L.marker(latlng, { icon: customIcon }).bindPopup(popupContent);
      }
    });

    layer.addTo(map);

    map.on('popupopen', function(e) {
      const container = e.popup.getElement();
      const toggleLink = container.querySelector('.toggle-info');
      if (toggleLink) {
        toggleLink.addEventListener('click', function(ev) {
          ev.preventDefault();
          const targetId = this.dataset.target;
          const targetDiv = container.querySelector('#' + targetId);
          if (targetDiv.style.display === 'none') {
            targetDiv.style.display = 'block';
            this.innerHTML = '▼ Mostrar menos';
          } else {
            targetDiv.style.display = 'none';
            this.innerHTML = '▶ Conozca más';
          }
        });
      }
    });
  })
  .catch(error => console.error('Error al cargar el GeoJSON:', error));



map.on('zoomend', function () {
  document.querySelector('.zoom-info').textContent = 'Zoom: ' + map.getZoom();
});

//agrergar al logo como marca de agua 
var logoControl = L.control({ position: 'bottomright' });

logoControl.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'logo-watermark');
  div.innerHTML = '<img src="ciudatoslogo.png" style="width:100px; opacity: 0.8;">';
  return div;
};

logoControl.addTo(map);


// Control del zoom
var zoomInfo = L.control({position: 'topright'});
zoomInfo.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'zoom-info');
  div.textContent = 'Zoom: ' + map.getZoom();
  return div;
};
zoomInfo.addTo(map);


