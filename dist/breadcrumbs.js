// breadcrumbs.js - Sistema de migas de pan mejorado para EcoRide
document.addEventListener('DOMContentLoaded', function() {
  // Función para actualizar las migas de pan basado en la URL actual
  function updateBreadcrumbs() {
    const currentPath = window.location.pathname;
    const breadcrumbsContainer = document.querySelector('.breadcrumbs');
    
    // Limpiar las migas de pan existentes
    breadcrumbsContainer.innerHTML = '';
    
    // Objeto con las rutas y sus nombres correspondientes
    const routes = {
      '/': 'Inicio',
      '/services': 'Servicios',
      '/driver': 'Conduce',
      '/prices': 'Precios',
      '/app': 'Pedir servicio',
      '/auth-user': 'Registro/Login',
      '/faq': 'Preguntas Frecuentes',
      '/contact': 'Contacto'
    };
    
    // Agregar "Inicio" como primer elemento siempre
    const homeLi = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.setAttribute('href', '/');
    homeLink.setAttribute('data-link', '');
    homeLink.textContent = 'Inicio';
    homeLi.appendChild(homeLink);
    breadcrumbsContainer.appendChild(homeLi);
    
    // Si estamos en la página de inicio, solo mostramos "Inicio" pero como página actual
    if (currentPath === '/' || currentPath === '') {
      // Agregar separador
      const separatorLi = document.createElement('li');
      separatorLi.className = 'separator';
      separatorLi.textContent = '/';
      breadcrumbsContainer.appendChild(separatorLi);
      
      // Agregar página actual
      const currentPageLi = document.createElement('li');
      currentPageLi.className = 'current-page';
      currentPageLi.textContent = 'Inicio';
      breadcrumbsContainer.appendChild(currentPageLi);
      return;
    }
    
    // Construir las migas de pan basado en la ruta actual
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    let currentRouteLink = '';
    
    pathSegments.forEach((segment, index) => {
      currentRouteLink += '/' + segment;
      
      // Agregar separador
      const separatorLi = document.createElement('li');
      separatorLi.className = 'separator';
      separatorLi.textContent = '/';
      breadcrumbsContainer.appendChild(separatorLi);
      
      const segmentLi = document.createElement('li');
      
      // Si es el último segmento, es la página actual
      if (index === pathSegments.length - 1) {
        segmentLi.className = 'current-page';
        segmentLi.textContent = routes[currentRouteLink] || capitalizeFirstLetter(segment);
      } else {
        // Si no es el último, es un enlace
        const segmentLink = document.createElement('a');
        segmentLink.setAttribute('href', currentRouteLink);
        segmentLink.setAttribute('data-link', '');
        segmentLink.textContent = routes[currentRouteLink] || capitalizeFirstLetter(segment);
        segmentLi.appendChild(segmentLink);
      }
      
      breadcrumbsContainer.appendChild(segmentLi);
    });
    
    // Hacer que el contenedor de migas de pan sea visible
    document.querySelector('.breadcrumbs-container').style.display = 'block';
  }
  
  // Función para capitalizar la primera letra de un string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
  }
  
  // Actualizar las migas de pan inicialmente
  updateBreadcrumbs();
  
  // Para una SPA (Single Page Application), escuchar cambios en las rutas
  // 1. Para enlaces con data-link
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-link]')) {
      setTimeout(updateBreadcrumbs, 50); // Pequeño retraso para asegurar que la URL ha cambiado
    }
  });
  
  // 2. Para navegación con los botones de atrás/adelante del navegador
  window.addEventListener('popstate', function() {
    updateBreadcrumbs();
  });
  
  // 3. Para cuando el contenido de la página cambia (importante en SPAs)
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const observer = new MutationObserver(function() {
      updateBreadcrumbs();
    });
    
    observer.observe(appContainer, { childList: true });
  }
});