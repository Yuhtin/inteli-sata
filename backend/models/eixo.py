from enum import Enum


class Eixo(Enum):
    ORIENTACAO = "Orientação"
    COMPUTACAO = "Computação"
    UX = "UX"
    MATEMATICA = "Matemática"
    NEGOCIOS = "Negócios & Liderança"


PROPORCOES_ALVO: dict[Eixo, float] = {
    Eixo.ORIENTACAO: 0.30,
    Eixo.COMPUTACAO: 0.30,
    Eixo.UX: 0.15,
    Eixo.MATEMATICA: 0.15,
    Eixo.NEGOCIOS: 0.10,
}
