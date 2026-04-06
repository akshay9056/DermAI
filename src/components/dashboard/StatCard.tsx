import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  variant?: "default" | "success" | "destructive" | "primary";
}

const variantClasses: Record<string, string> = {
  default: "text-foreground",
  success: "text-success",
  destructive: "text-destructive",
  primary: "text-primary",
};

export function StatCard({ title, value, icon, variant = "default" }: StatCardProps) {
  return (
    <Card className="stat-card-shadow">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`rounded-lg p-3 bg-muted ${variantClasses[variant]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${variantClasses[variant]}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
