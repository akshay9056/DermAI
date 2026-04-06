import { useParams, useNavigate } from "react-router-dom";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ScanLine, User } from "lucide-react";
import { ProbabilityChart } from "@/components/charts/ProbabilityChart";

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const { getPatient } = usePatients();
  const navigate = useNavigate();
  const patient = getPatient(id || "");

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">{patient.patientId}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Patient Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-muted-foreground">{patient.age} yrs · {patient.gender}</p>
              </div>
            </div>
            <div><span className="text-muted-foreground">Visit Date:</span> {patient.visitDate}</div>
            <div><span className="text-muted-foreground">Notes:</span> {patient.notes || "—"}</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Scan History ({patient.scans.length})</CardTitle>
            <Button size="sm" onClick={() => navigate(`/scan?patient=${patient.id}`)}>
              <ScanLine className="h-4 w-4 mr-2" />New Scan
            </Button>
          </CardHeader>
          <CardContent>
            {patient.scans.length === 0 ? (
              <p className="text-muted-foreground text-sm">No scans yet for this patient.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.scans.map((scan) => {
                    const isMal = scan.prediction.prediction === "Malignant";
                    const conf = Math.round((isMal ? scan.prediction.malignant_probability : scan.prediction.benign_probability) * 100);
                    return (
                      <TableRow key={scan.id}>
                        <TableCell>{scan.date}</TableCell>
                        <TableCell className="font-mono text-xs">{scan.prediction.filename}</TableCell>
                        <TableCell>
                          <Badge className={isMal ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}>
                            {scan.prediction.prediction}
                          </Badge>
                        </TableCell>
                        <TableCell>{conf}%</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{scan.doctorNotes || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {patient.scans.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Latest Scan Analysis</CardTitle></CardHeader>
          <CardContent>
            <ProbabilityChart prediction={patient.scans[patient.scans.length - 1].prediction} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
