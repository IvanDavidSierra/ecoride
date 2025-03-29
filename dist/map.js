const PLANES = {
  basic: {
    precio: 2000,
    maxKm: 1.99,
    nombre: "Basic",
    color: " #12E821", 
    
  },
  silver: {
    precio: 4000,
    maxKm: 2.99,
    nombre: "Silver",
    color: " #12E821", 
    
  },
  gold: {
    precio: 10000,
    maxKm: 3.99,
    nombre: "Gold",
    color: " #12E821",
    
  }
};

function determinarPlan(distanciaKm) {
  if (distanciaKm <= PLANES.basic.maxKm) return PLANES.basic;
  if (distanciaKm <= PLANES.silver.maxKm) return PLANES.silver;
  if (distanciaKm <= PLANES.gold.maxKm) return PLANES.gold;
  return null;
}

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
    iconUrl: "./assets/img/leaf-green.png",
    shadowUrl: "./assets/img/leaf-shadow.png",
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  let redIcon = L.icon({
    iconUrl: "./assets/img/leaf-red.png",
    shadowUrl: "./assets/img/leaf-shadow.png",
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  // Variables para almacenar los marcadores y la ruta
  let marcadorPartida = null;
  let marcadorLlegada = null;
  let ruta = null;

  // Función para limpiar el mapa
  function limpiarMapa() {
    // Limpiar marcadores
    if (marcadorPartida) {
      map.removeLayer(marcadorPartida);
      marcadorPartida = null;
    }
    if (marcadorLlegada) {
      map.removeLayer(marcadorLlegada);
      marcadorLlegada = null;
    }
    
    // Limpiar ruta
    if (ruta) {
      map.removeLayer(ruta);
      ruta = null;
    }
    
    // Limpiar información mostrada
    document.getElementById("distance").textContent = "0 km";
    document.getElementById("plan-type").textContent = "-";
    document.getElementById("estimated-price").textContent = "$0";
    document.getElementById("distance-warning").style.display = "none";
    
    // Forzar actualización del mapa
    map.invalidateSize();
  }

  // Capturar el formulario
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let direccionPartida = document.getElementById("punto_partida").value.trim();
    let direccionLlegada = document.getElementById("punto_llegada").value.trim();

    if (!direccionPartida || !direccionLlegada) {
      alert("Por favor ingrese ambas direcciones.");
      return;
    }

    // Limpiar el mapa antes de añadir nuevos elementos
    limpiarMapa();

    Promise.all([geocodificar(direccionPartida), geocodificar(direccionLlegada)])
      .then(([coordsPartida, coordsLlegada]) => {
        marcadorPartida = L.marker(coordsPartida, { icon: greenIcon })
          .addTo(map)
          .bindPopup("Punto de partida");

        marcadorLlegada = L.marker(coordsLlegada, { icon: redIcon })
          .addTo(map)
          .bindPopup("Punto de llegada");

        obtenerRuta(coordsPartida, coordsLlegada, map, function(nuevaRuta) {
          ruta = nuevaRuta;
          if (nuevaRuta) {
            map.fitBounds(ruta.getBounds());
          }
        });
      })
      .catch((error) => {
        console.error("Error al geocodificar las direcciones:", error);
        alert("No se pudieron encontrar las direcciones. Verifica e intenta nuevamente.");
      });
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

function geocodificar(direccion) {
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        throw new Error("Dirección no encontrada");
      }
    });
}

function obtenerRuta(puntoPartida, puntoLlegada, map, callback) {
  let start = `${puntoPartida[1]},${puntoPartida[0]}`;
  let end = `${puntoLlegada[1]},${puntoLlegada[0]}`;
  let url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data.routes) && data.routes.length > 0) {
        let rutaGeoJSON = data.routes[0].geometry;
        let distanciaMetros = data.routes[0].distance;
        let distanciaKm = (distanciaMetros / 1000).toFixed(2);
        
        const plan = determinarPlan(distanciaKm);
        const warningElement = document.getElementById("distance-warning");
        
        // Actualizar UI
        document.getElementById("distance").textContent = `${distanciaKm} km`;
        
        if (!plan) {
          // Distancia excedida
          document.getElementById("plan-type").textContent = "No disponible";
          document.getElementById("estimated-price").textContent = "No disponible";
          warningElement.style.display = "block";
          
          // Dibujar ruta en rojo para indicar error
          let rutaError = L.geoJSON(rutaGeoJSON, {
            style: { 
              color: "#FF0000",
              weight: 5,
              opacity: 0.7
            }
          }).addTo(map);
          
          return callback(rutaError);
        }
        
        // Mostrar información del plan
        warningElement.style.display = "none";
        document.getElementById("plan-type").textContent = plan.nombre;
        document.getElementById("plan-type").style.color = plan.color;
        document.getElementById("estimated-price").textContent = `$${plan.precio.toLocaleString()}`;
        
        // Dibujar ruta con el color del plan
        let nuevaRuta = L.geoJSON(rutaGeoJSON, {
          style: { 
            color: plan.color,
            weight: 5,
            opacity: 0.7
          }
        }).addTo(map);
        
        callback(nuevaRuta);
      } else {
        console.error("No se pudo obtener la ruta.");
        callback(null);
      }
    })
    .catch((error) => {
      console.error("Error al obtener la ruta:", error);
      callback(null);
    });
}

// Inicialización condicional del mapa
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.includes("carrera")) {
    initMap();
  }
});