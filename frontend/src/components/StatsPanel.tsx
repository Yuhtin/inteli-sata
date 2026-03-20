"use client";
import { Card, Progress, Chip } from "@heroui/react";
import { Resultado } from "@/lib/types";
import { motion } from "framer-motion";

interface StatsPanelProps {
  resultado: Resultado;
}

const EIXO_CONFIG: Record<string, { gradient: string; color: string; icon: string }> = {
  "Orientação": { gradient: "from-blue-500 to-blue-600", color: "#3b82f6", icon: "🎯" },
  "Computação": { gradient: "from-green-500 to-green-600", color: "#22c55e", icon: "💻" },
  "UX": { gradient: "from-purple-500 to-purple-600", color: "#a855f7", icon: "🎨" },
  "Matemática": { gradient: "from-orange-500 to-orange-600", color: "#f97316", icon: "📐" },
  "Negócios & Liderança": { gradient: "from-yellow-500 to-yellow-600", color: "#eab308", icon: "📊" },
};

export function StatsPanel({ resultado }: StatsPanelProps) {
  const totalHoras = Object.values(resultado.horas_por_eixo).reduce((a, b) => a + b, 0);
  const maxHoras = Math.max(...Object.values(resultado.horas_por_eixo));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Estatísticas</h2>
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-card border border-border",
              content: "text-muted font-mono text-xs",
            }}
          >
            {resultado.solver_usado.toUpperCase()}
          </Chip>
        </div>

        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-glow p-5 rounded-xl bg-gradient-to-br from-card to-card-hover border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-sm text-muted">Custo Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              R$ {resultado.custo_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-glow p-5 rounded-xl bg-gradient-to-br from-card to-card-hover border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <span className="text-sm text-muted">Alocações</span>
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {resultado.alocacoes.length}
              <span className="text-lg text-muted font-normal ml-2">aulas</span>
            </p>
          </motion.div>
        </div>

        {/* Hours per eixo */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Horas por Eixo
          </h3>

          {Object.entries(resultado.horas_por_eixo).map(([eixo, horas], index) => {
            const config = EIXO_CONFIG[eixo] || { gradient: "from-gray-500 to-gray-600", color: "#71717a", icon: "📖" };
            const percentage = (horas / totalHoras) * 100;
            const barWidth = (horas / maxHoras) * 100;

            return (
              <motion.div
                key={eixo}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-white transition-colors">
                      {eixo}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold" style={{ color: config.color }}>
                      {horas}h
                    </span>
                    <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full border border-border">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total summary */}
        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-sm text-muted">Total de horas</span>
          <span className="font-mono font-bold text-lg text-foreground">{totalHoras}h</span>
        </div>
      </Card>
    </motion.div>
  );
}
