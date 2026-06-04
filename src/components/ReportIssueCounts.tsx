import { Info, OctagonX, TriangleAlert } from "lucide-react";
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
      return <OctagonX className="size-4 text-danger-500" aria-hidden />;
    case "high":
      return <TriangleAlert className="size-4 text-warning-500" aria-hidden />;
    case "low":
      return <Info className="size-4 text-info-500" aria-hidden />;
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
    <div className="flex items-center gap-3">
      {visible.map(({ severity, label }) => (
        <span
          key={severity}
          className="inline-flex items-center gap-1 tabular-nums"
          aria-label={`${counts[severity]} ${label}`}
        >
          <AuditIssueSeverityIcon severity={severity} />
          <span className="text-foreground text-sm">{counts[severity]}</span>
        </span>
      ))}
    </div>
  );
}
