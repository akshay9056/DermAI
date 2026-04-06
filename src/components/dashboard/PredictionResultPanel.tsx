import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { PredictionResult } from "@/types/patient";
import { ProbabilityChart } from "@/components/charts/ProbabilityChart";

interface PredictionResultPanelProps {
  prediction: PredictionResult;
  imagePreview?: string;
  timestamp?: string;
}

export function PredictionResultPanel({ prediction, imagePreview, timestamp }: PredictionResultPanelProps) {
  const isMalignant = prediction.prediction === "Malignant";
  const confidence = Math.round(
    (isMalignant ? prediction.malignant_probability : prediction.benign_probability) * 100
  );
  const isHighRisk = prediction.malignant_probability > 0.7;

  return (
    <div className="space-y-4">
      {isHighRisk && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-medium text-destructive">
            Warning: High malignancy probability ({Math.round(prediction.malignant_probability * 100)}%). Immediate follow-up recommended.
          </span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">AI Prediction Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {isMalignant ? (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            ) : (
              <CheckCircle className="h-8 w-8 text-success" />
            )}
            <div>
              <Badge
                className={
                  isMalignant
                    ? "bg-destructive text-destructive-foreground text-base px-4 py-1"
                    : "bg-success text-success-foreground text-base px-4 py-1"
                }
              >
                {prediction.prediction}
              </Badge>
              <p className="mt-1 text-sm text-muted-foreground">
                Confidence: {confidence}%
              </p>
            </div>
          </div>

          <ProbabilityChart prediction={prediction} />

          {imagePreview && (
            <div>
              <p className="text-sm font-medium mb-2">Uploaded Image</p>
              <img
                src={imagePreview}
                alt="Tumor scan"
                className="max-w-xs rounded-lg border"
              />
            </div>
          )}

          {timestamp && (
            <p className="text-xs text-muted-foreground">
              Analysis performed: {timestamp}
            </p>
          )}

          <p className="text-xs text-muted-foreground italic">
            {prediction.note}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
