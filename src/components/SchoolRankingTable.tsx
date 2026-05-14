import { Download } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  SchoolDashboardRow,
  SchoolQuality,
  SchoolStatus,
} from "@/data/reportDashboard";

type SchoolRankingTableProps = {
  schools: SchoolDashboardRow[];
};

const QUALITY_LABELS: Record<SchoolQuality, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  critical: "Critical",
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
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">School name</th>
              <th className="px-4 py-3 font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Quality level</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-end font-semibold">Actions</th>
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
                    {QUALITY_LABELS[school.quality]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant(school.status)}>
                    {school.status}
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
                      View details
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleDownload(school)}
                      aria-label="Download issues report"
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
