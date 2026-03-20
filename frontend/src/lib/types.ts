// frontend/src/lib/types.ts
export interface Alocacao {
  semana: number;
  dia: string;
  horario: string;
  eixo: string;
  professor_id: string;
  professor_nome: string;
  custo: number;
}

export interface Resultado {
  alocacoes: Alocacao[];
  custo_total: number;
  solver_usado: string;
  horas_por_eixo: Record<string, number>;
}
