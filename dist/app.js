
//Agrega efecto en la navbar al momento de desplazarnos de manera lateral 
window.addEventListener("scroll", function(){
  var navBar = document.getElementById("navbar");
  navBar.classList.toggle("sticky", this.window.scrollY > 0);
})

//Definicion de rutas
const routes = {
  "/": "./pages/home.html",
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

