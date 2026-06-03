import {
  ArrowLeft,
  Ban,
  Check,
  Download,
  ExternalLink,
  Info,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router";
import { MetricProgress } from "@/components/MetricProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
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

const AUDIT_ISSUE_SEVERITY_SUMMARY: {
  severity: ReportAuditIssueSeverity;
  label: string;
}[] = [
  { severity: "critical", label: "critical" },
  { severity: "high", label: "important" },
  { severity: "low", label: "trivial" },
];

function AuditIssueSeverityIcon({
  severity,
}: {
  severity: ReportAuditIssueSeverity;
}) {
  switch (severity) {
    case "critical":
      return <OctagonX className="text-danger-500 size-5" />;
    case "high":
      return <TriangleAlert className="text-warning-500 size-5" />;
    case "low":
      return <Info className="text-info-500 size-5" />;
  }
}

function countAuditIssuesBySeverity(
  issues: typeof REPORT_AUDIT_ISSUES,
): Record<ReportAuditIssueSeverity, number> {
  return issues.reduce(
    (counts, issue) => {
      counts[issue.severity] += 1;
      return counts;
    },
    { critical: 0, high: 0, low: 0 },
  );
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
  const issueCounts = countAuditIssuesBySeverity(REPORT_AUDIT_ISSUES);

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
            <p className="text-muted-foreground text-sm">Report review</p>
            <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="success-secondary">
              <Check />
              Approve report
            </Button>
            <Button type="button" variant="destructive-secondary">
              <Ban />
              Request corrections
            </Button>
            <Button type="button" variant="outline">
              <ExternalLink />
              View report
            </Button>
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

          <div className="overflow-hidden rounded-lg bg-background shadow-sm p-5 flex flex-col gap-5 border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-semibold text-xl">Data quality issues</h2>
              <Button type="button" variant="outline">
                <Download />
                Download
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {AUDIT_ISSUE_SEVERITY_SUMMARY.map(({ severity, label }) => (
                <Item
                  key={severity}
                  variant="outline"
                  className="bg-background"
                >
                  <ItemMedia>
                    <AuditIssueSeverityIcon severity={severity} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">
                      {issueCounts[severity]} {label}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </div>

            <ItemGroup>
              {REPORT_AUDIT_ISSUES.map((issue, index) => (
                <Fragment key={issue.date}>
                  {index > 0 ? <ItemSeparator /> : null}
                  <Item role="listitem">
                    <ItemMedia>
                      <AuditIssueSeverityIcon severity={issue.severity} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{issue.title}</ItemTitle>
                      <ItemDescription className="tabular-nums">
                        {formatAuditIssueDate(issue.date)}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button type="button" variant="outline">
                        <ExternalLink />
                        View
                      </Button>
                    </ItemActions>
                  </Item>
                </Fragment>
              ))}
            </ItemGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
