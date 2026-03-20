# backend/solvers/repair.py
import logging
from solvers.ilp import ILPSolver
from models.professor import Professor
from models.slot import Slot
from models.allocation import ResultadoAlocacao

logger = logging.getLogger(__name__)


class RepairSolver:
    NIVEIS_RELAXAMENTO = [
        {"tolerancia_proporcao": 0.02},
        {"tolerancia_proporcao": 0.05},
        {"tolerancia_proporcao": 0.10},
    ]

    def __init__(self, professores: list[Professor], slots: list[Slot]):
        self.professores = professores
        self.slots = slots

    def solve(self) -> ResultadoAlocacao:
        restricoes_relaxadas = []

        for nivel in self.NIVEIS_RELAXAMENTO:
            solver = ILPSolver(
                self.professores,
                self.slots,
                tolerancia_proporcao=nivel["tolerancia_proporcao"]
            )
            try:
                resultado = solver.solve()
                if resultado.alocacoes:
                    # Create a new ResultadoAlocacao instead of mutating the original
                    return ResultadoAlocacao(
                        alocacoes=resultado.alocacoes,
                        custo_total=resultado.custo_total,
                        horas_por_eixo=resultado.horas_por_eixo,
                        solver_usado="repair",
                        restricoes_relaxadas=restricoes_relaxadas,
                        fairness_scores=resultado.fairness_scores
                    )
            except Exception as e:
                # Log the exception for debugging and tracking
                logger.warning(
                    f"ILP solver failed with tolerancia={nivel['tolerancia_proporcao']}: {type(e).__name__}: {e}"
                )

            restricoes_relaxadas.append(
                f"tolerancia_proporcao={nivel['tolerancia_proporcao']}"
            )

        return ResultadoAlocacao(
            alocacoes=[],
            custo_total=0,
            horas_por_eixo={},
            solver_usado="repair_failed",
            restricoes_relaxadas=restricoes_relaxadas
        )
