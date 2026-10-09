import pandas as pd

# Fila 0 es descripción, Fila 1 (header=1) son los encabezados reales
df = pd.read_excel('data/diario.xlsx', header=1, engine='openpyxl')
df.to_json('data/diario.json', orient='records', indent=2, force_ascii=False)
print('diario.json generado correctamente.')