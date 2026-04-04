async function fetchWeather() {
    try {
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        
        const data = json.data;

        // --- Mapeo de Datos Estilo SMN ---
        
        // Temperatura y Humedad
        document.getElementById('temp').innerText = `${Math.round(data.outdoor.temperature.value)}°C`;
        document.getElementById('hum').innerText = `${data.outdoor.humidity.value}%`;
        
        // Viento (Ecowitt devuelve km/h si lo configuraste así, o m/s por defecto)
        document.getElementById('wind').innerText = `${data.wind.wind_speed.value} km/h`;
        
        // Presión Atmosférica (Hecto pascales - hPa)
        // Usamos la presión RELATIVA que es la referencia oficial
        document.getElementById('press').innerText = `${data.pressure.relative.value} hPa`;
        
        // Lluvia de las últimas 24 Horas
        // Nota: data.rainfall.24h.value es el acumulado móvil de las últimas 24hs
        document.getElementById('rain').innerText = `${data.rainfall['24h'].value} mm`;
        
        // Hora de la última lectura
        const lastUpdate = new Date(json.time * 1000);
        document.getElementById('time').innerText = lastUpdate.toLocaleTimeString('es-AR', {
            hour: '2-digit', 
            minute:'2-digit'
        });

        document.getElementById('loader').style.display = 'none';
        document.getElementById('weather-content').style.display = 'block';

    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById('loader').innerText = "Estación fuera de línea";
    }
}

document.addEventListener('DOMContentLoaded', fetchWeather);
