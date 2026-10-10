import json
import os

def probar_json_local(ruta_archivo, categoria='outdoor', subcategoria='temperature'):
    if not os.path.exists(ruta_archivo):
        print(f"Che, no encuentro el archivo: {ruta_archivo}. Fijate si está en la misma carpeta.")
        return

    print(f"Analizando los intervalos de 5 minutos en '{ruta_archivo}'...")

    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Falla al leer el JSON: {e}")
        return

    try:
        # Extraemos las claves (timestamps UNIX) de la métrica
        mediciones = data['data'][categoria][subcategoria]['list']
        # Convertimos los timestamps a enteros y los ordenamos por las dudas
        timestamps = sorted([int(ts) for ts in mediciones.keys()])
    except KeyError:
        print(f"No se encontró la ruta {categoria}.{subcategoria} en el JSON. ¿Seguro que es el archivo de Ecowitt?")
        return

    if not timestamps:
        print("El archivo parece válido pero está vacío, no hay datos para revisar.")
        return

    hay_problemas = False
    
    # Iteramos comparando cada timestamp con el anterior
    for i in range(1, len(timestamps)):
        salto = timestamps[i] - timestamps[i-1]
        
        if salto != 300:  # 300 segundos = 5 minutos exactos
            print(f"¡Ojo! Salto de {salto/60} minutos entre los registros {timestamps[i-1]} y {timestamps[i]}.")
            hay_problemas = True

    if not hay_problemas:
        print("Todo joya, lince. Tenés un dato cada 5 minutos clavadito en todo el archivo.")
    else:
        print("Revisión terminada. Vas a tener que emparchar esos baches.")

# --- ZONA DE PRUEBAS ---
# Cambiá el nombre de este string por el de tu archivo local
archivo_de_prueba = 'maiatec_2026_10.json' 
probar_json_local(archivo_de_prueba)