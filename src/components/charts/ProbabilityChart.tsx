import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import type { PredictionResult } from "@/types/patient";

interface ProbabilityChartProps {
  prediction: PredictionResult;
}

export function ProbabilityChart({ prediction }: ProbabilityChartProps) {
  const data = [
    { name: "Benign", value: Math.round(prediction.benign_probability * 100) },
    { name: "Malignant", value: Math.round(prediction.malignant_probability * 100) },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={36}>
            <Cell fill="hsl(142, 71%, 45%)" />
            <Cell fill="hsl(0, 84%, 60%)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
