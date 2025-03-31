// Firebase SDK e importaciones
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { Validation } from "./validationForms.js";

import { router } from "./app.js";

import { traerVehiculos } from "./rides.js";

const validation = new Validation();

const formValid = {
  nombres: false,
  apellidos: false,
  correo: false,
  contraseña: false,
  confirmarContraseña: false,
  terminos: false,
};

const firebaseConfig = {
  apiKey: "AIzaSyAk6_cZXUo-wW3TSx8O-maYEoBksqE3h8c",
  authDomain: "ecoride-406f2.firebaseapp.com",
  projectId: "ecoride-406f2",
  storageBucket: "ecoride-406f2.firebasestorage.app",
  messagingSenderId: "200769680993",
  appId: "1:200769680993:web:3630d9bdf6c8ac09385c20",
  measurementId: "G-BWK1P8VLPX",
};
const app = initializeApp(firebaseConfig);

// Cambiar clases
const cambiarClase = (element, isValid) => {
  element.classList.toggle("valid", isValid);
  element.classList.toggle("is-invalid", !isValid);
};

const mensajeExitoso = (isValid, errorElementId) => {
  const errorElement = document.getElementById(errorElementId);
  errorElement.style.display = isValid ? "block " : "none";
  errorElement.style.color = " #12E821";
  errorElement.style.fontSize = "10pt";
};

const mensajeError = (isValid, errorElementId) => {
  const errorElement = document.getElementById(errorElementId);
  const formBox = document.getElementById("form-box");
  errorElement.style.display = isValid ? "none" : "block";
  errorElement.style.color = "red";
  errorElement.style.fontSize = "10pt";
  formBox.style.height = "750px";
};

document.addEventListener("click", function (e) {
  const target = e.target;
  switch (target.id) {
    case "signUpButton":
      e.preventDefault();
      registerUsers();
      break;
    case "signInButton":
      e.preventDefault();
      loginUsers();
      break;
    case "forgotPassword":
      e.preventDefault();
      forgotPassword();
      break;
    case "logout":
      e.preventDefault();
      logout();
      break;
  }
});

function registerUsers() {
  const carga = document.getElementById("carga");
  carga.style.display = "block";

  const name = document.getElementById("names");
  const lastName = document.getElementById("lastNames");
  const email = document.getElementById("email");
  const password = document.getElementById("password-register");
  const confirmPassword = document.getElementById("confirm-password");
  const typeUser = document.getElementById("driver-check").checked;

  const terms = document.getElementById("terms");

  // Validación de campos
  formValid.nombres = validation.validNames(name.value);
  cambiarClase(name, formValid.nombres);
  mensajeError(formValid.nombres, "name-error");

  formValid.apellidos = validation.validNames(lastName.value);
  cambiarClase(lastName, formValid.apellidos);
  mensajeError(formValid.apellidos, "lastName-error");

  formValid.correo = validation.validMails(email.value);
  cambiarClase(email, formValid.correo);
  mensajeError(formValid.correo, "email-error");

  formValid.contraseña = validation.validPassword(password.value);
  cambiarClase(password, formValid.contraseña);
  mensajeError(formValid.contraseña, "password-error");

  formValid.confirmarContraseña = validation.validPassword(confirmPassword.value);
  const coincidencia = password.value === confirmPassword.value;
  if (formValid.confirmarContraseña && coincidencia) {
    cambiarClase(confirmPassword, true);
    mensajeError(true, "confirmPasswordError");
  } else {
    cambiarClase(confirmPassword, false);
    mensajeError(false, "confirmPasswordError");
  }

  formValid.terminos = terms.checked;
  cambiarClase(terms, formValid.terminos);
  mensajeError(formValid.terminos, "terms-error");

  if (!Object.values(formValid).every((val) => val === true)) {
    return;
  }

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        nameUser: name.value,
        lastNameUser: lastName.value,
        email: email.value,
        conductor: typeUser,
      };

      mensajeError(true, "systemError");
      mensajeError(true, "emailInUse"); 
      mensajeExitoso(true, "success");

      const docRef = doc(db, "EcoRideUsers", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          carga.style.display = "none";

          // Guardar usuario en sessionStorage
          sessionStorage.setItem("userName", userData.nameUser);
          sessionStorage.setItem("userLastName", userData.lastNameUser);
          sessionStorage.setItem("noRememberUser", user.uid);

          // Mostrar mensaje de bienvenida
          document.querySelector(".user-info h2").innerHTML =
            `¡Bienvenido, ${userData.nameUser} ${userData.lastNameUser}!`;

          // Redirección sin recargar la página
          setTimeout(() => {
            if (typeUser) {
              router.navigate("/auth-driver");
            } else {
              router.navigate("/app");
            }
          }, 800);
        })
        .catch(() => {
          carga.style.display = "none";
          mensajeError(false, "systemError");
        });
    })
    .catch((error) => {
      carga.style.display = "none";
      if (error.code === "auth/email-already-in-use") {
        mensajeError(false, "emailInUse");
      } else {
        mensajeError(false, "systemError");
      }
    });
}

async function loginUsers() {
  const emailInput = document.querySelector("#mailLogin");
  const passwordInput = document.querySelector("#passwordLogin");
  const rememberMe = document.querySelector("#remember").checked;
  const carga = document.getElementById("carga");

  carga.style.display = "block";

  const auth = getAuth();
  const db = getFirestore();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    const user = userCredential.user;
    carga.style.display = "none";


    // Obtener datos del usuario desde Firestore
    const userRef = doc(db, "EcoRideUsers", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

    // Guardar sesión en localStorage o sessionStorage
    if (rememberMe) {
      localStorage.setItem("rememberMeUser", user.uid);
      localStorage.setItem("userName", userData.nameUser);
      localStorage.setItem("userLastName", userData.lastNameUser);
      if(userData.conductor === true){
        localStorage.setItem("userRol", "conductor");
      }else{
        localStorage.setItem("userRol", "pasajero");
      }
    } else {
      sessionStorage.setItem("noRememberUser", user.uid);
      sessionStorage.setItem("userName", userData.nameUser);
      sessionStorage.setItem("userLastName", userData.lastNameUser);
      if(userData.conductor === true){
        sessionStorage.setItem("userRol", "conductor");
      }else{
        sessionStorage.setItem("userRol", "pasajero");
      }
    }

      // Mensajes de éxito
        mensajeError(true, "credentials");
        mensajeError(true, "noCredentials");
        cambiarClase(emailInput, true);
        cambiarClase(passwordInput, true);
        mostrarMensaje(true, "successLogin", emailInput, passwordInput);

      // Mostrar mensaje de bienvenida
      document.querySelector(".user-info h2").innerHTML =
        `¡Bienvenido, ${userData.nameUser} ${userData.lastNameUser}!`;

      // Redirección según el tipo de usuario
      setTimeout(() => {
        if (userData.conductor) {
          router.navigate("/app");
        } else {
          router.navigate("/app");
        }
      }, 500);
    } else {
      console.log("Usuario no encontrado en Firestore");
    }
  } catch (error) {
    carga.style.display = "none";
    if (error.code === "auth/invalid-credential") {
      mensajeError(true, "noCredentials");
    } else {
      mensajeError(true, "credentials");
    }
  }
}

function mostrarMensaje(isValid, tipo, emailInput, passwordInput) {
  if (isValid) {
    mensajeExitoso(true, tipo);
  } else {
    cambiarClase(emailInput, false);
    cambiarClase(passwordInput, false);
    mensajeError(false, tipo);
  }
}

function logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Eliminar toda la información de sesión
      localStorage.removeItem("rememberMeUser");
      localStorage.removeItem("userName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userRol");

      sessionStorage.removeItem("noRememberUser");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userLastName");
      sessionStorage.removeItem("userRol");
      sessionStorage.removeItem("origen");
      sessionStorage.removeItem("destino");

      // Limpiar la interfaz
      document.querySelector(".user-info h2").innerHTML = "";
      
      // Redirigir al usuario
      router.navigate("/");
      location.reload(true);
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
}




/*function forgotPassword(){
    const email = document.querySelector("#mailLogin").value;
    forgotPassword.addEventListener("click", function() {
      const email = emailInput.value.trim();
    
      if (email === "") {
        alert("Por favor ingresa tu correo electrónico para recuperar la contraseña.");
        return;
      }
    
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("Te hemos enviado un enlace para restablecer tu contraseña al correo proporcionado.");
        })
        .catch((error) => {
          console.error("Error al enviar el correo de restablecimiento:", error);
          if (error.code === "auth/invalid-email") {
            alert("El correo ingresado no es válido.");
          } else if (error.code === "auth/user-not-found") {
            alert("No existe una cuenta con este correo.");
          } else {
            alert("Error al enviar el correo de restablecimiento.");
          }
        });
    });
  }*/
