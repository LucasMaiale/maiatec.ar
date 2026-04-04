async function initWeather() {
    const statusEl = document.getElementById('weather-status');
    const containerEl = document.getElementById('weather-display');

    try {
        // Agregamos un timestamp para evitar el caché agresivo de GitHub Pages
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("No se pudo leer el JSON");
        
        const json = await response.json();
        const d = json.data.outdoor;

        // Mapeo de datos al HTML
        document.getElementById('val-temp').innerText = `${d.temperature.value}${d.temperature.unit}`;
        document.getElementById('val-hum').innerText = `${d.humidity.value}%`;
        document.getElementById('val-time').innerText = new Date(json.time * 1000).toLocaleTimeString();

        statusEl.style.display = 'none';
        containerEl.style.visibility = 'visible';
    } catch (err) {
        statusEl.innerText = "Clima no disponible temporalmente";
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', initWeather);
