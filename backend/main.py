# backend/main.py
import json
import argparse
import sys
sys.path.insert(0, '.')

from models.loader import carregar_professores
from models.slot import gerar_todos_slots
from solvers.greedy import GreedySolver
from solvers.ilp import ILPSolver
from solvers.repair import RepairSolver

def main():
    parser = argparse.ArgumentParser(description="SATA - Alocação de Aulas")
    parser.add_argument("--data", default="data/small_example.json")
    parser.add_argument("--solver", choices=["greedy", "ilp", "repair"], default="greedy")
    parser.add_argument("--semanas", type=int, default=12)
    parser.add_argument("--output", default="output/resultado.json")
    args = parser.parse_args()

    professores = carregar_professores(args.data)
    slots = gerar_todos_slots(args.semanas)

    print(f"Carregados {len(professores)} professores")
    print(f"Total de {len(slots)} slots ({args.semanas} semanas)")

    if args.solver == "greedy":
        solver = GreedySolver(professores, slots)
    elif args.solver == "ilp":
        solver = ILPSolver(professores, slots)
    else:
        solver = RepairSolver(professores, slots)

    print(f"Executando solver: {args.solver}")
    resultado = solver.solve()

    output = resultado.to_dict()

    with open(args.output, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Resultado salvo em: {args.output}")
    print(f"Custo total: R$ {resultado.custo_total:.2f}")
    print(f"Alocações: {len(resultado.alocacoes)}")

if __name__ == "__main__":
    main()
