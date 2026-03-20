# backend/solvers/greedy.py
from models.professor import Professor
from models.slot import Slot, DURACAO_HORAS
from models.eixo import Eixo, PROPORCOES_ALVO
from models.allocation import Alocacao, ResultadoAlocacao


class GreedySolver:
    def __init__(self, professores: list[Professor], slots: list[Slot]):
        self.professores = professores
        self.slots = slots
        self.horas_por_eixo: dict[Eixo, int] = {e: 0 for e in Eixo}
        self.horas_por_professor_semana: dict[str, dict[int, int]] = {}

    def solve(self) -> ResultadoAlocacao:
        alocacoes = []

        for slot in sorted(self.slots, key=lambda s: (s.semana, s.dia, s.horario)):
            eixo = self._escolher_eixo_mais_defasado()
            professor = self._escolher_professor(slot, eixo)

            if professor:
                alocacao = Alocacao(slot=slot, eixo=eixo, professor=professor)
                alocacoes.append(alocacao)
                self._atualizar_contadores(professor, slot, eixo)

        custo_total = sum(
            a.professor.custo_hora * DURACAO_HORAS for a in alocacoes
        )

        return ResultadoAlocacao(
            alocacoes=alocacoes,
            custo_total=custo_total,
            horas_por_eixo=self.horas_por_eixo.copy(),
            solver_usado="greedy"
        )

    def _escolher_eixo_mais_defasado(self) -> Eixo:
        total_alocado = sum(self.horas_por_eixo.values())
        if total_alocado == 0:
            return Eixo.ORIENTACAO

        maior_deficit = -1
        eixo_escolhido = Eixo.ORIENTACAO

        for eixo, proporcao_alvo in PROPORCOES_ALVO.items():
            atual = self.horas_por_eixo[eixo] / total_alocado
            deficit = proporcao_alvo - atual
            if deficit > maior_deficit:
                maior_deficit = deficit
                eixo_escolhido = eixo

        return eixo_escolhido

    def _escolher_professor(self, slot: Slot, eixo: Eixo) -> Professor | None:
        candidatos = []
        for prof in self.professores:
            if not prof.esta_disponivel(slot):
                continue
            if not prof.ensina_eixo(eixo):
                continue
            horas_semana = self.horas_por_professor_semana.get(
                prof.id, {}
            ).get(slot.semana, 0)
            if horas_semana + DURACAO_HORAS > prof.max_horas_semana:
                continue
            candidatos.append(prof)

        if not candidatos:
            return None

        return min(candidatos, key=lambda p: p.custo_hora)

    def _atualizar_contadores(self, prof: Professor, slot: Slot, eixo: Eixo):
        self.horas_por_eixo[eixo] += DURACAO_HORAS

        if prof.id not in self.horas_por_professor_semana:
            self.horas_por_professor_semana[prof.id] = {}
        semana = slot.semana
        self.horas_por_professor_semana[prof.id][semana] = (
            self.horas_por_professor_semana[prof.id].get(semana, 0) + DURACAO_HORAS
        )
