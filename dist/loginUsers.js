// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');

    form.addEventListener('submit', (e) => {
        const target = e.target;
  
        if(target && target.id === 'signInButton') {
            e.preventDefault();
            console.log("Click en SignIn");
  
            const email = document.querySelector("#mailLogin").value;
            const password = document.querySelector("#passwordLogin").value;
  
            const auth = getAuth();
  
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert('Login satisfactorio');
                const user = userCredential.user;
                if(rememberMe){
                    localStorage.setItem('loggedInUserId', user.uid);
                }
                alert('Logueo satisfactorio');
            })
            .catch((error) => {
                const errorCode = error.code;
                if(errorCode === 'auth/invalid-credential'){
                    alert('Contraseña incorrecta');
                }else{
                    alert('No fue posible iniciar sesión: '+error.message);
                }
            });
        }
  
    });
  
});