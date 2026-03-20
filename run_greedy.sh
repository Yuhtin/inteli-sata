#!/bin/bash
# SATA - Executa Greedy Solver

cd "$(dirname "$0")/backend"

echo "==================================="
echo "SATA - Greedy Solver"
echo "==================================="

python3 main.py --solver greedy --semanas 12 --data data/professors_12_weeks.json --output output/resultado_greedy.json

echo ""
echo "Resultado salvo em: backend/output/resultado_greedy.json"
