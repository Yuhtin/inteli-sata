# backend/tests/test_loader.py
from pathlib import Path
from models.loader import carregar_professores

# Get path to data file relative to this test file
DATA_PATH = str(Path(__file__).parent.parent.parent / "data" / "small_example.json")


def test_carregar_professores():
    profs = carregar_professores(DATA_PATH)
    assert len(profs) > 0
    assert profs[0].id == "P1"
