// frontend/src/app/comparar/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/Calendar";
import { StatsPanel } from "@/components/StatsPanel";
import { Resultado } from "@/lib/types";

export default function CompararPage() {
  const [greedy, setGreedy] = useState<Resultado | null>(null);
  const [ilp, setIlp] = useState<Resultado | null>(null);
  const [semana, setSemana] = useState(1);

  useEffect(() => {
    // Load both results - for now we'll use the same file
    // In production, you'd have resultado_greedy.json and resultado_ilp.json
    fetch("/resultado.json").then(r => r.json()).then(setGreedy);
    fetch("/resultado.json").then(r => r.json()).then(setIlp);
  }, []);

  if (!greedy || !ilp) return <div className="p-8">Carregando...</div>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Comparar Solvers</h1>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSemana(s => Math.max(1, s - 1))}
          className="px-4 py-2 bg-gray-200 rounded"
        >◄</button>
        <span className="text-xl font-semibold">Semana {semana}</span>
        <button
          onClick={() => setSemana(s => s + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >►</button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Greedy</h2>
          <Calendar alocacoes={greedy.alocacoes} semana={semana} />
          <div className="mt-4">
            <StatsPanel resultado={greedy} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">ILP</h2>
          <Calendar alocacoes={ilp.alocacoes} semana={semana} />
          <div className="mt-4">
            <StatsPanel resultado={ilp} />
          </div>
        </div>
      </div>
    </main>
  );
}
