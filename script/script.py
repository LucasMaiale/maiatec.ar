import requests
import json
import os

URL = "https://api.ecowitt.net/api/v3/device/real_time"

params = {
    "application_key": os.getenv("APP_KEY"),
    "api_key": os.getenv("API_KEY"),
    "mac": os.getenv("MAC"),
    "call_back": "all"
}

r = requests.get(URL, params=params, timeout=10)
data = r.json()

d = data["data"]

def f_to_c(f): return (f - 32) * 5 / 9
def mph_to_kmh(m): return m * 1.60934
def in_to_mm(i): return i * 25.4
def inhg_to_hpa(i): return i * 33.8639

result = {
    "temp": round(f_to_c(float(d["outdoor"]["temperature"]["value"])), 1),
    "humidity": float(d["outdoor"]["humidity"]["value"]),
    "wind": round(mph_to_kmh(float(d["wind"]["wind_speed"]["value"])), 1),
    "rain": round(in_to_mm(float(d["rainfall"]["daily"]["value"])), 1),
    "pressure": round(inhg_to_hpa(float(d["pressure"]["relative"]["value"])), 1)
}

with open("data.json", "w") as f:
    json.dump(result, f, indent=4)
