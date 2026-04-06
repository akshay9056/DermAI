import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and export scan reports</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Coming Soon</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Report generation and PDF export will be available in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
