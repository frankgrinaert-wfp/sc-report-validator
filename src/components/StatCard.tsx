import type { SchoolQuality } from "@/data/reportDashboard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type StatCardProps = {
  label: string;
  value: string | number;
  indicator?: SchoolQuality;
};

function qualityBadgeVariant(quality: SchoolQuality) {
  switch (quality) {
    case "excellent":
      return "success" as const;
    case "good":
      return "default" as const;
    case "fair":
      return "warning" as const;
    case "critical":
      return "destructive" as const;
  }
}

export function StatCard({ label, value, indicator }: StatCardProps) {
  const { t } = useLanguage();
  const indicatorText = indicator ? t(`quality.${indicator}`) : null;

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          {indicator ? (
            <Badge variant={qualityBadgeVariant(indicator)} className="capitalize">
              {indicatorText}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-3xl tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
