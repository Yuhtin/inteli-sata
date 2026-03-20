# SATA - Sistema de Alocação Trimestral de Aulas

Sistema de otimização para alocação de professores em grades de aula trimestrais.

## Problema

Montar a grade de um módulo trimestral (12 semanas) distribuindo aulas em 5 eixos:
- Orientação (30%)
- Computação (30%)
- UX (15%)
- Matemática (15%)
- Negócios & Liderança (10%)

### Restrições
- Um slot recebe no máximo 1 aula
- Professor só pode ser alocado em slots disponíveis
- Professor não pode exceder max_horas_por_semana
- Proporções trimestrais devem ser atingidas (±tolerância)

## Estrutura

```
sata/
├── backend/           # Python - Solvers e modelos
│   ├── models/        # Dataclasses (Eixo, Slot, Professor, Alocacao)
│   ├── solvers/       # Greedy, ILP, Repair
│   ├── data/          # Arquivos JSON de entrada
│   └── output/        # Resultados JSON
└── frontend/          # Next.js - Visualização
    └── src/
        ├── components/  # Calendar, WeekSelector, StatsPanel
        └── app/         # Páginas (home, comparar)
```

## Requisitos

- Python 3.11+
- Node.js 18+
- PuLP (solver ILP)

## Execução

### Backend

```bash
cd sata/backend
pip install -r requirements.txt

# Executar com Greedy Solver
python3 main.py --solver greedy --semanas 12

# Executar com ILP Solver
python3 main.py --solver ilp --semanas 12

# Executar com Repair Solver (relaxa restrições se necessário)
python3 main.py --solver repair --semanas 12
```

### Frontend

```bash
cd sata/frontend
npm install
npm run dev
```

Acesse http://localhost:3000

## Solvers

### Greedy
- Complexidade: O(S × P × E) onde S=slots, P=professores, E=eixos
- Estratégia: Seleciona eixo com maior déficit e professor mais barato
- Vantagem: Rápido, sempre encontra solução
- Desvantagem: Não garante ótimo global

### ILP (Integer Linear Programming)
- Complexidade: NP-hard (exponencial no pior caso)
- Usa PuLP/CBC para otimização
- Minimiza custo total respeitando todas as restrições
- Garante solução ótima quando factível

### Repair
- Wrapper do ILP com relaxamento progressivo
- Tenta tolerâncias: 2% → 5% → 10%
- Útil quando restrições são muito rígidas

## Formato de Dados

### Entrada (JSON)
```json
{
  "professores": [
    {
      "id": "P1",
      "nome": "Prof. Ana",
      "eixos": ["Orientação", "Computação"],
      "custo_hora": 100,
      "max_horas_semana": 10,
      "disponibilidade": [
        {"semana": 1, "dia": "Mon", "horario": "08-10"}
      ]
    }
  ]
}
```

### Saída (JSON)
```json
{
  "alocacoes": [...],
  "custo_total": 5000.0,
  "horas_por_eixo": {"Orientação": 72, "Computação": 72, ...},
  "solver_usado": "greedy"
}
```
