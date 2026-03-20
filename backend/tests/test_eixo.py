from models.eixo import Eixo, PROPORCOES_ALVO


def test_eixo_enum_has_five_values():
    assert len(Eixo) == 5


def test_proporcoes_somam_100():
    total = sum(PROPORCOES_ALVO.values())
    assert total == 1.0


def test_orientacao_e_computacao_sao_majoritarios():
    assert PROPORCOES_ALVO[Eixo.ORIENTACAO] >= 0.25
    assert PROPORCOES_ALVO[Eixo.COMPUTACAO] >= 0.25
