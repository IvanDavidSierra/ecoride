import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { router } from "./app.js";

const db = getFirestore();

document.addEventListener("click", function (e) {
    if (e.target.id === "type-vehicle") {
        const authBox = document.querySelector(".auth-driver-box");
        const planElement = document.getElementById("plan");
        const priceElement = document.getElementById("pricePlan");
        const inputPlaca = document.getElementById("placa");

        const selectedValue = e.target.value;
        let plan = "";
        let price = "";

        switch (selectedValue) {
            case "1":
                plan = "Basic";
                price = "2,000";
                authBox.style.display = "flex";
                planElement.textContent = plan;
                priceElement.textContent = `Tus viajes tendrán un precio fijo de: COP $${price}`;
                inputPlaca.disabled = true;
                break;
            case "2":
                plan = "Silver";
                price = "4,000";
                authBox.style.display = "flex";
                planElement.textContent = plan;
                priceElement.textContent = `Tus viajes tendrán un precio fijo de: COP $${price}`;
                inputPlaca.disabled = true;
                break;
            case "3":
                plan = "Gold";
                price = "10,000";
                planElement.textContent = plan;
                priceElement.textContent = `Tus viajes tendrán un precio fijo de: COP $${price}`;
                authBox.style.display = "flex";
                inputPlaca.required = true;
                inputPlaca.disabled = false;
                break;
            default:
                authBox.style.display = "none";
                return;
        }
        e.target.setAttribute("data-selected", selectedValue);
    }

    if (e.target.id === "crearVehiculo") {
        e.preventDefault();
        const userId = sessionStorage.getItem("noRememberUser");
        const typeVehicleElement = document.getElementById("type-vehicle");
        const selectedValue = typeVehicleElement.getAttribute("data-selected") || typeVehicleElement.value;
        crearVehiculo(selectedValue, userId);
    }
});

async function crearVehiculo(selectedValue, userID) {
    try {
        const userDocRef = doc(db, "EcoRideUsers", userID);
        const docSnapshot = await getDoc(userDocRef);

        if (!docSnapshot.exists()) {
            console.log("No se encontró el documento en Firestore.");
            return;
        }

        const userData = docSnapshot.data();
        console.log("Datos del usuario:", userData);

        const data = {
            "conductor": userData.nameUser + userData.lastNameUser,
            "modelo": document.getElementById("modelo").value,
            "placa": document.getElementById("placa").value,
            "color": document.getElementById("color").value,
            "tblVehicleType": {
                "idVehicleType": parseInt(selectedValue)
            }
        };

        console.log("Enviando datos:", data);

        // Realizar la solicitud POST
        const response = await fetch("http://localhost:8081/ecorideAPI/createVehicle", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        console.log("Vehículo creado exitosamente");
        router.navigate("/app");

    } catch (error) {
        console.error("Error al crear el vehículo:", error);
        alert("Hubo un error al crear el vehículo.");
    }
}



