"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, Chip, Spinner } from "@heroui/react";
import { Calendar } from "@/components/Calendar";
import { StatsPanel } from "@/components/StatsPanel";
import { Resultado } from "@/lib/types";
import { motion } from "framer-motion";

export default function CompararPage() {
  const [greedy, setGreedy] = useState<Resultado | null>(null);
  const [ilp, setIlp] = useState<Resultado | null>(null);
  const [semana, setSemana] = useState(1);
  const maxSemanas = 12;

  useEffect(() => {
    // Load results from both solvers
    fetch("/resultado_greedy.json").then((r) => r.json()).then(setGreedy);
    fetch("/resultado_ilp.json").then((r) => r.json()).then(setIlp);
  }, []);

  if (!greedy || !ilp) {
    return (
      <div className="min-h-screen gradient-mesh noise-overlay flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <span className="text-muted text-sm">Carregando comparação...</span>
        </div>
      </div>
    );
  }

  const costDiff = ilp.custo_total - greedy.custo_total;
  const costDiffPercent = ((costDiff / greedy.custo_total) * 100).toFixed(1);

  return (
    <div className="min-h-screen gradient-mesh noise-overlay">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="flat"
                className="bg-card hover:bg-card-hover border border-border text-foreground"
                aria-label="Voltar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Comparar Solvers
              </h1>
              <p className="text-sm text-muted">
                Análise lado a lado dos algoritmos Greedy e ILP
              </p>
            </div>
          </div>

          {/* Cost comparison badge */}
          <Card className="glass-card px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted uppercase tracking-wider">
                  Diferença
                </p>
                <p
                  className={`text-lg font-bold font-mono ${
                    costDiff < 0
                      ? "text-green-400"
                      : costDiff > 0
                      ? "text-red-400"
                      : "text-muted"
                  }`}
                >
                  {costDiff > 0 ? "+" : ""}
                  R$ {costDiff.toFixed(2)}
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  base: costDiff <= 0 ? "bg-green-500/20" : "bg-red-500/20",
                  content: costDiff <= 0 ? "text-green-400" : "text-red-400",
                }}
              >
                {costDiff <= 0 ? "ILP mais barato" : "Greedy mais barato"}
              </Chip>
            </div>
          </Card>
        </motion.header>

        {/* Week navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          <Button
            isIconOnly
            variant="flat"
            onPress={() => setSemana((s) => Math.max(1, s - 1))}
            isDisabled={semana <= 1}
            className="bg-card hover:bg-card-hover border border-border text-foreground w-12 h-12"
            aria-label="Semana anterior"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>

          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border">
            <span className="text-xl font-bold text-foreground">
              Semana {semana}
            </span>
            <span className="text-sm text-muted">de {maxSemanas}</span>
          </div>

          <Button
            isIconOnly
            variant="flat"
            onPress={() => setSemana((s) => Math.min(maxSemanas, s + 1))}
            isDisabled={semana >= maxSemanas}
            className="bg-card hover:bg-card-hover border border-border text-foreground w-12 h-12"
            aria-label="Próxima semana"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </motion.div>

        {/* Side by side comparison */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Greedy column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
              <h2 className="text-xl font-bold text-foreground">
                Greedy Algorithm
              </h2>
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  base: "bg-green-500/20 border border-green-500/30",
                  content: "text-green-400 text-xs",
                }}
              >
                Heurístico
              </Chip>
            </div>
            <Calendar alocacoes={greedy.alocacoes} semana={semana} />
            <StatsPanel resultado={greedy} />
          </motion.div>

          {/* ILP column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
              <h2 className="text-xl font-bold text-foreground">
                Integer Linear Programming
              </h2>
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  base: "bg-blue-500/20 border border-blue-500/30",
                  content: "text-blue-400 text-xs",
                }}
              >
                Otimização
              </Chip>
            </div>
            <Calendar alocacoes={ilp.alocacoes} semana={semana} />
            <StatsPanel resultado={ilp} />
          </motion.div>
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
