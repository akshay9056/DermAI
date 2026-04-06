import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePatients } from "@/hooks/usePatients";
import { usePrediction } from "@/hooks/usePrediction";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { PredictionResultPanel } from "@/components/dashboard/PredictionResultPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

export default function UploadScan() {
  const [searchParams] = useSearchParams();
  const preselectedPatient = searchParams.get("patient") || "";
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatient);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const { patients, addScan } = usePatients();
  const { result, loading, error, predict, reset } = usePrediction();
  const navigate = useNavigate();

  const handleFileSelected = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(f);
    reset();
  };

  const handlePredict = async () => {
    if (!file) return;
    const ts = new Date().toLocaleString();
    setTimestamp(ts);
    const res = await predict(file);
    if (res && selectedPatient) {
      addScan(selectedPatient, {
        id: crypto.randomUUID(),
        imageUrl: imagePreview || "",
        prediction: res,
        date: new Date().toISOString().split("T")[0],
        doctorNotes,
      });
    }
  };

  const patientName = useMemo(() => {
    return patients.find((p) => p.id === selectedPatient)?.name || "";
  }, [patients, selectedPatient]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">New Scan</h1>
        <p className="text-muted-foreground">Upload a tumor image for AI analysis</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Select Patient</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger><SelectValue placeholder="Choose patient" /></SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.patientId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Upload Tumor Image</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload onFileSelected={handleFileSelected} disabled={loading} />

          <div className="space-y-2">
            <Label>Doctor Notes</Label>
            <Textarea
              placeholder="Add clinical observations..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            className="w-full"
            disabled={!file || loading}
            onClick={handlePredict}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AI model analyzing tumor image...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze Image
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
        </CardContent>
      </Card>

      {result && (
        <PredictionResultPanel
          prediction={result}
          imagePreview={imagePreview || undefined}
          timestamp={timestamp || undefined}
        />
      )}
    </div>
  );
}
