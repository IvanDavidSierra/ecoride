const API = "http://localhost:8081/ecorideAPI";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

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
const db = getFirestore(app);
const userID = sessionStorage.getItem("noRememberUser") || localStorage.getItem("rememberUser");
let vehiculoConductor = null;

if (!userID) {
    console.error("No se encontró userID en sessionStorage o localStorage.");
} else {
    const userDocRef = doc(db, "EcoRideUsers", userID);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log("Datos del usuario:", userData);
    } else {
        console.error("No se encontró el documento en Firestore.");
    }
}

async function traerVehiculos() {
    console.trace("Ejecutando traerVehiculos...");
    const driverName = sessionStorage.getItem("userName") || localStorage.getItem("userName");
    const driverLastName = sessionStorage.getItem("userLastName") || localStorage.getItem("userLastName");
    const conductor = `${driverName} ${driverLastName}`;

    try {
        const response = await fetch(`${API}/getVehicles/${conductor}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Error al obtener los vehículos: ${response.status}`);

        const vehiculo = await response.json();
        console.log("Vehículos recibidos:", vehiculo);

        if (vehiculo.length === 0) {
            console.log("No hay vehículos disponibles.");
            return;
        }

        sessionStorage.setItem("vehiculoConductor",vehiculo.idVehicle);

    } catch (error) {
        console.error("Error al obtener los vehículos del conductor:", error);
    }
}

async function verViajesConductor(){
    const contenedorViajes = document.getElementById("viajesConductor");
    contenedorViajes.style.display = "block";
    const userRol = sessionStorage.getItem("userRol");
    const idViajeAceptado = sessionStorage.getItem("viajeAceptado"); 

    try {
        const response = await fetch(`${API}/getRides`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los viajes: ${response.status}`);
        }

        const viajes = await response.json();
        contenedorViajes.innerHTML = "<h2>Viajes disponibles</h2>";

        if (viajes.length === 0) {
            contenedorViajes.innerHTML += `<p>No hay viajes disponibles en este momento.</p>`;
            return;
        }

        for (const viaje of viajes) {
            if (!viaje.origen || !viaje.destino) {
                console.error(`El viaje con ID ${viaje.id} tiene datos inválidos.`);
                continue;
            }

            const viajeDiv = document.createElement("div");
            viajeDiv.classList.add("viajes");
            viajeDiv.innerHTML = `
                <p><strong>Origen:</strong> ${viaje.origen}</p>
                <p><strong>Destino:</strong> ${viaje.destino}</p>
                <p><strong>Pasajero:</strong> ${viaje.pasajero || "Desconocido"}</p>
                <p><strong>Distancia:</strong> ${viaje.distancia} Km</p>
                <button class="button-form" onclick="aceptarViaje(${viaje.idRides})">Aceptar viaje</button>
            `;
            contenedorViajes.appendChild(viajeDiv);

            // Mostrar mensaje solo si el conductor aceptó un viaje
            if (userRol === "conductor" && viaje.estado === "CONDUCTOR ASIGNADO" && viaje.idRides == idViajeAceptado) {
                document.querySelector(".viajeAceptado").style.display = "block";
                document.querySelector(".viajesConductor").style.display = "none";
            }
        }
    } catch (error) {
        console.error("❌ Error al obtener los viajes del conductor:", error);
    }
}

/* Primer viaje como pasajero */ 
async function registrarViajes(distancia, plan) {
    const nombrePlan = plan.nombre;
    const precioPlan = plan.precio;
    const origenGuardado = sessionStorage.getItem("origen");
    const destinoGuardado = sessionStorage.getItem("destino");

    const userName = sessionStorage.getItem("userName") || localStorage.getItem("userName");
    const userLastName = sessionStorage.getItem("userLastName") || localStorage.getItem("userLastName");
    const pasajero = `${userName} ${userLastName}`;

    console.log(nombrePlan, precioPlan, origenGuardado, destinoGuardado);

    const ride = {
        pasajero: pasajero,
        origen: origenGuardado,
        destino: destinoGuardado,
        distancia: Number(distancia),
        plan: String(nombrePlan),
        price: Number(precioPlan),
        estado: "SIN CONDUCTOR"
    };

    const rideSearchingMsg = document.getElementById("ride-searching");
    if (rideSearchingMsg) {
        rideSearchingMsg.style.display = "block";
    }
    try {
        const response = await fetch(`${API}/createRide`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ride)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(`Error al registrar el viaje: ${response.status} - ${result.message || "Verifica los datos"}`);
        }

        const result = await response.json();
        console.log("✅ Viaje registrado con éxito:", result);

        // Guardar ID del viaje del pasajero
        sessionStorage.setItem("viajePasajero", result.idRides);

    } catch (error) {
        console.error("❌ Error al registrar el viaje:", error);
    }
}

async function aceptarViaje(viajeId) {
    console.log(`✅ Aceptando viaje ID: ${viajeId}`);

    const conductor = `${sessionStorage.getItem("userName")} ${sessionStorage.getItem("userLastName")}`;
    const vehicleId = sessionStorage.getItem("vehiculoConductor");


    try {
        const response = await fetch(`${API}/updateRide/${viajeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conductor: conductor, tblVehicle: { idVehicle: Number(vehicleId) }, estado: "CONDUCTOR ASIGNADO" }),
        });

        if (!response.ok) throw new Error(`❌ Error al actualizar el viaje: ${response.status}`);

        sessionStorage.setItem("viajeAceptado", viajeId);

        verViajesConductor();
        verViajesPasajero(); // Actualiza la vista del pasajero

        console.log("✅ Viaje actualizado con éxito");

    } catch (error) {
        console.error("❌ Error al actualizar el viaje:", error);
    }
}

async function verViajesPasajero() {
    const idViajePasajero = sessionStorage.getItem("viajePasajero");
    const mensajePasajero = document.getElementById("ride-accept");
    const formMap = document.getElementById("formMap");
    const userRol = sessionStorage.getItem("userRol");

    if (!idViajePasajero) return; // Si el pasajero no ha solicitado un viaje, no hace nada.

    try {
        const response = await fetch(`${API}/getRides`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los viajes: ${response.status}`);
        }

        const viajes = await response.json();

        for (const viaje of viajes) {
            if (viaje.idRides == idViajePasajero && viaje.estado === "CONDUCTOR ASIGNADO" && userRol === "pasajero") {
                if (viaje.tblVehicle) {
                    const { conductor, modelo, placa, color, tblVehicleType } = viaje.tblVehicle;
                    const tipoVehiculo = tblVehicleType ? tblVehicleType.tipoVehiculo : "Desconocido";
    
                    mensajePasajero.innerHTML = `
                        <strong>¡${conductor} <p style="color: #000000"> ha aceptado tu viaje!</p> </strong><br>
                        <strong class="vehiculo">Vehículo:</strong> <p style="color: #000000"> ${modelo} (${color}) Placa: ${placa} </p><br>
                        <strong>Tipo de vehículo:</strong> <p style="color: #000000"> ${tipoVehiculo} </p>
                    `;
                    mensajePasajero.style.display = "flex";
                    formMap.style.display = "none";
                    return;
                } else {
                    console.error("No se encontró información del vehículo en el viaje.");
                }
            }
        }
    } catch (error) {
        console.error("❌ Error al verificar el estado del viaje del pasajero:", error);
    }
}

setInterval(verViajesPasajero, 1000);

function finViaje(){
    sessionStorage.removeItem("viajeAceptado");
    sessionStorage.removeItem("viajePasajero");
    document.querySelector(".viajeAceptado").style.display = "none";
    document.querySelector(".viajesConductor").style.display = "block";
}


window.aceptarViaje = aceptarViaje;
window.finViaje = finViaje;



export { registrarViajes, verViajesConductor, traerVehiculos };