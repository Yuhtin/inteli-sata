# backend/tests/test_ilp.py
from pathlib import Path
from solvers.ilp import ILPSolver
from models.loader import carregar_professores
from models.slot import gerar_todos_slots

# Get path to data file relative to this test file
DATA_PATH = str(Path(__file__).parent.parent.parent / "data" / "small_example.json")

def test_ilp_retorna_resultado():
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = ILPSolver(professores=profs, slots=slots)
    resultado = solver.solve()
    assert resultado.solver_usado == "ilp"

def test_ilp_custo_menor_ou_igual_greedy():
    """Test that ILP cost is less than or equal to greedy cost."""
    from solvers.greedy import GreedySolver
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)

    greedy = GreedySolver(profs, slots).solve()
    ilp = ILPSolver(profs, slots).solve()

    # ILP should have cost less than or equal to greedy
    assert ilp.custo_total <= greedy.custo_total

def test_ilp_respeita_disponibilidade():
    """Test that ILP respects professor availability."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = ILPSolver(professores=profs, slots=slots)
    resultado = solver.solve()
    for aloc in resultado.alocacoes:
        assert aloc.professor.esta_disponivel(aloc.slot)

def test_ilp_respeita_eixos():
    """Verify professors are only assigned to eixos they are qualified to teach."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = ILPSolver(professores=profs, slots=slots)
    resultado = solver.solve()
    for aloc in resultado.alocacoes:
        assert aloc.professor.ensina_eixo(aloc.eixo), \
            f"Professor {aloc.professor.nome} assigned to {aloc.eixo.value} but not qualified"

def test_ilp_respeita_max_horas_semana():
    """Test that ILP respects max hours per week constraint."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = ILPSolver(professores=profs, slots=slots)
    resultado = solver.solve()

    # Count hours per professor per week
    from models.slot import DURACAO_HORAS
    horas_prof_semana = {}
    for aloc in resultado.alocacoes:
        key = (aloc.professor.id, aloc.slot.semana)
        horas_prof_semana[key] = horas_prof_semana.get(key, 0) + DURACAO_HORAS

    # Verify no professor exceeds their max hours per week
    for (prof_id, semana), horas in horas_prof_semana.items():
        prof = next(p for p in profs if p.id == prof_id)
        assert horas <= prof.max_horas_semana, \
            f"Professor {prof.nome} exceeded max hours in week {semana}: {horas} > {prof.max_horas_semana}"

def test_ilp_cada_slot_uma_aula():
    """Test that ILP assigns at most one class per slot."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = ILPSolver(professores=profs, slots=slots)
    resultado = solver.solve()

    # Count allocations per slot
    slots_alocados = {}
    for aloc in resultado.alocacoes:
        slot_key = str(aloc.slot)
        slots_alocados[slot_key] = slots_alocados.get(slot_key, 0) + 1

    # Verify each slot has at most 1 allocation
    for slot_key, count in slots_alocados.items():
        assert count == 1, f"Slot {slot_key} has {count} allocations, expected 1"
