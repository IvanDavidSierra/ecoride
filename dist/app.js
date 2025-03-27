
//Definicion de rutas
const routes = {
  "/": "./pages/home.html",
  "/index.html": "./pages/home.html",
  "/index.html": "./pages/home.html",
  "/services": "./pages/services.html",
  "/driver": "./pages/driver.html",
  "/prices": "./pages/prices.html",
  "/carrera": "./pages/carrera.html",
  "/faq": "./pages/faq.html",
  "/auth-user": "./pages/auth-users.html",
  "/contact": "./pages/contact.html",
  "/404": "./pages/404.html",
  "/app" : "./pages/app-home.html",
};

//Creacion del objeto
const router = new Router(routes);

//Agrega efecto en la navbar al momento de desplazarnos de manera lateral
window.addEventListener("scroll", function () {
  var navBar = document.getElementById("navbar");
  navBar.classList.toggle("sticky", this.window.scrollY > 0);
});

function showLogin() {
  const formBox = document.querySelector('.form-box');
  formBox.classList.add('login-active');
  formBox.classList.remove('signup-active');
}

function showSignup() {
  const formBox = document.querySelector('.form-box');
  formBox.classList.add('signup-active');
  formBox.classList.remove('login-active');
}

function toggleProfileMenu(){
  if (localStorage.getItem("rememberMeUser") || sessionStorage.getItem("noRememberUser")){
    const profileBox = document.getElementById("subMenu");
    profileBox.classList.toggle("open-menu");
  }else{
    const noProfileBox = document.getElementById("subMenuNoAccount");
    noProfileBox.classList.toggle("open-menu");
    noProfileBox.style.display = "block";
  }
}



