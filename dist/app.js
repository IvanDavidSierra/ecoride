import  { navegadorPag } from "./routes.js";

class App {
  constructor() {
    this.init();
  }

  init() {
    console.log("Aplicación iniciada");
    this.registerEvents();
  }

  registerEvents() {
    // Aquí puedes registrar eventos globales si los necesitas
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM cargado");
      navegadorPag(location.pathname); // Carga la página correcta al iniciar
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navegadorPag(e.target.href);
      }
    });
  }
}

export default new App();