from dataclasses import dataclass

DURACAO_HORAS = 2
DIAS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
HORARIOS = ["08-10", "10-12", "14-16", "16-18"]


@dataclass(frozen=True)
class Slot:
    semana: int
    dia: str
    horario: str

    def __str__(self) -> str:
        return f"S{self.semana}-{self.dia}-{self.horario}"


def gerar_slots_semana(semana: int) -> list[Slot]:
    return [
        Slot(semana=semana, dia=dia, horario=horario)
        for dia in DIAS
        for horario in HORARIOS
    ]


def gerar_todos_slots(num_semanas: int = 12) -> list[Slot]:
    slots = []
    for semana in range(1, num_semanas + 1):
        slots.extend(gerar_slots_semana(semana))
    return slots
