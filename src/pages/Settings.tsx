import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Application configuration</p>
      </div>
      <Card>
        <CardHeader><CardTitle>API Configuration</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
      {/* Architecture Row */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">Architecture</span>
        <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
          EfficientNet-B0
        </code>
      </div>

      {/* Backend Row */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">Backend API Endpoint</span>
        <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground break-all">
          https://final-year-backend-henp.onrender.com
        </code>
      </div>

      {/* Resolution Row */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">Input Resolution</span>
        <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
          224x224
        </code>
      </div>
    </div>
  </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Frontend Configuration</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Framework
              </span>
              <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
                React + TypeScript
              </code>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Deployment
              </span>
              <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
                Vercel
              </code>
            </div>

          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Institution
              </span>
              <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
                Karunya Institute of Technology and Sciences (Deemed University)
              </code>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Application Title
              </span>
              <code className="w-fit bg-muted px-2 py-1 rounded text-sm text-foreground">
                DermAI – AI Powered Skin Tumor Detection
              </code>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
