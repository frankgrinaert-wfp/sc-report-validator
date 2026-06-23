import { Info, OctagonX, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  ReportAuditIssueSeverity,
  ReportIssueCounts,
} from "@/data/reportDashboard";

const ISSUE_COUNT_DISPLAY: {
  severity: ReportAuditIssueSeverity;
  label: string;
}[] = [
  { severity: "critical", label: "critical issues" },
  { severity: "high", label: "important issues" },
  { severity: "low", label: "trivial issues" },
];

function AuditIssueSeverityIcon({
  severity,
}: {
  severity: ReportAuditIssueSeverity;
}) {
  switch (severity) {
    case "critical":
      return <OctagonX aria-hidden />;
    case "high":
      return <TriangleAlert aria-hidden />;
    case "low":
      return <Info aria-hidden />;
  }
}

function severityBadgeVariant(severity: ReportAuditIssueSeverity) {
  switch (severity) {
    case "critical":
      return "destructive" as const;
    case "high":
      return "warning" as const;
    case "low":
      return "default" as const;
  }
}

type ReportIssueCountsProps = {
  counts: ReportIssueCounts;
};

export function ReportIssueCounts({ counts }: ReportIssueCountsProps) {
  const visible = ISSUE_COUNT_DISPLAY.filter(
    ({ severity }) => counts[severity] > 0,
  );

  if (visible.length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map(({ severity, label }) => (
        <Badge
          key={severity}
          variant={severityBadgeVariant(severity)}
          className="tabular-nums text-sm"
          aria-label={`${counts[severity]} ${label}`}
        >
          <AuditIssueSeverityIcon severity={severity} />
          {counts[severity]}
        </Badge>
      ))}
    </div>
  );
}
