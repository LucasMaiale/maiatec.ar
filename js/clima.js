async function fetchWeather() {
    try {
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        const data = json.data;

        // --- TEMPERATURA ---
        // Si el JSON viene en ºF, lo convertimos a ºC manualmente por seguridad
        let tempVal = parseFloat(data.outdoor.temperature.value);
        if (data.outdoor.temperature.unit === "ºF") {
            tempVal = (tempVal - 32) * 5 / 9;
        }
        document.getElementById('temp').innerText = `${tempVal.toFixed(1)}°C`;
        document.getElementById('hum').innerText = `${data.outdoor.humidity.value}%`;


        // --- VIENTO ---
        const vientoSostenido = parseFloat(data.wind.wind_speed.value);
        const rafaga = parseFloat(data.wind.wind_gust.value);
        const grados = parseInt(data.wind.wind_direction.value);

        // Convertir grados a puntos cardinales (N, S, E, O)
        const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        const indice = Math.round(grados / 22.5) % 16;
        const puntoCardinal = direcciones[indice];

        // Mostrar en el HTML
        document.getElementById('wind').innerText = `${vientoSostenido.toFixed(1)} km/h`;
        document.getElementById('gust').innerText = `Ráfagas: ${rafaga.toFixed(1)} km/h`;
        document.getElementById('wind-dir').innerText = `Dirección: ${puntoCardinal} (${grados}°)`;
        

        // --- PRESIÓN ---
        // Si viene en inHg, convertimos a hPa (estándar SMN)
        let pressVal = parseFloat(data.pressure.relative.value);
        if (data.pressure.relative.unit === "inHg") {
            pressVal = pressVal * 33.8639;
        }
        document.getElementById('press').innerText = `${pressVal.toFixed(1)} hPa`;
        // --- LLUVIA ---
        // Usamos "daily" ya que tu JSON no trae "24h"
        let rainVal = parseFloat(data.rainfall.daily.value);
        if (data.rainfall.daily.unit === "in") {
            rainVal = rainVal * 25.4;
        }
        document.getElementById('rain').innerText = `${rainVal.toFixed(1)} mm`;

        // --- HORA ---
        const lastUpdate = new Date(json.time * 1000);
        document.getElementById('time').innerText = lastUpdate.toLocaleTimeString('es-AR', {
            hour: '2-digit', 
            minute:'2-digit'
        });

        document.getElementById('loader').style.display = 'none';
        document.getElementById('weather-content').style.display = 'block';

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('loader').innerText = "Error en formato de datos";
    }
}

document.addEventListener('DOMContentLoaded', fetchWeather);
