async function fetchWeather() {
    try {
        // Evitamos el cache del navegador con un timestamp
        const response = await fetch(`./data/latest.json?t=${new Date().getTime()}`);
        const json = await response.json();
        const data = json.data;

        // --- TEMPERATURA Y HUMEDAD ---
        let tempVal = parseFloat(data.outdoor.temperature.value);
        if (data.outdoor.temperature.unit === "ºF") {
            tempVal = (tempVal - 32) * 5 / 9;
        }
        document.getElementById('temp').innerText = tempVal.toFixed(1);
        document.getElementById('hum').innerText = data.outdoor.humidity.value;

        // --- VIENTO Y RÁFAGAS ---
        let windVal = parseFloat(data.wind.wind_speed.value);
        let gustVal = parseFloat(data.wind.wind_gust.value);
        const windUnit = data.wind.wind_speed.unit;

        // Conversión manual si llega en millas
        if (windUnit === "mph" || windUnit === "mi/h") {
            windVal *= 1.60934;
            gustVal *= 1.60934;
        }

        const grados = parseInt(data.wind.wind_direction.value);
        const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        const punto = direcciones[Math.round(grados / 22.5) % 16];

        document.getElementById('wind').innerText = windVal.toFixed(1);
        document.getElementById('gust').innerText = `Ráfagas: ${gustVal.toFixed(1)} km/h`;
        document.getElementById('wind-dir').innerText = `Dir: ${punto} (${grados}°)`;

        // --- PRESIÓN ---
        let pressVal = parseFloat(data.pressure.relative.value);
        if (data.pressure.relative.unit === "inHg") {
            pressVal *= 33.8639;
        }
        document.getElementById('press').innerText = pressVal.toFixed(1);

        // --- LLUVIA ---
        let rainVal = parseFloat(data.rainfall.daily.value);
        if (data.rainfall.daily.unit === "in") {
            rainVal *= 25.4;
        }
        document.getElementById('rain').innerText = rainVal.toFixed(1);

        // --- SOLAR Y UV ---
        const uvVal = data.solar_and_uvi.uvi.value;
        const solarVal = data.solar_and_uvi.solar.value;
        document.getElementById('uv').innerText = uvVal;
        document.getElementById('solar').innerText = `(${solarVal} W/m²)`;

        // --- FASE LUNAR ---
        const hoy = new Date();
        const luna = getMoonPhase(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
        document.getElementById('moon-icon').innerText = luna.icon;
        document.getElementById('moon-phase').innerText = luna.name;

        // --- HORA (ARGENTINA) ---
        const lastUpdate = new Date(json.time * 1000);
        document.getElementById('time').innerText = lastUpdate.toLocaleTimeString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });

        // Actualizamos el estado
        document.getElementById('status').innerText = "Estación en Vivo";

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('status').innerText = "Error al sincronizar";
    }
}

// --- FUNCIÓN MATEMÁTICA PARA LA LUNA ---
function getMoonPhase(year, month, day) {
    if (month < 3) { year--; month += 12; }
    month++;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09; 
    jd /= 29.5305882; 
    let b = parseInt(jd);
    jd -= b; 
    b = Math.round(jd * 8); 
    if (b >= 8) b = 0;

    const phases = [
        { name: "Nueva", icon: "🌑" },
        { name: "Creciente", icon: "🌒" },
        { name: "Creciente", icon: "🌓" },
        { name: "Gibosa", icon: "🌔" },
        { name: "Llena", icon: "🌕" },
        { name: "Gibosa", icon: "🌖" },
        { name: "Menguante", icon: "🌗" },
        { name: "Menguante", icon: "🌘" }
    ];
    return phases[b];
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', fetchWeather);
