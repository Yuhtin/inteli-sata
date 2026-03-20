# backend/models/professor.py
from dataclasses import dataclass, field
from models.eixo import Eixo
from models.slot import Slot


@dataclass
class Professor:
    id: str
    nome: str
    eixos_habilitados: list[Eixo]
    custo_hora: float
    max_horas_semana: int
    disponibilidade: list[Slot]
    min_horas_trimestre: int | None = None
    preferencias: dict | None = field(default_factory=dict)

    def esta_disponivel(self, slot: Slot) -> bool:
        return slot in self.disponibilidade

    def ensina_eixo(self, eixo: Eixo) -> bool:
        return eixo in self.eixos_habilitados
