class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener("DOMContentLoaded", () =>
      this.handleRoute(location.pathname)
    );
    window.addEventListener("popstate", () =>
      this.handleRoute(location.pathname) //Verifica la ruta o url
    );

    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-link]");
      if (target) {
        e.preventDefault();
        this.navigate(target.getAttribute("href"));
      }
    });
  }

  navigate(url) {
    const app = document.getElementById("app");
    app.classList.add("fade-out");

     //funcion para reedirigir a la parte de arriba de la página
     window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      history.pushState({}, "", url);
      this.handleRoute(url);

    }, 500);
  }

  async handleRoute(url) {
    const route = this.routes[url] || this.routes["/404"];
    const app = document.getElementById("app");

    try {
      const response = await fetch(route, { cache: "no-cache" });
      if (response.ok) {
        const html = await response.text();
        app.innerHTML = html;

        // Quitar clase fade-out y añadir transición
        app.classList.remove("fade-out");
        app.classList.add("transition");

        setTimeout(() => {
          app.classList.remove("transition");
        }, 700); // Duración de la animación fadeIn
      } else {
        this.handleRoute("/404");
      }
    } catch (error) {
      console.error("Error al cargar la página:", error);
      this.handleRoute("/404");
    }
  }
}

