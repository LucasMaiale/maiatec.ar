from datetime import datetime, timedelta, timezone
import json
import os
import urllib.request

# Zona horaria Argentina (UTC-3)
TZ_ARG = timezone(timedelta(hours=-3))

# Definimos la ruta raíz del proyecto (un nivel arriba de /scripts)
DIRECTORIO_SCRIPT = os.path.dirname(os.path.abspath(__file__))
RUTA_RAIZ = os.path.abspath(os.path.join(DIRECTORIO_SCRIPT, ".."))
RUTA_ARCHIVO = os.path.join(RUTA_RAIZ, "data", "pronostico.json")


def agrupar_y_filtrar_franjas(hourly_data):
    """Agrupa los datos en bloques de 6 horas y descarta las franjas que ya pasaron
    respecto del horario actual en Argentina.
    """
    times = hourly_data.get("time", [])
    probabilities = hourly_data.get("precipitation_probability", [])
    precipitations = hourly_data.get("precipitation", [])

    etiquetas_franjas = [
        {"nombre": "Madrugada", "rango": "00:00 a 06:00"},
        {"nombre": "Mañana", "rango": "06:00 a 12:00"},
        {"nombre": "Tarde", "rango": "12:00 a 18:00"},
        {"nombre": "Noche", "rango": "18:00 a 24:00"},
    ]

    ahora_local = datetime.now(TZ_ARG)
    franjas_resultado = []

    for i in range(0, len(times), 6):
        bloque_times = times[i : i + 6]
        bloque_prob = probabilities[i : i + 6]
        bloque_precip = precipitations[i : i + 6]

        if not bloque_times:
            continue

        # Fin del bloque de 6hs (ej: 05:59:59 para el bloque 00-05)
        dt_fin_bloque = datetime.fromisoformat(bloque_times[-1]).replace(
            tzinfo=TZ_ARG, minute=59, second=59
        )

        # Descartar bloques ya finalizados
        if dt_fin_bloque < ahora_local:
            continue

        fecha = bloque_times[0].split("T")[0]
        indice_franja = (i // 6) % 4
        meta_franja = etiquetas_franjas[indice_franja]

        prob_max = max(bloque_prob) if bloque_prob else 0
        precip_total = sum(bloque_precip) if bloque_precip else 0.0

        franjas_resultado.append(
            {
                "fecha": fecha,
                "franja": meta_franja["nombre"],
                "horario": meta_franja["rango"],
                "inicio_iso": bloque_times[0],
                "fin_iso": bloque_times[-1],
                "probabilidad_max_pct": prob_max,
                "precipitacion_total_mm": round(precip_total, 2),
            }
        )

    return franjas_resultado


def obtener_pronostico():
    url = (
        "https://api.open-meteo.com/v1/forecast?"
        "latitude=-34.64&"
        "longitude=-60.47&"
        "hourly=precipitation_probability,precipitation&"
        "timezone=America%2FBuenos_Aires&"
        "forecast_days=4"
    )

    # Asegurar existencia del directorio data/ en la raíz del repo
    dir_data = os.path.dirname(RUTA_ARCHIVO)
    os.makedirs(dir_data, exist_ok=True)

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Python script - Maiatec Chacabuco Clima)"
        },
    )

    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))

                if "hourly" in data:
                    data["franjas_procesadas"] = agrupar_y_filtrar_franjas(
                        data["hourly"]
                    )

                with open(RUTA_ARCHIVO, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                print(f"Pronóstico actualizado correctamente en {RUTA_ARCHIVO}")
            else:
                print(f"Error HTTP al consultar la API: {response.status}")

    except Exception as e:
        print(f"Ocurrió un error al consultar o guardar los datos: {e}")


if __name__ == "__main__":
    obtener_pronostico()