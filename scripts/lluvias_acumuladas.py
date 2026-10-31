import json
import os
from datetime import datetime

def procesar_historial_lluvia(anio_inicio=2026, mes_inicio=4, ruta_destino='lluvias_acumuladas.json'):
    ahora = datetime.now()
    anio_actual = ahora.year
    mes_actual = ahora.month
    hoy_str = ahora.strftime('%Y-%m-%d')  # Fecha de hoy para comparar

    # Generamos la lista de sufijos año_mes a procesar
    meses_a_procesar = []
    a, m = anio_inicio, mes_inicio

    while (a < anio_actual) or (a == anio_actual and m <= mes_actual):
        meses_a_procesar.append(f"{a}_{m:02d}")
        m += 1
        if m > 12:
            m = 1
            a += 1

    lluvia_por_dia = {}
    archivos_procesados = 0

    print(f"Revisando archivos desde {anio_inicio}_{mes_inicio:02d} hasta {anio_actual}_{mes_actual:02d}...\n")

    for periodo in meses_a_procesar:
        nombre_archivo = f"maiatec_{periodo}.json"

        if not os.path.exists(nombre_archivo):
            print(f"[-] No se encontró '{nombre_archivo}', salteando...")
            continue

        print(f"[+] Procesando '{nombre_archivo}'...")
        archivos_procesados += 1

        try:
            with open(nombre_archivo, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"    Error al leer '{nombre_archivo}': {e}")
            continue

        try:
            mediciones_lluvia = data['data']['rainfall']['daily']['list']
        except KeyError:
            print(f"    No se encontró 'rainfall.daily' en '{nombre_archivo}'.")
            continue

        if not mediciones_lluvia:
            continue

        # Agrupamos por fecha ("YYYY-MM-DD")
        for ts_str, valor in mediciones_lluvia.items():
            try:
                ts = int(ts_str)
                fecha_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
                mm = float(valor)

                if fecha_str not in lluvia_por_dia:
                    lluvia_por_dia[fecha_str] = []
                lluvia_por_dia[fecha_str].append(mm)
            except (ValueError, TypeError):
                continue

    if archivos_procesados == 0:
        print("\nNo se encontró ningún archivo para procesar.")
        return

    # Filtrar solo los días con precipitaciones (> 0 mm), excluyendo el día actual en curso
    resultado = {}
    for fecha, valores in sorted(lluvia_por_dia.items()):
        if fecha == hoy_str:
            continue  # Saltea el día de hoy hasta que termine el día
            
        total_dia = max(valores) if valores else 0.0
        if total_dia > 0:
            resultado[fecha] = round(total_dia, 2)

    if not resultado:
        print("\nRevisión terminada: no se registraron precipitaciones en el período analizado.")
        return

    try:
        with open(ruta_destino, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=4)
        print(f"\n¡Listo, fenómeno! Se analizó el historial y se generó '{ruta_destino}' con {len(resultado)} días de lluvia registrados.")
    except Exception as e:
        print(f"\nError al escribir el archivo de salida: {e}")

# --- EJECUCIÓN ---
# Arranca en 2026_04 y llega dinámicamente hasta el mes actual
procesar_historial_lluvia(anio_inicio=2026, mes_inicio=4)