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
        // Si viene en mph, convertimos a km/h
        let windVal = parseFloat(data.wind.wind_speed.value);
        if (data.wind.wind_speed.unit === "mph") {
            windVal = windVal * 1.60934;
        }
        document.getElementById('wind').innerText = `${windVal.toFixed(1)} km/h`;

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
