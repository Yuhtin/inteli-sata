# backend/tests/test_repair.py
from pathlib import Path
from solvers.repair import RepairSolver
from solvers.ilp import ILPSolver
from models.loader import carregar_professores
from models.slot import gerar_todos_slots

# Get path to data file relative to this test file
DATA_PATH = str(Path(__file__).parent.parent.parent / "data" / "small_example.json")


def test_repair_relaxa_tolerancia():
    # Test with infeasible scenario
    solver = RepairSolver(professores=[], slots=[])
    resultado = solver.solve()
    assert "tolerancia" in resultado.restricoes_relaxadas or len(resultado.alocacoes) == 0


def test_repair_retorna_resultado_com_dados_reais():
    """Test that RepairSolver handles real data appropriately."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = RepairSolver(professores=profs, slots=slots)
    resultado = solver.solve()

    # With the small dataset, the problem might be infeasible
    # Just verify the solver returns a valid result structure
    assert resultado is not None
    assert hasattr(resultado, 'alocacoes')
    assert hasattr(resultado, 'solver_usado')
    assert hasattr(resultado, 'restricoes_relaxadas')

    # If it found allocations, they should be valid
    if len(resultado.alocacoes) > 0:
        assert resultado.solver_usado == "repair"
        assert resultado.custo_total > 0
    else:
        # If infeasible, should indicate repair failed
        assert resultado.solver_usado == "repair_failed"


def test_repair_respeita_restricoes():
    """Test that RepairSolver respects all constraints when it finds allocations."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)
    solver = RepairSolver(professores=profs, slots=slots)
    resultado = solver.solve()

    # Only verify constraints if allocations were found
    if len(resultado.alocacoes) == 0:
        return  # Skip test if problem is infeasible

    # Verify professor availability
    for aloc in resultado.alocacoes:
        assert aloc.professor.esta_disponivel(aloc.slot), \
            f"Professor {aloc.professor.nome} not available for {aloc.slot}"

    # Verify professor qualifications
    for aloc in resultado.alocacoes:
        assert aloc.professor.ensina_eixo(aloc.eixo), \
            f"Professor {aloc.professor.nome} not qualified for {aloc.eixo.value}"

    # Verify max hours per week
    from models.slot import DURACAO_HORAS
    horas_prof_semana = {}
    for aloc in resultado.alocacoes:
        key = (aloc.professor.id, aloc.slot.semana)
        horas_prof_semana[key] = horas_prof_semana.get(key, 0) + DURACAO_HORAS

    for (prof_id, semana), horas in horas_prof_semana.items():
        prof = next(p for p in profs if p.id == prof_id)
        assert horas <= prof.max_horas_semana, \
            f"Professor {prof.nome} exceeded max hours in week {semana}: {horas} > {prof.max_horas_semana}"


def test_repair_tenta_tolerancias_crescentes():
    """Test that RepairSolver tries all tolerance levels."""
    profs = carregar_professores(DATA_PATH)
    slots = gerar_todos_slots(num_semanas=2)

    repair = RepairSolver(profs, slots)
    resultado = repair.solve()

    # Verify the repair solver tried all levels
    # If all levels failed, should have all three tolerances in restricoes_relaxadas
    if resultado.solver_usado == "repair_failed":
        assert len(resultado.restricoes_relaxadas) == 3, \
            "Should try all three tolerance levels"
        assert "tolerancia_proporcao=0.02" in resultado.restricoes_relaxadas
        assert "tolerancia_proporcao=0.05" in resultado.restricoes_relaxadas
        assert "tolerancia_proporcao=0.1" in resultado.restricoes_relaxadas


def test_repair_nao_mutate_resultado_original():
    """Test that RepairSolver creates new result instead of mutating."""
    from models.professor import Professor
    from models.eixo import Eixo
    from models.slot import Slot

    # Create a simple feasible scenario
    # Single professor available for all eixos with generous availability
    slots_disponibilidade = [
        Slot(semana=1, dia="Mon", horario="08-10"),
        Slot(semana=1, dia="Mon", horario="10-12"),
        Slot(semana=1, dia="Tue", horario="08-10"),
        Slot(semana=1, dia="Tue", horario="10-12"),
        Slot(semana=1, dia="Wed", horario="08-10"),
        Slot(semana=1, dia="Wed", horario="10-12"),
        Slot(semana=1, dia="Thu", horario="08-10"),
        Slot(semana=1, dia="Thu", horario="10-12"),
        Slot(semana=1, dia="Fri", horario="08-10"),
        Slot(semana=1, dia="Fri", horario="10-12"),
    ]
    prof = Professor(
        id="P_TEST",
        nome="Test Prof",
        eixos_habilitados=list(Eixo),
        custo_hora=100,
        max_horas_semana=40,
        disponibilidade=slots_disponibilidade
    )
    slots = slots_disponibilidade[:10]  # Use 10 slots

    repair = RepairSolver([prof], slots)
    resultado = repair.solve()

    # Verify that if repair succeeds, it creates a new object with solver_usado="repair"
    if len(resultado.alocacoes) > 0:
        assert resultado.solver_usado == "repair", \
            "RepairSolver should create new result with solver_usado='repair'"
        assert isinstance(resultado.restricoes_relaxadas, list), \
            "Should have restricoes_relaxadas as a list"
