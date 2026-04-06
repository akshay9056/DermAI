import { Users, ScanLine, AlertTriangle, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { patients } = usePatients();

  const totalScans = patients.reduce((sum, p) => sum + p.scans.length, 0);
  const malignantCount = patients.reduce(
    (sum, p) => sum + p.scans.filter((s) => s.prediction.prediction === "Malignant").length,
    0
  );
  const benignCount = totalScans - malignantCount;

  const recentScans = patients
    .flatMap((p) => p.scans.map((s) => ({ ...s, patientName: p.name, patientId: p.patientId })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of patient scans and AI predictions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Patients" value={patients.length} icon={<Users className="h-5 w-5" />} variant="primary" />
        <StatCard title="Total Scans" value={totalScans} icon={<ScanLine className="h-5 w-5" />} />
        <StatCard title="Malignant" value={malignantCount} icon={<AlertTriangle className="h-5 w-5" />} variant="destructive" />
        <StatCard title="Benign" value={benignCount} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <p className="text-muted-foreground text-sm">No scans yet.</p>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{scan.patientName}</p>
                    <p className="text-xs text-muted-foreground">{scan.patientId} · {scan.date}</p>
                  </div>
                  <Badge
                    className={
                      scan.prediction.prediction === "Malignant"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-success text-success-foreground"
                    }
                  >
                    {scan.prediction.prediction}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
