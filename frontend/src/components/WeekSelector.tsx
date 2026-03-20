"use client";
import { Button, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";

interface WeekSelectorProps {
  semana: number;
  maxSemanas: number;
  onChange: (semana: number) => void;
}

export function WeekSelector({ semana, maxSemanas, onChange }: WeekSelectorProps) {
  const weeks = Array.from({ length: maxSemanas }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <Button
        isIconOnly
        variant="flat"
        onPress={() => onChange(Math.max(1, semana - 1))}
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

      <div className="relative">
        <Select
          selectedKeys={[String(semana)]}
          onChange={(e) => onChange(Number(e.target.value))}
          classNames={{
            trigger: "bg-card border border-border hover:bg-card-hover min-w-[180px] h-12",
            value: "text-foreground font-medium",
            popoverContent: "bg-card border border-border",
          }}
          aria-label="Selecionar semana"
          disallowEmptySelection
        >
          {weeks.map((w) => (
            <SelectItem key={String(w)} textValue={`Semana ${w}`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    w === semana ? "bg-accent-blue pulse-ring" : "bg-muted"
                  }`}
                />
                <span>Semana {w}</span>
                {w === semana && (
                  <span className="ml-auto text-xs text-accent-blue">Atual</span>
                )}
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>

      <Button
        isIconOnly
        variant="flat"
        onPress={() => onChange(Math.min(maxSemanas, semana + 1))}
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

      <div className="ml-4 flex items-center gap-2 text-sm text-muted">
        <span className="font-mono bg-card px-2 py-1 rounded border border-border">
          {semana}/{maxSemanas}
        </span>
        <span>semanas</span>
      </div>
    </motion.div>
  );
}
