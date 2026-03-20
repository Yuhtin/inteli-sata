#!/bin/bash
# SATA - Executa ILP Solver

cd "$(dirname "$0")/backend"

echo "==================================="
echo "SATA - ILP Solver (PuLP/CBC)"
echo "==================================="

python3 main.py --solver ilp --semanas 2 --output output/resultado_ilp.json

echo ""
echo "Resultado salvo em: backend/output/resultado_ilp.json"
