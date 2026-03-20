from models.slot import Slot, DURACAO_HORAS, gerar_slots_semana


def test_slot_creation():
    slot = Slot(semana=1, dia="Mon", horario="08-10")
    assert slot.semana == 1
    assert slot.dia == "Mon"
    assert slot.horario == "08-10"


def test_duracao_padrao_2h():
    assert DURACAO_HORAS == 2


def test_gerar_slots_semana_retorna_20_slots():
    slots = gerar_slots_semana(1)
    assert len(slots) == 20  # 5 dias x 4 horarios


def test_slot_hashable():
    slot1 = Slot(semana=1, dia="Mon", horario="08-10")
    slot2 = Slot(semana=1, dia="Mon", horario="08-10")
    assert slot1 == slot2
    assert hash(slot1) == hash(slot2)
