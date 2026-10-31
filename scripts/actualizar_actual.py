import json
import os
import urllib.parse
import urllib.request


def fetch_and_clean_weather():
    # 1. Obtener credenciales desde las variables de entorno
    app_key = os.environ.get("ECOWITT_APPLICATION_KEY")
    api_key = os.environ.get("ECOWITT_API_KEY")
    mac = os.environ.get("ECOWITT_STATION_MAC")

    if not all([app_key, api_key, mac]):
        raise ValueError(
            "Faltan variables de entorno para la API de Ecowitt."
        )

    # 2. Armar la URL de la API de Ecowitt
    base_url = "https://api.ecowitt.net/api/v3/device/real_time"
    params = {
        "application_key": app_key,
        "api_key": api_key,
        "mac": mac,
        "temp_unitid": "1",
        "rainfall_unitid": "12",
        "wind_speed_unitid": "7",
        "solar_irradiance_unitid": "16",
        "pressure_unitid": "3",
        "capacity_unitid": "24",
        "call_back": "all",
    }

    url = f"{base_url}?{urllib.parse.urlencode(params)}"

    # 3. Descargar datos de la API
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        if response.status != 200:
            raise RuntimeError(
                f"Error en la petición a Ecowitt: {response.status}"
            )
        raw_data = json.loads(response.read().decode("utf-8"))

    # 4. Limpiar privacidad (remueve indoor, battery y vpd de outdoor)
    data = raw_data.get("data", {})

    if "outdoor" in data and isinstance(data["outdoor"], dict):
        data["outdoor"].pop("vpd", None)

    data.pop("indoor", None)
    data.pop("battery", None)

    # 5. Asegurar directorio 'data' y guardar 'latest.json'
    os.makedirs("data", exist_ok=True)
    with open("data/latest.json", "w", encoding="utf-8") as f:
        json.dump(raw_data, f, indent=2, ensure_ascii=False)

    print("Archivo data/latest.json generado con éxito.")


if __name__ == "__main__":
    fetch_and_clean_weather()