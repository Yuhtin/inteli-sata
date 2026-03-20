# backend/tests/test_greedy.py
from pathlib import Path
from solvers.greedy import GreedySolver
from models.loader import carregar_professores
from models.slot import gerar_todos_slots

# Get path to data file relative to this test file
DATA_PATH = str(Path(__file__).parent.parent.parent / "data" / "small_example.json")

def test_greedy_retorna_resultado():
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = GreedySolver(professores=profs, slots=slots)
    resultado = solver.solve()
    assert resultado.solver_usado == "greedy"
    assert resultado.custo_total > 0
    assert len(resultado.alocacoes) > 0

def test_greedy_respeita_disponibilidade():
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = GreedySolver(professores=profs, slots=slots)
    resultado = solver.solve()
    for aloc in resultado.alocacoes:
        assert aloc.professor.esta_disponivel(aloc.slot)

def test_greedy_respeita_eixos():
    """Verify professors are only assigned to eixos they are qualified to teach."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = GreedySolver(professores=profs, slots=slots)
    resultado = solver.solve()
    for aloc in resultado.alocacoes:
        assert aloc.professor.ensina_eixo(aloc.eixo), \
            f"Professor {aloc.professor.nome} assigned to {aloc.eixo.value} but not qualified"

def test_greedy_custo_minimo():
    """Verify that the greedy solver selects the cheapest professor when multiple are available."""
    from models.professor import Professor
    from models.slot import Slot
    from models.eixo import Eixo

    # Create a single slot
    slot = Slot(semana=1, dia="Mon", horario="08-10")

    # Create two professors with different costs, both available and qualified
    prof_caro = Professor(
        id="CARO",
        nome="Expensive Prof",
        eixos_habilitados=[Eixo.ORIENTACAO],
        custo_hora=100.0,
        max_horas_semana=20,
        disponibilidade=[slot]
    )

    prof_barato = Professor(
        id="BARATO",
        nome="Cheap Prof",
        eixos_habilitados=[Eixo.ORIENTACAO],
        custo_hora=50.0,
        max_horas_semana=20,
        disponibilidade=[slot]
    )

    solver = GreedySolver(professores=[prof_caro, prof_barato], slots=[slot])
    resultado = solver.solve()

    # Should allocate to the cheaper professor
    assert len(resultado.alocacoes) == 1
    assert resultado.alocacoes[0].professor.id == "BARATO", \
        "Greedy solver should select the cheapest professor"
