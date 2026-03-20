#!/usr/bin/env python3
"""
Script para expandir a disponibilidade dos professores de 2 para 12 semanas.
Replica o padrão das semanas 1-2 para as semanas 3-12.
"""
import json

# Carregar dados originais
with open("small_example.json", "r") as f:
    data = json.load(f)

for professor in data["professores"]:
    original_disp = professor["disponibilidade"]

    # Separar disponibilidade por semana
    semana_1 = [d for d in original_disp if d["semana"] == 1]
    semana_2 = [d for d in original_disp if d["semana"] == 2]

    # Nova lista de disponibilidade expandida
    nova_disp = []

    for semana in range(1, 13):
        # Semanas ímpares seguem padrão da semana 1, pares da semana 2
        if semana % 2 == 1:
            base = semana_1
        else:
            base = semana_2

        for slot in base:
            nova_disp.append({
                "semana": semana,
                "dia": slot["dia"],
                "horario": slot["horario"]
            })

    professor["disponibilidade"] = nova_disp

    # Ajustar min_horas_trimestre para 12 semanas (multiplicar por 6 pois antes era baseado em 2 semanas)
    # Na verdade, vamos manter o valor original que já estava pensado para trimestre

# Salvar dados expandidos
with open("professors_12_weeks.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Arquivo 'professors_12_weeks.json' criado com disponibilidade para 12 semanas!")
print(f"Total de professores: {len(data['professores'])}")

# Mostrar estatísticas
for prof in data["professores"]:
    slots_por_semana = len([d for d in prof["disponibilidade"] if d["semana"] == 1])
    print(f"  {prof['nome']}: {slots_por_semana} slots/semana, {len(prof['disponibilidade'])} slots total")
