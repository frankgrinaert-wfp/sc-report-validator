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
import { ReportIssueCounts } from "@/components/ReportIssueCounts";
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
  getDashboardReport,
  getSchoolDetail,
  selectAuditIssuesForCounts,
  type ReportAuditIssueSeverity,
  type SchoolStatus,
} from "@/data/reportDashboard";

function statusBadgeVariant(status: SchoolStatus) {
  switch (status) {
    case "Submitted":
      return "default" as const;
    case "Awaiting corrections":
      return "warning" as const;
    case "Approved":
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
      return <OctagonX className="text-danger-500 size-5" />;
    case "high":
      return <TriangleAlert className="text-warning-500 size-5" />;
    case "low":
      return <Info className="text-info-500 size-5" />;
  }
}

type SchoolDetailContentProps = {
  reportId: string;
};

export function SchoolDetailContent({ reportId }: SchoolDetailContentProps) {
  const report = getDashboardReport(reportId);
  const school = report ? getSchoolDetail(String(report.schoolId)) : undefined;

  if (!report || !school) {
    return <p className="text-muted-foreground text-sm">Report not found.</p>;
  }

  const dailyEntries = report.dailyEntries;
  const qualityScore = report.score;
  const issueCounts = report.issueCounts;
  const auditIssues = selectAuditIssuesForCounts(issueCounts);
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-semibold text-lg">Data quality issues</h2>
            <ReportIssueCounts counts={issueCounts} />
          </div>
          <Button type="button" variant="outline" size="sm">
            <Download />
            Download
          </Button>
        </div>

        <ItemGroup>
          {auditIssues.map((issue, index) => (
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
  reportId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SchoolDetailSheet({
  reportId,
  open,
  onOpenChange,
}: SchoolDetailSheetProps) {
  const report = reportId ? getDashboardReport(reportId) : undefined;
  const school = report ? getSchoolDetail(String(report.schoolId)) : undefined;
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
          {reportId != null ? (
            <SchoolDetailContent reportId={reportId} />
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
