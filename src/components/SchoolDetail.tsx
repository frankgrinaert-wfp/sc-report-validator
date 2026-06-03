import {
  Ban,
  Check,
  Download,
  ExternalLink,
  Info,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  dailyEntriesMetricConfig,
  dataQualityMetricConfig,
  formatAuditIssueDate,
  progressMetricIndicatorClass,
  getDashboardReportForSchool,
  getSchoolDetail,
  MOCK_DAILY_ENTRIES_BY_ID,
  countAuditIssuesBySeverity,
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

type SchoolDetailContentProps = {
  schoolId: number;
};

export function SchoolDetailContent({ schoolId }: SchoolDetailContentProps) {
  const school = getSchoolDetail(String(schoolId));
  const report = school ? getDashboardReportForSchool(school.id) : undefined;

  if (!school) {
    return <p className="text-muted-foreground text-sm">School not found.</p>;
  }

  const dailyEntries =
    report?.dailyEntries ?? MOCK_DAILY_ENTRIES_BY_ID[school.id] ?? 0;
  const qualityScore = report?.score ?? school.score;
  const issueCounts =
    report?.issueCounts ?? countAuditIssuesBySeverity(REPORT_AUDIT_ISSUES);
  const completenessMetric = dailyEntriesMetricConfig(dailyEntries);
  const qualityMetric = dataQualityMetricConfig(qualityScore);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="tabular-nums">
              {completenessMetric.label}{" "}
              <span className="font-normal">days entered</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={completenessMetric.value}
              className="w-full"
              indicatorClassName={progressMetricIndicatorClass(
                completenessMetric.tone,
              )}
              aria-label={completenessMetric.ariaLabel}
            />
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="tabular-nums">
              {qualityMetric.label}{" "}
              <span className="font-normal">data quality</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={qualityMetric.value}
              className="w-full"
              indicatorClassName={progressMetricIndicatorClass(
                qualityMetric.tone,
              )}
              aria-label={qualityMetric.ariaLabel}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-5 rounded-lg border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="font-semibold text-lg">Data quality issues</h2>
          <Button type="button" variant="outline" size="sm">
            <Download />
            Download
          </Button>
        </div>

        <div className="flex w-full gap-3">
          {AUDIT_ISSUE_SEVERITY_SUMMARY.filter(
            ({ severity }) => issueCounts[severity] > 0,
          ).map(({ severity, label }) => (
            <Item
              key={severity}
              variant="outline"
              className="min-w-0 flex-1 bg-background"
            >
              <ItemMedia>
                <AuditIssueSeverityIcon severity={severity} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
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
                  <Button type="button" variant="link">
                    <ExternalLink />
                    View in report
                  </Button>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </div>
    </div>
  );
}

type SchoolDetailSheetProps = {
  schoolId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SchoolDetailSheet({
  schoolId,
  open,
  onOpenChange,
}: SchoolDetailSheetProps) {
  const school =
    schoolId != null ? getSchoolDetail(String(schoolId)) : undefined;
  const report = school ? getDashboardReportForSchool(school.id) : undefined;
  const periodLabel = report?.periodLabel ?? "May 2025";
  const title = school ? `${school.name} – ${periodLabel}` : "School details";
  const status = report?.status ?? school?.status;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-4xl bg-muted"
      >
        <SheetHeader className="shrink-0 gap-0 bg-background border-b px-6 py-5">
          <div className="flex items-center gap-4 pr-8">
            <SheetTitle className="text-left text-xl">{title}</SheetTitle>
            {status ? (
              <Badge variant={statusBadgeVariant(status)} className="shrink-0">
                {status}
              </Badge>
            ) : null}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {schoolId != null ? (
            <SchoolDetailContent schoolId={schoolId} />
          ) : null}
        </div>
        {school ? (
          <SheetFooter className="bg-background border-t shrink-0 flex-row flex-wrap p-5 items-center justify-between gap-2 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="success-secondary">
                <Check />
                Approve report
              </Button>
              <Button type="button" variant="destructive-secondary">
                <Ban />
                Request corrections
              </Button>
            </div>
            <Button type="button" variant="outline">
              <ExternalLink />
              View report
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
