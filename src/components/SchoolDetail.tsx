import {
  ArrowLeft,
  Ban,
  Check,
  Download,
  Info,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { MetricProgress } from "@/components/MetricProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dailyEntriesMetricConfig,
  dataQualityMetricConfig,
  formatAuditIssueDate,
  getDashboardReportForSchool,
  getSchoolDetail,
  MOCK_DAILY_ENTRIES_BY_ID,
  REPORT_AUDIT_ISSUES,
  type ReportAuditIssueSeverity,
  type SchoolStatus,
} from "@/data/reportDashboard";

function statusBadgeVariant(status: SchoolStatus) {
  switch (status) {
    case "To review":
      return "default" as const;
    case "Corrections requested":
      return "warning" as const;
    case "Accepted":
      return "success" as const;
  }
}

function AuditIssueSeverityIcon({
  severity,
}: {
  severity: ReportAuditIssueSeverity;
}) {
  switch (severity) {
    case "critical":
      return (
        <OctagonX className="size-5 text-danger-500" aria-label="Critical" />
      );
    case "high":
      return (
        <TriangleAlert className="size-5 text-warning-500" aria-label="High" />
      );
    case "low":
      return <Info className="size-5 text-info-500" aria-label="Low" />;
  }
}

export function SchoolDetail() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const school = getSchoolDetail(schoolId);
  const report = school ? getDashboardReportForSchool(school.id) : undefined;

  if (!school) {
    return (
      <div className="p-8">
        <p className="mb-4 text-muted-foreground">School not found.</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft />
        </Button>
      </div>
    );
  }

  const periodLabel = report?.periodLabel ?? "May 2025";
  const status = report?.status ?? school.status;
  const dailyEntries =
    report?.dailyEntries ?? MOCK_DAILY_ENTRIES_BY_ID[school.id] ?? 0;
  const qualityScore = report?.score ?? school.score;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="font-bold text-3xl">
              {school.name} – {periodLabel}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-medium">Report review</p>
            <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricProgress
                  {...dailyEntriesMetricConfig(dailyEntries)}
                  layout="stacked"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data quality</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricProgress
                  {...dataQualityMetricConfig(qualityScore)}
                  layout="stacked"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="success-secondary">
              <Check />
              Approve
            </Button>
            <Button type="button" variant="destructive-secondary">
              <Ban />
              Request corrections
            </Button>
            <Button type="button" variant="outline">
              View report
            </Button>
            <Button type="button" variant="outline">
              <Download />
              Download
            </Button>
          </div>

          <h2 className="font-semibold text-xl">Data quality issues</h2>

          <div className="overflow-hidden rounded-lg bg-background shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REPORT_AUDIT_ISSUES.map((issue) => (
                  <TableRow key={issue.date}>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatAuditIssueDate(issue.date)}
                    </TableCell>
                    <TableCell className="w-px">
                      <AuditIssueSeverityIcon severity={issue.severity} />
                    </TableCell>
                    <TableCell>{issue.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
