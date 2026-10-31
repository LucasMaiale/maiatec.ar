import json
import re

# 1. Cargar el historial de lluvias recién actualizado
with open('data/lluvias_acumuladas.json', 'r', encoding='utf-8') as f:
    rain_data = json.load(f)

# 2. Generar las filas del tbody
sorted_dates = sorted(rain_data.keys(), reverse=True)
rows = []

for date_str in sorted_dates:
    year, month, day = date_str.split('-')
    val = round(float(rain_data[date_str]), 1)
    rows.append(
        f'                        <tr>\n'
        f'                            <td class="rain-date">{day}/{month}/{year}</td>\n'
        f'                            <td class="rain-val-cell">{val:.1f} <span class="rain-unit">mm</span></td>\n'
        f'                        </tr>'
    )

table_html = "\n".join(rows)

# 3. Leer el index.html
with open('clima-chacabuco/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 4. Inyectar las filas adentro del tbody
new_html = re.sub(
    r'<tbody id="rain-history-body">.*?</tbody>',
    f'<tbody id="rain-history-body">\n{table_html}\n                    </tbody>',
    html,
    flags=re.DOTALL
)

# 5. Guardar el archivo index.html listo
with open('clima-chacabuco/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)