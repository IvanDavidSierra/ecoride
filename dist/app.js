//Definicion de rutas
const routes = {
  "/": "./pages/home.html",
  "/index.html": "./pages/home.html",
  "/services": "./pages/services.html",
  "/driver": "./pages/driver.html",
  "/prices": "./pages/prices.html",
  "/faq": "./pages/faq.html",
  "/login": "./pages/login.html",
  "/contact": "./pages/contact.html",
  "/404": "./pages/404.html",
};

//Creacion del objeto
const router = new Router(routes);

//Agrega efecto en la navbar al momento de desplazarnos de manera lateral
window.addEventListener("scroll", function () {
  var navBar = document.getElementById("navbar");
  navBar.classList.toggle("sticky", this.window.scrollY > 0);
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("showLogin");
  const signupBtn = document.getElementById("showSignup");

  loginBtn.addEventListener("click", showLogin);
  signupBtn.addEventListener("click", showSignup);
});

function showLogin() {
  const formBox = document.querySelector(".form-box");
  if (formBox) { // Siempre verificar si existe
    formBox.classList.add("login-active");
    formBox.classList.remove("signup-active");
  }
}

function showSignup() {
  const formBox = document.querySelector(".form-box");
  if (formBox) { // Verificación extra
    formBox.classList.add("signup-active");
    formBox.classList.remove("login-active");
  }
}
