"use strict";
// funcion autoinvocada

(() => {
  const btnAumentar = document.querySelector("#aumentarFuente");
  const btnDisminuir = document.querySelector("#disminuirFuente");
  const btnContraste = document.querySelector("#contraste");

  let tamFuente = 16;
  let contrasteActivo = false;

  if (btnAumentar && btnDisminuir && btnContraste) {
    btnAumentar.addEventListener("click", () => {
      if (tamFuente <= 34) {
        tamFuente += 1; //tamFuente = tamFuente + 1;
        document.body.style.fontSize = `${tamFuente}px`;
        document.forms.sytle.fontSize = `${tamFuente}px`;
      }
    });

    btnDisminuir.addEventListener("click", () => {
      if (tamFuente >= 14) {
        tamFuente -= 1;
        document.body.style.fontSize = `${tamFuente}px`;
      }
    });

    btnContraste.addEventListener("click", () => {
      contrasteActivo = !contrasteActivo;
      document.body.classList.toggle("modo-contraste", contrasteActivo);
    });
  }
})();
