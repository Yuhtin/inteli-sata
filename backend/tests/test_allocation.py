# backend/tests/test_allocation.py
from models.allocation import Alocacao, ResultadoAlocacao
from models.slot import Slot, DURACAO_HORAS
from models.eixo import Eixo
from models.professor import Professor


def test_alocacao_creation():
    slot = Slot(semana=1, dia="Mon", horario="08-10")
    prof = Professor("P1", "João", [Eixo.COMPUTACAO], 100.0, 8, [slot])
    alocacao = Alocacao(slot=slot, eixo=Eixo.COMPUTACAO, professor=prof)
    assert alocacao.slot == slot
    assert alocacao.eixo == Eixo.COMPUTACAO


def test_alocacao_to_dict():
    slot = Slot(semana=1, dia="Mon", horario="08-10")
    prof = Professor("P1", "João", [Eixo.COMPUTACAO], 100.0, 8, [slot])
    alocacao = Alocacao(slot=slot, eixo=Eixo.COMPUTACAO, professor=prof)

    d = alocacao.to_dict()

    # Verify all fields are serialized correctly
    assert d["semana"] == 1
    assert d["dia"] == "Mon"
    assert d["horario"] == "08-10"
    assert d["eixo"] == "Computação"
    assert d["professor_id"] == "P1"
    assert d["professor_nome"] == "João"

    # Verify cost calculation: custo_hora * DURACAO_HORAS = 100 * 2 = 200
    assert d["custo"] == 200.0


def test_resultado_to_dict():
    slot1 = Slot(semana=1, dia="Mon", horario="08-10")
    slot2 = Slot(semana=1, dia="Tue", horario="10-12")
    prof1 = Professor("P1", "João", [Eixo.COMPUTACAO], 100.0, 8, [slot1])
    prof2 = Professor("P2", "Maria", [Eixo.UX], 150.0, 8, [slot2])

    alocacao1 = Alocacao(slot=slot1, eixo=Eixo.COMPUTACAO, professor=prof1)
    alocacao2 = Alocacao(slot=slot2, eixo=Eixo.UX, professor=prof2)

    resultado = ResultadoAlocacao(
        alocacoes=[alocacao1, alocacao2],
        custo_total=1000.0,
        horas_por_eixo={Eixo.COMPUTACAO: 10, Eixo.UX: 8},
        solver_usado="greedy",
        restricoes_relaxadas=["max_horas_professor"],
        fairness_scores={Eixo.COMPUTACAO: 0.95, Eixo.UX: 0.88}
    )

    d = resultado.to_dict()

    # Verify all 6 fields in the output dict
    assert d["custo_total"] == 1000.0
    assert d["solver_usado"] == "greedy"

    # Verify alocacoes list serialization
    assert len(d["alocacoes"]) == 2
    assert d["alocacoes"][0]["professor_id"] == "P1"
    assert d["alocacoes"][1]["professor_id"] == "P2"

    # Verify horas_por_eixo enum key conversion
    assert d["horas_por_eixo"]["Computação"] == 10
    assert d["horas_por_eixo"]["UX"] == 8

    # Verify restricoes_relaxadas
    assert d["restricoes_relaxadas"] == ["max_horas_professor"]

    # Verify fairness_scores
    assert d["fairness_scores"]["Computação"] == 0.95
    assert d["fairness_scores"]["UX"] == 0.88
