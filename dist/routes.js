const bodyApp = document.getElementById("app");
export const navegadorPag = (url) =>{
    //Añadir animación de fade out
    bodyApp.classList.add("fade-out");

    setTimeout(() => {
        history.pushState(null, null, url);
        router();

        //Añadir clases para animación de entrada
        bodyApp.classList.remove("fade-out");
        bodyApp.classList.add("fade-in");

        setTimeout(() => bodyApp.classList.remove("fade-in"),500);
    }, 300);
};

//Creacion de router para navegación de páginas

const router = async () => {
    const routes ={
        "/" : "../pages/home.html",
        "/services" : "../pages/services.html",
        "/driver" : "../pages/driver.html",
        "/prices" : "../pages/prices.html",
        "/faq" : "../pages/faq.html",
        "/login" : "../pages/login.html",
        "/contact" : "../pages/contact.html"
    };

    const rutaActual = routes[location.pathname];
    
    if(rutaActual){
        try {
            const respuesta = await fetch(rutaActual);
            if(respuesta.ok){
                const html = await respuesta.text();
                bodyApp.innerHTML = html;
            }else{
                const notFoundPage = await fetch("../pages/404.html");
                const html = await notFoundPage.text();
                bodyApp.innerHTML = html;
            }
        }catch (error){
            const notFoundPage = await fetch("../pages/404.html");
            const html = await notFoundPage.text();
            bodyApp.innerHTML = html;
        }
    }
};


document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if(e.target.matches("[data-link]")){
            e.preventDefault();
            navegadorPag(e.target.href);
        }
    });
    router();
});

window.addEventListener("popstate", () => {
    router();
});