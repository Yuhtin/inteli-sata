// frontend/src/components/StatsPanel.tsx
"use client";
import { Resultado } from "@/lib/types";

interface StatsPanelProps {
  resultado: Resultado;
}

const EIXO_COLORS: Record<string, string> = {
  "Orientação": "bg-blue-500",
  "Computação": "bg-green-500",
  "UX": "bg-purple-500",
  "Matemática": "bg-orange-500",
  "Negócios & Liderança": "bg-yellow-500",
};

export function StatsPanel({ resultado }: StatsPanelProps) {
  const totalHoras = Object.values(resultado.horas_por_eixo).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Estatísticas</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">Custo Total</p>
          <p className="text-2xl font-bold">R$ {resultado.custo_total.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">Alocações</p>
          <p className="text-2xl font-bold">{resultado.alocacoes.length}</p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Horas por Eixo</h3>
      <div className="space-y-2">
        {Object.entries(resultado.horas_por_eixo).map(([eixo, horas]) => (
          <div key={eixo} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${EIXO_COLORS[eixo] || "bg-gray-400"}`} />
            <span className="flex-1">{eixo}</span>
            <span className="font-mono">{horas}h ({((horas / totalHoras) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">Solver: {resultado.solver_usado}</p>
    </div>
  );
}
