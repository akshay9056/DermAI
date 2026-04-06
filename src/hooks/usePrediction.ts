import { useState } from "react";
import { predictTumor } from "@/services/api";
import type { PredictionResult } from "@/types/patient";

export function usePrediction() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await predictTumor(file);
      setResult(data);
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || "Prediction failed";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, loading, error, predict, reset };
}
