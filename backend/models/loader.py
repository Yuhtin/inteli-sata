# backend/models/loader.py
import json
from models.professor import Professor
from models.slot import Slot
from models.eixo import Eixo

EIXO_MAP = {e.value: e for e in Eixo}


def carregar_professores(path: str) -> list[Professor]:
    with open(path) as f:
        data = json.load(f)

    professores = []
    for p in data["professores"]:
        disponibilidade = [
            Slot(d["semana"], d["dia"], d["horario"])
            for d in p["disponibilidade"]
        ]
        prof = Professor(
            id=p["id"],
            nome=p["nome"],
            eixos_habilitados=[EIXO_MAP[e] for e in p["eixos"]],
            custo_hora=p["custo_hora"],
            max_horas_semana=p["max_horas_semana"],
            disponibilidade=disponibilidade,
            min_horas_trimestre=p.get("min_horas_trimestre"),
            preferencias=p.get("preferencias", {})
        )
        professores.append(prof)
    return professores
