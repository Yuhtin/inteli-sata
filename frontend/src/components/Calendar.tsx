// frontend/src/components/Calendar.tsx
"use client";
import React from "react";
import { Alocacao } from "@/lib/types";

const EIXO_COLORS: Record<string, string> = {
  "Orientação": "bg-blue-500",
  "Computação": "bg-green-500",
  "UX": "bg-purple-500",
  "Matemática": "bg-orange-500",
  "Negócios & Liderança": "bg-yellow-500",
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
      a => a.semana === semana && a.dia === dia && a.horario === horario
    );
  };

  return (
    <div className="grid grid-cols-6 gap-1">
      <div className="p-2 font-bold">Horário</div>
      {DIAS.map(dia => (
        <div key={dia} className="p-2 font-bold text-center">{dia}</div>
      ))}

      {HORARIOS.map(horario => (
        <React.Fragment key={horario}>
          <div className="p-2 font-medium">{horario}</div>
          {DIAS.map(dia => {
            const aloc = getAlocacao(dia, horario);
            return (
              <div
                key={`${dia}-${horario}`}
                className={`p-2 rounded ${aloc ? EIXO_COLORS[aloc.eixo] || "bg-gray-300" : "bg-gray-100"} text-white text-sm min-h-[60px]`}
              >
                {aloc ? (
                  <>
                    <div className="font-bold text-xs">{aloc.eixo}</div>
                    <div className="text-xs opacity-90">{aloc.professor_nome}</div>
                  </>
                ) : null}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
