async function fetchWeather() {
    try {
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        const data = json.data;

        // Temperatura (Outdoor)
        if (data.outdoor && data.outdoor.temperature) {
            document.getElementById('temp').innerText = `${data.outdoor.temperature.value}°C`;
            document.getElementById('hum').innerText = `${data.outdoor.humidity.value}%`;
        }

        // Viento
        if (data.wind && data.wind.wind_speed) {
            document.getElementById('wind').innerText = `${data.wind.wind_speed.value} km/h`;
        }

        // Presión Relativa
        if (data.pressure && data.pressure.relative) {
            document.getElementById('press').innerText = `${data.pressure.relative.value} hPa`;
        }

        // Lluvia 24h (Uso de corchetes obligatorio por empezar con número)
        if (data.rainfall && data.rainfall['24h']) {
            document.getElementById('rain').innerText = `${data.rainfall['24h'].value} mm`;
        }

        // Hora
        const lastUpdate = new Date(json.time * 1000);
        document.getElementById('time').innerText = lastUpdate.toLocaleTimeString('es-AR', {
            hour: '2-digit', 
            minute:'2-digit'
        });

        document.getElementById('loader').style.display = 'none';
        document.getElementById('weather-content').style.display = 'block';

    } catch (error) {
        console.error("Error detallado:", error);
        document.getElementById('loader').innerText = "Error al leer datos del sensor";
    }
}

document.addEventListener('DOMContentLoaded', fetchWeather);
