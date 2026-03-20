# backend/solvers/ilp.py
from pulp import LpProblem, LpMinimize, LpVariable, LpBinary, lpSum, LpStatus
from models.professor import Professor
from models.slot import Slot, DURACAO_HORAS
from models.eixo import Eixo, PROPORCOES_ALVO
from models.allocation import Alocacao, ResultadoAlocacao


class ILPSolver:
    def __init__(
        self,
        professores: list[Professor],
        slots: list[Slot],
        tolerancia_proporcao: float = 0.15
    ):
        self.professores = professores
        self.slots = slots
        self.tolerancia = tolerancia_proporcao
        self.prob = None  # Store for debugging

    def solve(self) -> ResultadoAlocacao:
        prob = LpProblem("SATA", LpMinimize)

        # Variáveis de decisão: x[p][s][e] = 1 se prof p aloca slot s para eixo e
        x = {}
        for p in self.professores:
            for s in self.slots:
                for e in Eixo:
                    if p.esta_disponivel(s) and p.ensina_eixo(e):
                        x[(p.id, str(s), e)] = LpVariable(
                            f"x_{p.id}_{s}_{e.name}", cat=LpBinary
                        )

        # Função objetivo: minimizar custo total
        prob += lpSum(
            x[key] * self.professores[self._get_prof_idx(key[0])].custo_hora * DURACAO_HORAS
            for key in x
        )

        # Restrição 1: cada slot tem no máximo 1 aula
        for s in self.slots:
            prob += lpSum(
                x[key] for key in x if key[1] == str(s)
            ) <= 1

        # Restrição 2: max horas por semana por professor
        semanas = set(s.semana for s in self.slots)
        for p in self.professores:
            for w in semanas:
                slots_semana = [s for s in self.slots if s.semana == w]
                prob += lpSum(
                    x[key] * DURACAO_HORAS
                    for key in x
                    if key[0] == p.id and any(key[1] == str(s) for s in slots_semana)
                ) <= p.max_horas_semana

        # Restrição 3: proporções por eixo
        total_slots = len(self.slots)
        for e in Eixo:
            horas_eixo = lpSum(x[key] for key in x if key[2] == e) * DURACAO_HORAS
            alvo = PROPORCOES_ALVO[e] * total_slots * DURACAO_HORAS
            prob += horas_eixo >= alvo * (1 - self.tolerancia)
            prob += horas_eixo <= alvo * (1 + self.tolerancia)

        prob.solve()
        self.prob = prob  # Store for debugging

        # Check solver status
        status = LpStatus[prob.status]
        if prob.status != 1:  # 1 = Optimal
            # Return empty result for non-optimal status
            return ResultadoAlocacao(
                alocacoes=[],
                custo_total=0,
                horas_por_eixo={e: 0 for e in Eixo},
                solver_usado="ilp",
                restricoes_relaxadas=[f"Status: {status}"]
            )

        # Extrair alocações
        alocacoes = []
        horas_por_eixo = {e: 0 for e in Eixo}

        for key, var in x.items():
            if var.varValue == 1:
                p_id, s_str, eixo = key
                prof = next(p for p in self.professores if p.id == p_id)
                slot = next(s for s in self.slots if str(s) == s_str)
                alocacoes.append(Alocacao(slot=slot, eixo=eixo, professor=prof))
                horas_por_eixo[eixo] += DURACAO_HORAS

        custo_total = sum(
            a.professor.custo_hora * DURACAO_HORAS for a in alocacoes
        )

        return ResultadoAlocacao(
            alocacoes=alocacoes,
            custo_total=custo_total,
            horas_por_eixo=horas_por_eixo,
            solver_usado="ilp"
        )

    def _get_prof_idx(self, p_id: str) -> int:
        for i, p in enumerate(self.professores):
            if p.id == p_id:
                return i
        return 0
