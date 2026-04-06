import axios from "axios";
import type { PredictionResult } from "@/types/patient";

const apiClient = axios.create({
  baseURL: "https://final-year-backend-henp.onrender.com",
});

export const predictTumor = async (imageFile: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", imageFile);
  const { data } = await apiClient.post<PredictionResult>("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
