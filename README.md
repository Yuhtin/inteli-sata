# SATA - Quarterly Class Allocation System

Optimization system for instructor allocation in quarterly class schedules using Integer Linear Programming (ILP) and heuristic methods.

**Demo video:** https://youtu.be/GrBm6qduEbM

## Problem

Build a quarterly module schedule (12 weeks) distributing classes across 5 content areas:
- Mentoring (30%)
- Computing (30%)
- UX (15%)
- Math (15%)
- Business & Leadership (10%)

### Constraints
- Each slot can have at most 1 class
- Instructors can only be assigned to their available slots
- Instructors cannot exceed max_hours_per_week
- Quarterly proportions must be met (±tolerance)

## Structure

```
sata/
├── backend/           # Python - Solvers and models
│   ├── models/        # Dataclasses (Axis, Slot, Instructor, Allocation)
│   ├── solvers/       # Greedy, ILP, Repair
│   ├── data/          # Input JSON files
│   └── output/        # Output JSON results
└── frontend/          # Next.js - Visualization
    └── src/
        ├── components/  # Calendar, WeekSelector, StatsPanel
        └── app/         # Pages (home, compare)
```

## Requirements

- Python 3.11+
- Node.js 18+
- PuLP (ILP solver)

## Running

### Backend

```bash
cd backend
pip install -r requirements.txt

# Run with Greedy Solver
python3 main.py --solver greedy --semanas 12

# Run with ILP Solver
python3 main.py --solver ilp --semanas 12

# Run with Repair Solver (relaxes constraints if needed)
python3 main.py --solver repair --semanas 12
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Solvers

### Greedy
- Complexity: O(S × P × E) where S=slots, P=instructors, E=axes
- Strategy: Selects axis with largest deficit and cheapest instructor
- Advantage: Fast, always finds a solution
- Disadvantage: No global optimality guarantee

### ILP (Integer Linear Programming)
- Complexity: NP-hard (exponential worst case)
- Uses PuLP/CBC for optimization
- Minimizes total cost while respecting all constraints
- Guarantees optimal solution when feasible

### Repair
- ILP wrapper with progressive relaxation
- Tries tolerances: 2% → 5% → 10%
- Useful when constraints are too strict

## Data Format

### Input (JSON)
```json
{
  "instructors": [
    {
      "id": "P1",
      "name": "Prof. Ana",
      "axes": ["Mentoring", "Computing"],
      "hourly_cost": 100,
      "max_hours_per_week": 10,
      "availability": [
        {"week": 1, "day": "Mon", "time": "08-10"}
      ]
    }
  ]
}
```

### Output (JSON)
```json
{
  "allocations": [...],
  "total_cost": 5000.0,
  "hours_per_axis": {"Mentoring": 72, "Computing": 72, ...},
  "solver_used": "greedy"
}
```
