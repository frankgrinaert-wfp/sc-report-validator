"use client";

import {
  Ban,
  Check,
  Download,
  ExternalLink,
  Flag,
  FlagOff,
  Info,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { ReportIssueCounts } from "@/components/ReportIssueCounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToneProgress } from "@/components/MetricProgress";
import { cn } from "@/lib/utils";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  dailyEntriesMetricConfig,
  dataQualityMetricConfig,
  formatAuditIssueDate,
  REPORT_DAILY_ENTRIES_TOTAL,
  getDashboardReport,
  getSchoolDetail,
  selectAuditIssuesForCounts,
  type ReportAuditIssueSeverity,
  type ReportAuditIssue,
  type SchoolStatus,
} from "@/data/reportDashboard";

function auditIssueKey(issue: ReportAuditIssue) {
  return `${issue.date}:${issue.title}`;
}

function statusBadgeVariant(status: SchoolStatus) {
  switch (status) {
    case "Submitted":
      return "secondary" as const;
    case "Awaiting corrections":
      return "warning" as const;
    case "Approved":
      return "success" as const;
  }
}

function AuditIssueSeverityIcon({
  severity,
  muted = false,
}: {
  severity: ReportAuditIssueSeverity;
  muted?: boolean;
}) {
  const colorClass = muted
    ? "text-neutral-alpha-500"
    : severity === "critical"
      ? "text-danger-500"
      : severity === "high"
        ? "text-warning-500"
        : "text-info-500";

  switch (severity) {
    case "critical":
      return <OctagonX className={cn("size-4", colorClass)} />;
    case "high":
      return <TriangleAlert className={cn("size-4", colorClass)} />;
    case "low":
      return <Info className={cn("size-4", colorClass)} />;
  }
}

type SchoolDetailContentProps = {
  reportId: string;
};

export function SchoolDetailContent({ reportId }: SchoolDetailContentProps) {
  const [unflaggedIssues, setUnflaggedIssues] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    setUnflaggedIssues(new Set());
  }, [reportId]);

  const report = getDashboardReport(reportId);
  const school = report ? getSchoolDetail(String(report.schoolId)) : undefined;

  const toggleIssueFlag = (key: string) => {
    setUnflaggedIssues((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

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
              {completenessMetric.label}
              <span className="font-normal">
                {" "}
                of {REPORT_DAILY_ENTRIES_TOTAL} days entered
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ToneProgress
              value={completenessMetric.value}
              tone={completenessMetric.tone}
              className="w-full"
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
            <ToneProgress
              value={qualityMetric.value}
              tone={qualityMetric.tone}
              className="w-full"
              aria-label={qualityMetric.ariaLabel}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-5 rounded-lg border bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-semibold text-base">Data quality issues</h2>
            <ReportIssueCounts counts={issueCounts} />
          </div>
          <Button type="button" variant="outline" size="sm">
            <Download />
            Download issues
          </Button>
        </div>

        <ItemGroup>
          {auditIssues.map((issue, index) => {
            const key = auditIssueKey(issue);
            const isUnflagged = unflaggedIssues.has(key);

            return (
            <Fragment key={key}>
              {index > 0 ? <ItemSeparator /> : null}
              <Item role="listitem" aria-disabled={isUnflagged}>
                <ItemMedia>
                  <AuditIssueSeverityIcon
                    severity={issue.severity}
                    muted={isUnflagged}
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle
                    className={cn(
                      isUnflagged && "text-neutral-alpha-500 line-through",
                    )}
                  >
                    {issue.title}
                  </ItemTitle>
                  <ItemDescription
                    className={cn(
                      "tabular-nums",
                      isUnflagged && "text-neutral-alpha-500",
                    )}
                  >
                    {formatAuditIssueDate(issue.date)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleIssueFlag(key)}
                        aria-label={isUnflagged ? "Flag" : "Unflag"}
                      >
                        {isUnflagged ? <Flag /> : <FlagOff />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isUnflagged ? "Flag" : "Unflag"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isUnflagged}
                        aria-label="View in report"
                      >
                        <ExternalLink />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View in report</TooltipContent>
                  </Tooltip>
                </ItemActions>
              </Item>
            </Fragment>
            );
          })}
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
              <Badge variant={statusBadgeVariant(status)} className="shrink-0 text-sm">
                {status}
              </Badge>
            ) : null}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">
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
            <Button type="button" variant="link">
              <ExternalLink />
              View report
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
