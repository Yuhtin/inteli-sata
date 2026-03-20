// frontend/src/components/WeekSelector.tsx
"use client";

interface WeekSelectorProps {
  semana: number;
  maxSemanas: number;
  onChange: (semana: number) => void;
}

export function WeekSelector({ semana, maxSemanas, onChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(1, semana - 1))}
        disabled={semana <= 1}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        ◄
      </button>
      <select
        value={semana}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-4 py-2 border rounded"
      >
        {Array.from({ length: maxSemanas }, (_, i) => i + 1).map(s => (
          <option key={s} value={s}>Semana {s}</option>
        ))}
      </select>
      <button
        onClick={() => onChange(Math.min(maxSemanas, semana + 1))}
        disabled={semana >= maxSemanas}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        ►
      </button>
    </div>
  );
}
