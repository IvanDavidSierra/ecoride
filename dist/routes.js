import { initMap } from "./map.js";


export class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener("DOMContentLoaded", () => this.handleRoute());
    window.addEventListener("hashchange", () => this.handleRoute());

    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-link]");
      if (target) {
        e.preventDefault();
        this.navigate(target.getAttribute("href"));
      }
    });
  }

  navigate(url) {
    window.location.hash = url; 
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || "/";
    const route = this.routes[hash] || this.routes["/404"];
    const app = document.getElementById("app");

    try {
      const response = await fetch(route, { cache: "no-cache" });
      if (response.ok) {
        const html = await response.text();
        app.innerHTML = html;
        app.classList.add("transition");

        if (hash === "/app") {
          initMap();
        }

        const noProfileBox = document.getElementById("subMenuNoAccount");
        const accountBox = document.getElementById("subMenu");
        
        if (noProfileBox){
          noProfileBox.classList.remove("open-menu");
        }
        if (accountBox){
          accountBox.classList.remove("open-menu");
        }

        setTimeout(() => {
          app.classList.remove("transition");
        }, 700);
      } else {
        this.navigate("/404");
      }
    } catch (error) {
      console.error("Error al cargar la página:", error);
      this.navigate("/404");
    }
  }
}
