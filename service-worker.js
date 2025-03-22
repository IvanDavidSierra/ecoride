//1.Definir los archivos que van a estar en la memoria cache del navegador
const CACHE_NAME = "cache_store";
const FILES = [
    "./index.html",
    "./assets/img/bici-taxi.jpg",
    "./assets/img/carro-ambiental-home.jpg",
    "./assets/img/carro-electrico.jpg",
    "./assets/img/carro-paisaje.jpg",
    "./assets/img/carros-electricos-home.jpg",
    "./assets/img/estacionamiento-carro-electrico-home.jpg",
    "./assets/img/hombre-conduciendo.jpg",
    "./assets/img/Logo Eco-Ride 128x128.svg",
    "./assets/img/Logo Eco-Ride 256x256.svg",
    "./assets/img/Logo Eco-Ride 512x512.svg",
    "./assets/img/logo Eco-Ride.png",
    "./assets/img/recarga-carro-home.jpg",
    "./assets/img/taxi-electrico.jpg",
    "./dist/app.js",
    "./dist/auth-users.js",
    "./dist/routes.js",
    "./pages/404.html",
    "./pages/app-home.html",
    "./pages/contact.html",
    "./pages/driver.html",
    "./pages/faq.html",
    "./pages/home.html",
    "./pages/login.html",
    "./pages/prices.html",
    "./pages/services.html",
    "./styles/styles.css",
];
/**
 * ¿Qué hace el métoso self?
 * Verificar que los archivosexisten antes de guardarlos en cache
 * Almacenar en caché solo los archivos válidos
 * Activar el SW
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      /*console.log("Verificando archivos antes de cachear");*/
      const validFiles = (
        await Promise.all(
          FILES.map(async (file) => {
            try {
              const response = await fetch(file, { method: "HEAD" });
              if (response.ok) {
                /*console.log(`Archivo encontrado: ${file}`);*/
                return file;
              } else {
                /*console.warn(
                  `Archivo no encontrado: ${file} (Status: ${response.status})`
                );*/
              }
            } catch (error) {
              console.error(
                `Error al verificar el archivo: ${file} (Status: ${response.status})`
              );
            }
            return null;
          })
        )
      ).filter(Boolean);
      await cache.addAll(validFiles);
      /*console.log("Caché registrada con éxito");*/
      self.skipWaiting(); //Permite que el SW se active de Inmmediato
    })()
  );
});
/**
 * ¿Qué hace?
    1. Intercepta todas las perticiones de tipo fetch
    2. Si el recurso está en caché, lo devuelve sin acceder a la red
    3. Si no está en caché, lo descarga de la red
    4. Si falla devuelve error 503
*/
self.addEventListener("fetch", (event) => {
  /*console.log(`Interceptando petición:${event.request.url}`);*/
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch((error) => {
          return new Response("No hay conexión y el recurso no está en cache", {
            status: 503,
            statusText: "Servicio no disponible:" + error.message,
          });
        });
    })
  );
});

/**  Busca y elimina versiones antiguas de caché.
Usa self.clients.claim() para que el SW controle inmediatamente todas las pestañas abiertas. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // Filtra solo las cachés antiguas
          .map((name) => caches.delete(name)) // Las elimina
      );
      console.log("🗑 Cachés antiguas eliminadas");
    })()
  );

  self.clients.claim();
});
