#!/bin/bash
# SATA - Executa Greedy Solver

cd "$(dirname "$0")/backend"

echo "==================================="
echo "SATA - Greedy Solver"
echo "==================================="

python3 main.py --solver greedy --semanas 2 --output output/resultado_greedy.json

echo ""
echo "Resultado salvo em: backend/output/resultado_greedy.json"
