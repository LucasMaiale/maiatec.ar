async function fetchWeather() {
    try {
        // El "?t=" ayuda a saltar el caché de GitHub Pages
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        
        const data = json.data;

        // Mapeo de datos (Ajustado a estructura Ecowitt v3)
        document.getElementById('temp').innerText = `${data.outdoor.temperature.value}°C`;
        document.getElementById('hum').innerText = `${data.outdoor.humidity.value}%`;
        document.getElementById('wind').innerText = `${data.wind.wind_speed.value} km/h`;
        document.getElementById('press').innerText = `${data.pressure.relative.value}`;
        document.getElementById('rain').innerText = `${data.rainfall.daily.value}`;
        
        // Hora de la estación
        const lastUpdate = new Date(json.time * 1000);
        document.getElementById('time').innerText = lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Interfaz
        document.getElementById('loader').style.display = 'none';
        document.getElementById('weather-content').style.display = 'block';

    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById('loader').innerText = "Estación fuera de línea";
    }
}

document.addEventListener('DOMContentLoaded', fetchWeather);
