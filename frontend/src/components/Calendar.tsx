"use client";
import { Card, Tooltip } from "@heroui/react";
import { Alocacao } from "@/lib/types";
import { motion } from "framer-motion";

const EIXO_CONFIG: Record<string, { class: string; label: string; icon: string }> = {
  "Orientação": { class: "eixo-orientacao", label: "ORI", icon: "🎯" },
  "Computação": { class: "eixo-computacao", label: "COMP", icon: "💻" },
  "UX": { class: "eixo-ux", label: "UX", icon: "🎨" },
  "Matemática": { class: "eixo-matematica", label: "MAT", icon: "📐" },
  "Negócios & Liderança": { class: "eixo-negocios", label: "NEG", icon: "📊" },
};

const DIAS_LABELS: Record<string, string> = {
  "Mon": "Segunda",
  "Tue": "Terça",
  "Wed": "Quarta",
  "Thu": "Quinta",
  "Fri": "Sexta",
};

interface CalendarProps {
  alocacoes: Alocacao[];
  semana: number;
}

export function Calendar({ alocacoes, semana }: CalendarProps) {
  const DIAS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const HORARIOS = ["08-10", "10-12", "14-16", "16-18"];

  const getAlocacao = (dia: string, horario: string) => {
    return alocacoes.find(
      (a) => a.semana === semana && a.dia === dia && a.horario === horario
    );
  };

  const formatHorario = (h: string) => {
    const [start, end] = h.split("-");
    return `${start}:00 - ${end}:00`;
  };

  return (
    <Card className="glass-card p-6 overflow-hidden">
      <div className="grid grid-cols-6 gap-3">
        {/* Header row */}
        <div className="flex items-center justify-center p-3">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            Horário
          </span>
        </div>
        {DIAS.map((dia, i) => (
          <motion.div
            key={dia}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-card/50"
          >
            <span className="text-xs text-muted uppercase tracking-wider">
              {dia}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {DIAS_LABELS[dia]}
            </span>
          </motion.div>
        ))}

        {/* Time slots */}
        {HORARIOS.map((horario, rowIndex) => (
          <>
            <motion.div
              key={`time-${horario}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.1 }}
              className="flex items-center justify-center p-3"
            >
              <span className="text-sm font-mono font-medium text-muted">
                {formatHorario(horario)}
              </span>
            </motion.div>
            {DIAS.map((dia, colIndex) => {
              const aloc = getAlocacao(dia, horario);
              const config = aloc ? EIXO_CONFIG[aloc.eixo] : null;

              return (
                <motion.div
                  key={`${dia}-${horario}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: rowIndex * 0.05 + colIndex * 0.03 }}
                >
                  {aloc && config ? (
                    <Tooltip
                      content={
                        <div className="p-2">
                          <p className="font-semibold">{aloc.eixo}</p>
                          <p className="text-sm text-muted">{aloc.professor_nome}</p>
                          <p className="text-xs text-muted mt-1">
                            Custo: R$ {aloc.custo.toFixed(2)}
                          </p>
                        </div>
                      }
                      placement="top"
                      showArrow
                      classNames={{
                        content: "bg-card border border-border",
                      }}
                    >
                      <div
                        className={`calendar-cell ${config.class} p-4 rounded-xl min-h-[90px] flex flex-col justify-between cursor-pointer shadow-lg`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{config.icon}</span>
                          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                            {config.label}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-white/95 leading-tight">
                            {aloc.professor_nome.split(" ").slice(0, 2).join(" ")}
                          </p>
                        </div>
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="min-h-[90px] rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center bg-card/30">
                      <span className="text-xs text-muted/50">—</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(EIXO_CONFIG).map(([eixo, config]) => (
            <div key={eixo} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.class}`} />
              <span className="text-xs text-muted">{eixo}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
