# backend/tests/test_professor.py
from models.professor import Professor
from models.eixo import Eixo
from models.slot import Slot


def test_professor_creation():
    prof = Professor(
        id="P1",
        nome="João Silva",
        eixos_habilitados=[Eixo.COMPUTACAO],
        custo_hora=100.0,
        max_horas_semana=8,
        disponibilidade=[]
    )
    assert prof.id == "P1"
    assert prof.custo_hora == 100.0


def test_professor_esta_disponivel():
    slot = Slot(semana=1, dia="Mon", horario="08-10")
    prof = Professor(
        id="P1",
        nome="João",
        eixos_habilitados=[Eixo.COMPUTACAO],
        custo_hora=100.0,
        max_horas_semana=8,
        disponibilidade=[slot]
    )
    assert prof.esta_disponivel(slot) == True
    outro_slot = Slot(semana=1, dia="Tue", horario="08-10")
    assert prof.esta_disponivel(outro_slot) == False


def test_professor_ensina_eixo():
    prof = Professor(
        id="P1",
        nome="João",
        eixos_habilitados=[Eixo.COMPUTACAO, Eixo.UX],
        custo_hora=100.0,
        max_horas_semana=8,
        disponibilidade=[]
    )
    assert prof.ensina_eixo(Eixo.COMPUTACAO) == True
    assert prof.ensina_eixo(Eixo.MATEMATICA) == False
