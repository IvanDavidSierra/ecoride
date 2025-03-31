import { Router } from "./routes.js";
//Definicion de rutas
const routes = {
  "/": "/pages/home.html",
  "/index.html": "/pages/home.html",
  "/services": "/pages/services.html",
  "/driver": "/pages/driver.html",
  "/prices": "/pages/prices.html",
  "/faq": "/pages/faq.html",
  "/auth-user": "/pages/auth-users.html",
  "/contact": "/pages/contact.html",
  "/404": "/pages/404.html",
  "/app" : "/pages/app-home.html",
  "/auth-driver" : "/pages/auth-driver.html",
};

//Creacion del objeto
export const router = new Router(routes);

document.addEventListener("DOMContentLoaded", () => {
  router.init();
  
  const name = sessionStorage.getItem("userName") || localStorage.getItem("userName");
  const lastName = sessionStorage.getItem("userLastName") || localStorage.getItem("userLastName");

  if (name && lastName) {
    const userInfo = document.querySelector(".user-info h2");
    if (userInfo) {
      userInfo.innerHTML = `¡Bienvenido, ${name} ${lastName}!`;
    }
  }
});

//Agrega efecto en la navbar al momento de desplazarnos de manera lateral
window.addEventListener("scroll", function () {
  let navBar = document.getElementById("navbar");
  navBar.classList.toggle("sticky", this.window.scrollY > 0);
});

window.showLogin = function () {
  const formBox = document.querySelector('.form-box');
  formBox.classList.add('login-active');
  formBox.classList.remove('signup-active');
};

window.showSignup = function () {
  const formBox = document.querySelector('.form-box');
  formBox.classList.add('signup-active');
  formBox.classList.remove('login-active');
};

window.toggleProfileMenu = function () {
  if (localStorage.getItem("rememberMeUser") || sessionStorage.getItem("noRememberUser")) {
    const profileBox = document.getElementById("subMenu");
    profileBox.classList.toggle("open-menu");
  } else {
    const noProfileBox = document.getElementById("subMenuNoAccount");
    noProfileBox.classList.toggle("open-menu");
    noProfileBox.style.display = "block";
  }
};







