async function fetchWeather() {
    try {
        // El t=${new Date().getTime()} evita que el navegador guarde una versión vieja en cache
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        const data = json.data;

        // --- TEMPERATURA ---
        let tempVal = parseFloat(data.outdoor.temperature.value);
        if (data.outdoor.temperature.unit === "ºF") {
            tempVal = (tempVal - 32) * 5 / 9;
        }
        document.getElementById('temp').innerText = tempVal.toFixed(1);
        document.getElementById('hum').innerText = data.outdoor.humidity.value;

        // --- VIENTO ---
        const vientoSostenido = parseFloat(data.wind.wind_speed.value);
        const rafaga = parseFloat(data.wind.wind_gust.value);
        const grados = parseInt(data.wind.wind_direction.value);

        // Convertir grados a puntos cardinales
        const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        const indice = Math.round(grados / 22.5) % 16;
        const puntoCardinal = direcciones[indice];

        document.getElementById('wind').innerText = vientoSostenido.toFixed(1);
        document.getElementById('gust').innerText = `Ráfagas: ${rafaga.toFixed(1)} km/h`;
        document.getElementById('wind-dir').innerText = `Dirección: ${puntoCardinal} (${grados}°)`;

        // --- PRESIÓN ---
        let pressVal = parseFloat(data.pressure.relative.value);
        if (data.pressure.relative.unit === "inHg") {
            pressVal = pressVal * 33.8639;
        }
        document.getElementById('press').innerText = pressVal.toFixed(1);

        // --- LLUVIA ---
        let rainVal = parseFloat(data.rainfall.daily.value);
        if (data.rainfall.daily.unit === "in") {
            rainVal = rainVal * 25.4;
        }
        document.getElementById('rain').innerText = rainVal.toFixed(1);

        // --- HORA (Forzando Argentina) ---
        const lastUpdate = new Date(json.time * 1000);
        const horaFormateada = lastUpdate.toLocaleTimeString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        document.getElementById('time').innerText = horaFormateada;

        // --- CONTROL DE VISIBILIDAD ---
        // Si usas el HTML de tarjetas que te pasé, el "status" reemplaza al loader
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.innerText = "Datos en tiempo real";

    } catch (error) {
        console.error("Error cargando el clima:", error);
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.innerText = "Error al cargar datos";
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', fetchWeather);
