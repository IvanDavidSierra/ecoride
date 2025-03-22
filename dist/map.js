function initMap() {
  let mapContainer = document.getElementById("mi_mapa");

  if (!mapContainer) {
    console.error("El contenedor del mapa no se encontró.");
    return;
  }

  // Inicializar el mapa
  let map = L.map("mi_mapa").setView([4.674733, -74.088901], 15);

  // Añadir capa de tiles (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Definir iconos personalizados
  let greenIcon = L.icon({
    iconUrl: "./assets/img/leaf-green.png", // Ruta a la imagen del icono
    shadowUrl: "./assets/img/leaf-shadow.png", // Ruta a la imagen de la sombra
    iconSize: [38, 95], // Tamaño del icono
    shadowSize: [50, 64], // Tamaño de la sombra
    iconAnchor: [22, 94], // Punto de anclaje del icono
    shadowAnchor: [4, 62], // Punto de anclaje de la sombra
    popupAnchor: [-3, -76], // Punto de anclaje del popup
  });

  let redIcon = L.icon({
    iconUrl: "./assets/img/leaf-red.png", // Ruta a la imagen del icono
    shadowUrl: "./assets/img/leaf-shadow.png", // Ruta a la imagen de la sombra
    iconSize: [38, 95], // Tamaño del icono
    shadowSize: [50, 64], // Tamaño de la sombra
    iconAnchor: [22, 94], // Punto de anclaje del icono
    shadowAnchor: [4, 62], // Punto de anclaje de la sombra
    popupAnchor: [-3, -76], // Punto de anclaje del popup
  });

  // Variables para almacenar los marcadores y la ruta
  let marcadorPartida, marcadorLlegada, ruta;

  // Capturar el formulario
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar que el formulario se envíe

    // Obtener las direcciones ingresadas por el usuario
    let direccionPartida = document.getElementById("punto_partida").value;
    let direccionLlegada = document.getElementById("punto_llegada").value;

    // Geocodificar las direcciones y trazar la ruta
    Promise.all([geocodificar(direccionPartida), geocodificar(direccionLlegada)])
      .then(([coordsPartida, coordsLlegada]) => {
        // Limpiar marcadores y ruta anteriores
        if (marcadorPartida) map.removeLayer(marcadorPartida);
        if (marcadorLlegada) map.removeLayer(marcadorLlegada);
        if (ruta) map.removeLayer(ruta);

        // Añadir nuevos marcadores
        marcadorPartida = L.marker(coordsPartida, { icon: greenIcon })
          .addTo(map)
          .bindPopup("Punto de partida");

        marcadorLlegada = L.marker(coordsLlegada, { icon: redIcon })
          .addTo(map)
          .bindPopup("Punto de llegada");

        // Obtener y dibujar la ruta
        obtenerRuta(coordsPartida, coordsLlegada, map);
      })
      .catch((error) => {
        console.error("Error al geocodificar las direcciones:", error);
        alert("No se pudieron encontrar las direcciones. Verifica e intenta nuevamente.");
      });
  });

  // Si el mapa no se renderiza bien, forzar la actualización
  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

// Función para geocodificar una dirección usando Nominatim
function geocodificar(direccion) {
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    direccion
  )}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let lat = parseFloat(data[0].lat);
        let lon = parseFloat(data[0].lon);
        return [lat, lon]; // Devuelve las coordenadas [lat, lon]
      } else {
        throw new Error("Dirección no encontrada");
      }
    });
}

// Función para obtener la ruta utilizando OSRM
function obtenerRuta(puntoPartida, puntoLlegada, map) {
  // Formato de las coordenadas para OSRM: [lon, lat]
  let start = `${puntoPartida[1]},${puntoPartida[0]}`; // lon, lat
  let end = `${puntoLlegada[1]},${puntoLlegada[0]}`; // lon, lat

  // URL del servicio de OSRM
  let url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

  // Realizar la solicitud a la API de OSRM
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.routes && data.routes.length > 0) {
        // Extraer la geometría de la ruta
        let rutaGeoJSON = data.routes[0].geometry;

        // Dibujar la ruta en el mapa
        ruta = L.geoJSON(rutaGeoJSON, {
          style: {
            color: "#12E821", // Color de la línea
            weight: 5, // Grosor de la línea
            opacity: 0.7, // Opacidad de la línea
          },
        }).addTo(map);
      } else {
        console.error("No se pudo obtener la ruta.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener la ruta:", error);
    });
}

// Detectar cuándo se ha cargado carrera.html dinámicamente
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/app") {
    initMap();
  }
});