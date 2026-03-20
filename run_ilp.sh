#!/bin/bash
# SATA - Executa ILP Solver

cd "$(dirname "$0")/backend"

echo "==================================="
echo "SATA - ILP Solver (PuLP/CBC)"
echo "==================================="

python3 main.py --solver ilp --semanas 12 --data data/professors_12_weeks.json --output output/resultado_ilp.json

echo ""
echo "Resultado salvo em: backend/output/resultado_ilp.json"
