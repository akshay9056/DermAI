export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  patientId: string;
  notes: string;
  visitDate: string;
  scans: Scan[];
}

export interface Scan {
  id: string;
  imageUrl: string;
  prediction: PredictionResult;
  date: string;
  doctorNotes: string;
}

export interface PredictionResult {
  filename: string;
  prediction: "Malignant" | "Benign";
  benign_probability: number;
  malignant_probability: number;
  threshold: number;
  note: string;
}
