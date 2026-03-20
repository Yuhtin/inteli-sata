# backend/models/allocation.py
from dataclasses import dataclass, field
from models.slot import Slot, DURACAO_HORAS
from models.eixo import Eixo
from models.professor import Professor


@dataclass
class Alocacao:
    slot: Slot
    eixo: Eixo
    professor: Professor

    def to_dict(self) -> dict:
        return {
            "semana": self.slot.semana,
            "dia": self.slot.dia,
            "horario": self.slot.horario,
            "eixo": self.eixo.value,
            "professor_id": self.professor.id,
            "professor_nome": self.professor.nome,
            "custo": self.professor.custo_hora * DURACAO_HORAS
        }


@dataclass
class ResultadoAlocacao:
    alocacoes: list[Alocacao]
    custo_total: float
    horas_por_eixo: dict[Eixo, int]
    solver_usado: str
    restricoes_relaxadas: list[str] = field(default_factory=list)
    fairness_scores: dict[Eixo, float] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "alocacoes": [a.to_dict() for a in self.alocacoes],
            "custo_total": self.custo_total,
            "horas_por_eixo": {e.value: h for e, h in self.horas_por_eixo.items()},
            "solver_usado": self.solver_usado,
            "restricoes_relaxadas": self.restricoes_relaxadas,
            "fairness_scores": {e.value: s for e, s in self.fairness_scores.items()}
        }
