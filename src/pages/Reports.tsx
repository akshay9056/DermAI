import { useState, useMemo } from "react";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Loader2, Printer } from "lucide-react";

export default function Reports() {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [generatedPatientId, setGeneratedPatientId] = useState(""); // ← only set on button click
  const [exporting, setExporting] = useState(false);

  // Report only renders when this is set — NOT when dropdown changes
  const patient = useMemo(
    () => patients.find((p) => p.id === generatedPatientId) || null,
    [patients, generatedPatientId]
  );

  const handlePrint = () => window.print();

  const malignantCount = patient?.scans.filter(
    (s) => s.prediction.prediction === "Malignant"
  ).length ?? 0;
  const benignCount = (patient?.scans.length ?? 0) - malignantCount;

  const reportId = patient
    ? `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${patient.patientId.replace("PT-", "")}`
    : "";

  const reportDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleGenerate = () => {
    if (!selectedPatient) return;
    setGeneratedPatientId(selectedPatient); // report renders only now
  };

  const handleExportPDF = async () => {
    if (!patient) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf").then((m) => ({ jsPDF: m.jsPDF })),
      ]);

      const el = document.getElementById("report-document");
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;

      if (imgH <= pageH) {
        pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH);
      } else {
        let yOffset = 0;
        let remaining = imgH;
        while (remaining > 0) {
          pdf.addImage(imgData, "PNG", 0, -yOffset, pageW, imgH);
          remaining -= pageH;
          yOffset += pageH;
          if (remaining > 0) pdf.addPage();
        }
      }

      pdf.save(`${reportId}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and export patient scan reports</p>
      </div>

      {/* Patient Selector — report does NOT appear until Generate is clicked */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button disabled={!selectedPatient} onClick={handleGenerate}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report only mounts after Generate is clicked */}
      {patient && (
        <>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating PDF...</>
              ) : (
                <><Download className="h-4 w-4 mr-2" />Export PDF</>
              )}
            </Button>
          </div>

          <div
            id="report-document"
            className="rounded-xl border border-border overflow-hidden bg-white text-foreground"
          >
            {/* Header Bar */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">OncoCare Medical Center — Pathology Department</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{reportId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Tumor Analysis Report</p>
                <p className="text-xs text-muted-foreground">{reportDate}</p>
              </div>
            </div>

            <div className="px-8 py-7 space-y-8">
              {/* Patient Info */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5 mb-4">
                  Patient Information
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {[
                    ["Patient Name", patient.name],
                    ["Patient ID", patient.patientId],
                    ["Age / Gender", `${patient.age} yrs · ${patient.gender}`],
                    ["Visit Date", patient.visitDate],
                    ["Total Scans", String(patient.scans.length)],
                    ["Clinical Notes", patient.notes || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Summary Stats */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5 mb-4">
                  Scan Summary
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Scans", value: patient.scans.length, cls: "" },
                    { label: "Malignant", value: malignantCount, cls: "text-destructive" },
                    { label: "Benign", value: benignCount, cls: "text-green-600" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className={`text-2xl font-semibold ${cls}`}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Scan History */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5 mb-4">
                  Scan History &amp; AI Analysis
                </h2>
                <div className="space-y-3">
                  {patient.scans.map((scan, i) => {
                    const isMal = scan.prediction.prediction === "Malignant";
                    const conf = Math.round(
                      (isMal
                        ? scan.prediction.malignant_probability
                        : scan.prediction.benign_probability) * 100
                    );
                    return (
                      <div
                        key={scan.id}
                        className="border border-border rounded-lg p-4 grid grid-cols-[1fr_auto] gap-4 items-start"
                      >
                        <div>
                          <p className="text-sm font-medium">Scan #{i + 1} — {scan.date}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {scan.prediction.filename}
                          </p>
                          {scan.doctorNotes && (
                            <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 mt-2 leading-relaxed">
                              {scan.doctorNotes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <Badge
                            className={
                              isMal
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {scan.prediction.prediction}
                          </Badge>
                          <p className={`text-2xl font-semibold ${isMal ? "text-destructive" : "text-green-600"}`}>
                            {conf}%
                          </p>
                          <p className="text-[11px] text-muted-foreground">confidence</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Disclaimer */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 rounded-r-md p-4 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Clinical Disclaimer: </span>
                This report is generated by an AI-assisted analysis system and is intended to support — not replace — clinical judgment. All findings must be reviewed and confirmed by a qualified medical professional before any diagnostic or treatment decisions are made.
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{patient.name} · {patient.patientId}</span>
              <span>Generated by TumorAI · Confidential Medical Record</span>
            </div>
          </div>
        </>
      )}

      {!patient && patients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No patients found. Add patients first to generate reports.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
