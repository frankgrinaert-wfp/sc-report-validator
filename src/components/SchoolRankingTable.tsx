import { ChevronRight, Download } from "lucide-react";
import { useState } from "react";
import { ReportIssueCounts } from "@/components/ReportIssueCounts";
import { SchoolDetailSheet } from "@/components/SchoolDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DailyEntriesDisplay,
  MetricProgress,
} from "@/components/MetricProgress";
import {
  dataQualityMetricConfig,
  type DashboardReportRow,
  type SchoolStatus,
} from "@/data/reportDashboard";

type SchoolRankingTableProps = {
  reports: DashboardReportRow[];
};

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

export function SchoolRankingTable({ reports }: SchoolRankingTableProps) {
  const [detailReportId, setDetailReportId] = useState<string | null>(null);

  const handleDownload = (report: DashboardReportRow) => {
    const payload = {
      schoolName: report.schoolName,
      schoolCode: report.schoolCode,
      reportPeriod: report.periodLabel,
      dataQualityScore: report.score,
      reportDate: new Date().toISOString().split("T")[0],
      flaggedIssues: [
        {
          type: "Attendance",
          description: "Attendance is recorded as zero (34 issues)",
          severity: "warning",
        },
        {
          type: "Consumption",
          description:
            "Aggregated daily consumption per student is lower than LNQp ($ basis)",
          severity: "warning",
        },
      ],
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.schoolCode}_${report.monthKey}_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-background shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Days entered</TableHead>
              <TableHead>Data quality</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.reportId}>
                <TableCell>{report.periodLabel}</TableCell>
                <TableCell className="whitespace-normal">
                  {report.schoolName}
                </TableCell>
                <TableCell>
                  <DailyEntriesDisplay entries={report.dailyEntries} />
                </TableCell>
                <TableCell>
                  <MetricProgress {...dataQualityMetricConfig(report.score)} />
                </TableCell>
                <TableCell>
                  <ReportIssueCounts counts={report.issueCounts} />
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(report.status)} className="text-sm">
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleDownload(report)}
                          aria-label="Download issues"
                        >
                          <Download />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download issues</TooltipContent>
                    </Tooltip>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailReportId(report.reportId)}
                    >
                      View details
                      <ChevronRight />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SchoolDetailSheet
        reportId={detailReportId}
        open={detailReportId != null}
        onOpenChange={(open) => {
          if (!open) setDetailReportId(null);
        }}
      />
    </>
  );
}
