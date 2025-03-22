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
<<<<<<< HEAD
  const formBox = document.querySelector('.form-box');
  if (formBox) {
      formBox.classList.add('login-active');
      formBox.classList.remove('signup-active');
=======
  const formBox = document.querySelector(".form-box");
  if (formBox) { // Siempre verificar si existe
    formBox.classList.add("login-active");
    formBox.classList.remove("signup-active");
>>>>>>> 53596ce491dd816d74fe4f8a1a2d4184e01c853c
  }
}

function showSignup() {
<<<<<<< HEAD
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
=======
  const formBox = document.querySelector(".form-box");
  if (formBox) { // Verificación extra
    formBox.classList.add("signup-active");
    formBox.classList.remove("login-active");
  }
}
>>>>>>> 53596ce491dd816d74fe4f8a1a2d4184e01c853c
