//Definicion de rutas
const routes = {
  "/": "./pages/home.html",
  "/index.html": "./pages/home.html",
  "/services": "./pages/services.html",
  "/driver": "./pages/driver.html",
  "/prices": "./pages/prices.html",
  "/carrera": "./pages/carrera.html",
  "/faq": "./pages/faq.html",
  "/login": "./pages/login.html",
  "/contact": "./pages/contact.html",
  "/404": "./pages/404.html",
};

//Creacion del objeto
const router = new Router(routes);

//Agrega efecto en la navbar al momento de desplazarnos de manera lateral 
window.addEventListener("scroll", function(){
  var navBar = document.getElementById("navbar");
  navBar.classList.toggle("sticky", this.window.scrollY > 0);
})

function showLogin() {
  const formBox = document.querySelector('.form-box');
  if (formBox) {
      formBox.classList.add('login-active');
      formBox.classList.remove('signup-active');
  }
}

function showSignup() {
  const formBox = document.querySelector('.form-box');
  if (formBox) {
      formBox.classList.add('signup-active');
      formBox.classList.remove('login-active');
  }
}

// Mostrar el formulario de inicio de sesión por defecto al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  showLogin();
});
