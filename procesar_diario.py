import pandas as pd
import zipfile
import sys

try:
    # Fila 0 es descripción, Fila 1 (header=1) son los encabezados reales
    df = pd.read_excel('data/diario.xlsx', header=1, engine='openpyxl')
    df.to_json('data/diario.json', orient='records', indent=2, force_ascii=False)
    print('diario.json generado correctamente.')
except zipfile.BadZipFile:
    print('AVISO: El archivo descargado no es un Excel válido. Probablemente Ecowitt devolvió un error 404 (el archivo no existe o la URL es incorrecta).')
    sys.exit(0) # Salida limpia para no colgar la Action
except Exception as e:
    print(f'Error inesperado: {e}')
    sys.exit(1)