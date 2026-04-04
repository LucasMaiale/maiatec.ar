/**
 * Lógica de Estación Meteorológica Chacabuco
 * Procesa el JSON generado por el Workflow de GitHub Actions
 */

async function actualizarClima() {
    const statusEl = document.getElementById('status');
    
    try {
        // Agregamos un timestamp para evitar que el navegador guarde el JSON en caché
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        
        if (!response.ok) throw new Error('No se pudo obtener el JSON');
        
        const json = await response.json();
        const d = json.data;

        // --- 1. TEMPERATURA Y HUMEDAD ---
        document.getElementById('temp').innerText = parseFloat(d.outdoor.temperature.value).toFixed(1);
        document.getElementById('hum').innerText = d.outdoor.humidity.value;

        // --- 2. PRESIÓN (Redondeada a entero) ---
        document.getElementById('press').innerText = Math.round(d.pressure.relative.value);

        // --- 3. VIENTO Y RÁFAGAS ---
        document.getElementById('wind').innerText = parseFloat(d.wind.wind_speed.value).toFixed(1);
        document.getElementById('gust').innerText = parseFloat(d.wind.wind_gust.value).toFixed(1);

        // Conversión de grados a rosa de los vientos (16 rumbos)
        const grados = parseInt(d.wind.wind_direction.value);
        const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        const indice = Math.round(grados / 22.5) % 16;
        document.getElementById('wind-dir').innerText = `${direcciones[indice]} (${grados}°)`;

        // --- 4. ÍNDICE UV ---
        document.getElementById('uv').innerText = d.solar_and_uvi.uvi.value;

        // --- 5. LLUVIAS (Ya vienen en mm desde el YAML) ---
        // Lluvia 24hs (acumulado del día civil)
        document.getElementById('rain-24').innerText = parseFloat(d.rainfall.daily.value).toFixed(1);
        
        // Lluvia del último evento (la tormenta completa)
        document.getElementById('rain-event').innerText = parseFloat(d.rainfall.event.value).toFixed(1);

        // --- 6. HORA DE ACTUALIZACIÓN ---
        // Usamos la marca de tiempo del JSON (Unix)
        const fechaActualizacion = new Date(json.time * 1000);
        const opcionesHora = { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false,
            timeZone: 'America/Argentina/Buenos_Aires' 
        };
        document.getElementById('last-update').innerText = fechaActualizacion.toLocaleTimeString('es-AR', opcionesHora) + ' hs';

        // Feedback visual de éxito
        statusEl.innerText = "EN VIVO";
        statusEl.style.color = "#666";

    } catch (error) {
        console.error("Error al actualizar datos:", error);
        statusEl.innerText = "RECONECTANDO...";
        statusEl.style.color = "red";
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarClima();
    
    // Refrescar automáticamente cada 5 minutos (300.000 ms)
    // El workflow corre cada 10 min, así que 5 min es ideal para no perderse nada.
    setInterval(actualizarClima, 300000);
});
