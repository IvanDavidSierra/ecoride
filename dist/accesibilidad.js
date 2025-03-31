"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const aumentarBtn = document.getElementById('aumentarFuente');
    const disminuirBtn = document.getElementById('disminuirFuente');
    const contrasteBtn = document.getElementById('contraste');
    
    // Configuración
    const config = {
        escalado: {
            min: 0.8,    // Escala mínima (80%)
            max: 1.5,    // Escala máxima (150%)
            paso: 0.1,   // Incremento por clic
            selectores: 'p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, label, .escalar-texto'
        }
    };

    let escala = localStorage.getItem('escalaFuente') ? parseFloat(localStorage.getItem('escalaFuente')) : 1;
    let contrasteActivo = localStorage.getItem('modoContraste') === 'true';
    
    aplicarEscalaTexto(escala);
    aplicarModoContraste(contrasteActivo);

    function aplicarEscalaTexto(nuevaEscala) {
        // Seleccionar elementos a modificar
        const elementosTexto = document.querySelectorAll(config.escalado.selectores);
        
        elementosTexto.forEach(elemento => {
            const estilos = window.getComputedStyle(elemento);
            const fontSizeOriginal = estilos.getPropertyValue('font-size');
            
            if (fontSizeOriginal !== '0px') {
                const tamañoNumerico = parseFloat(fontSizeOriginal);
                const unidad = fontSizeOriginal.match(/[a-z]+|%$/)[0] || 'px';
                elemento.style.fontSize = (tamañoNumerico * nuevaEscala) + unidad;
            }
        });
        
        localStorage.setItem('escalaFuente', nuevaEscala);
        console.log('Escala actual:', escala); // Para depuración
    }

    function aplicarModoContraste(activar) {
        if (activar) {
            document.body.classList.add('modo-contraste');
        } else {
            document.body.classList.remove('modo-contraste');
        }
        localStorage.setItem('modoContraste', activar);
    }

    // Controladores de eventos
    aumentarBtn.addEventListener('click', () => {
        if (escala < config.escalado.max) {
            escala += config.escalado.paso;
            aplicarEscalaTexto(escala);
        }
    });

    disminuirBtn.addEventListener('click', () => {
        if (escala > config.escalado.min) {
            escala -= config.escalado.paso;
            aplicarEscalaTexto(escala);
        }
    });

    contrasteBtn.addEventListener('click', () => {
        contrasteActivo = !contrasteActivo;
        aplicarModoContraste(contrasteActivo);
    });
});
