"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { Calendar } from "@/components/Calendar";
import { WeekSelector } from "@/components/WeekSelector";
import { StatsPanel } from "@/components/StatsPanel";
import { Resultado } from "@/lib/types";
import { motion } from "framer-motion";

export default function Home() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [semana, setSemana] = useState(1);

  useEffect(() => {
    // Default to greedy result on main page
    fetch("/resultado_greedy.json")
      .then((r) => r.json())
      .then(setResultado);
  }, []);

  if (!resultado) {
    return (
      <div className="min-h-screen gradient-mesh noise-overlay flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <span className="text-muted text-sm">Carregando alocações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh noise-overlay">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-xl">📅</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                SATA
              </h1>
            </div>
            <p className="text-muted text-sm">
              Sistema de Alocação Trimestral de Aulas
            </p>
          </div>

          <Link href="/comparar">
            <Button
              variant="flat"
              className="bg-card hover:bg-card-hover border border-border text-foreground font-medium gap-2"
              endContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            >
              Comparar Solvers
            </Button>
          </Link>
        </motion.header>

        {/* Week selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <WeekSelector semana={semana} maxSemanas={12} onChange={setSemana} />
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar - takes 2 columns */}
          <div className="lg:col-span-2">
            <Calendar alocacoes={resultado.alocacoes} semana={semana} />
          </div>

          {/* Stats panel - takes 1 column */}
          <div className="lg:col-span-1">
            <StatsPanel resultado={resultado} />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-border/30 text-center"
        >
          <p className="text-xs text-muted">
            SATA v1.0 • Inteli • {new Date().getFullYear()}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
