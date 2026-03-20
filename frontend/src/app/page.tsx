// frontend/src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "@/components/Calendar";
import { WeekSelector } from "@/components/WeekSelector";
import { StatsPanel } from "@/components/StatsPanel";
import { Resultado } from "@/lib/types";

export default function Home() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [semana, setSemana] = useState(1);

  useEffect(() => {
    fetch("/resultado.json")
      .then(r => r.json())
      .then(setResultado);
  }, []);

  if (!resultado) return <div className="p-8">Carregando...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SATA - Alocação Trimestral</h1>
        <Link
          href="/comparar"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Comparar Solvers
        </Link>
      </div>

      <div className="mb-6">
        <WeekSelector semana={semana} maxSemanas={12} onChange={setSemana} />
      </div>

      <Calendar alocacoes={resultado.alocacoes} semana={semana} />

      <div className="mt-6">
        <StatsPanel resultado={resultado} />
      </div>
    </main>
  );
}
