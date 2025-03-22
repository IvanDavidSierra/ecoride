// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"


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


document.addEventListener('click', function(e) {
    const target = e.target;

    if(target && target.id === 'signUpButton') {
        e.preventDefault();
        console.log("Click en SignUp");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password-register").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const name = document.getElementById("names").value;
        const lastName = document.getElementById("lastNames").value;
    
        const auth = getAuth();
        const db = getFirestore();
    
        if(password !== confirmPassword){
            alert("Las contraseñas no coinciden");
            return;
        }else{  
            createUserWithEmailAndPassword(auth, email,password).then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    firstName : name,
                    lastName : lastName,
                    email: email
                };
                alert('Cuenta creada satisfactoriamente');
                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                if(errorCode == 'auth/email-alreday-in-use'){
                    alert('El correo electrónico ya está en uso');
                }
                else{
                    alert('No fue posible crear al usuario: '+error.message);
                }
            })
        }
    }
});



