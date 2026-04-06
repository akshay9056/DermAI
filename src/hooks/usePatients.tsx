import { createContext, useContext, useState, type ReactNode } from "react";
import type { Patient, Scan } from "@/types/patient";
import { mockPatients } from "@/lib/mock-data";

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "scans">) => void;
  addScan: (patientId: string, scan: Scan) => void;
  getPatient: (id: string) => Patient | undefined;
  updatePatientNotes: (patientId: string, notes: string) => void;
  updateScanNotes: (patientId: string, scanId: string, notes: string) => void;
}

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  const addPatient = (patient: Omit<Patient, "id" | "scans">) => {
    const newPatient: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      scans: [],
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const addScan = (patientId: string, scan: Scan) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, scans: [...p.scans, scan] } : p
      )
    );
  };

  const getPatient = (id: string) => patients.find((p) => p.id === id);

  const updatePatientNotes = (patientId: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, notes } : p))
    );
  };

  const updateScanNotes = (patientId: string, scanId: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              scans: p.scans.map((s) =>
                s.id === scanId ? { ...s, doctorNotes: notes } : s
              ),
            }
          : p
      )
    );
  };

  return (
    <PatientContext.Provider
      value={{ patients, addPatient, addScan, getPatient, updatePatientNotes, updateScanNotes }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error("usePatients must be used within PatientProvider");
  return ctx;
}
