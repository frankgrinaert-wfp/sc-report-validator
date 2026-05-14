import { Download } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  SchoolDashboardRow,
  SchoolQuality,
  SchoolStatus,
} from "@/data/reportDashboard";

type SchoolRankingTableProps = {
  schools: SchoolDashboardRow[];
};

function statusBadgeVariant(status: SchoolStatus) {
  switch (status) {
    case "To be Reviewed":
      return "default" as const;
    case "Waiting for Corrections":
      return "warning" as const;
    case "Accepted":
      return "success" as const;
  }
}

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

export function SchoolRankingTable({ schools }: SchoolRankingTableProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getStatusText = (status: SchoolStatus) => {
    switch (status) {
      case "To be Reviewed":
        return t("status.toBeReviewed");
      case "Waiting for Corrections":
        return t("status.waitingCorrections");
      case "Accepted":
        return t("status.accepted");
    }
  };

  const getQualityText = (quality: SchoolQuality) => {
    switch (quality) {
      case "excellent":
        return t("quality.excellent");
      case "good":
        return t("quality.good");
      case "fair":
        return t("quality.fair");
      case "critical":
        return t("quality.critical");
    }
  };

  const handleDownload = (school: SchoolDashboardRow) => {
    const report = {
      schoolName: school.name,
      schoolCode: school.code,
      dataQualityScore: school.score,
      qualityLevel: school.quality,
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

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${school.code}_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="gap-0 py-0">
      <CardContent className="overflow-x-auto px-0 py-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left">
              <th className="px-4 py-3 font-semibold">{t("table.rank")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.schoolName")}</th>
              <th className="px-4 py-3 font-semibold">{t("table.score")}</th>
              <th className="px-4 py-3 font-semibold">
                {t("table.qualityLevel")}
              </th>
              <th className="px-4 py-3 font-semibold">{t("table.status")}</th>
              <th className="px-4 py-3 text-end font-semibold">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, index) => (
              <tr
                key={school.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{school.name}</td>
                <td className="px-4 py-3 tabular-nums">
                  <span className="font-semibold">{school.score}%</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={qualityBadgeVariant(school.quality)}>
                    {getQualityText(school.quality)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant(school.status)}>
                    {getStatusText(school.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/school/${school.id}`)}
                    >
                      {t("table.viewDetails")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleDownload(school)}
                      aria-label={t("detail.downloadReport")}
                    >
                      <Download />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
