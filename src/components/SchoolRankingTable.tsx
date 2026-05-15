import { Download } from "lucide-react";
import { useNavigate } from "react-router";
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
  dataQualityScoreTextClass,
  type SchoolDashboardRow,
  type SchoolStatus,
} from "@/data/reportDashboard";
import { cn } from "@/lib/utils";

type SchoolRankingTableProps = {
  schools: SchoolDashboardRow[];
};

function statusBadgeVariant(status: SchoolStatus) {
  switch (status) {
    case "To be reviewed":
      return "default" as const;
    case "Waiting for corrections":
      return "warning" as const;
    case "Accepted":
      return "success" as const;
  }
}

export function SchoolRankingTable({ schools }: SchoolRankingTableProps) {
  const navigate = useNavigate();

  const handleDownload = (school: SchoolDashboardRow) => {
    const report = {
      schoolName: school.name,
      schoolCode: school.code,
      dataQualityScore: school.score,
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>School</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schools.map((school, index) => (
          <TableRow key={school.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{school.name}</TableCell>
            <TableCell>
              <span className={cn(dataQualityScoreTextClass(school.score))}>
                {school.score}%
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={statusBadgeVariant(school.status)}>
                {school.status}
              </Badge>
            </TableCell>
            <TableCell className="w-px text-right">
              <div className="inline-flex items-center gap-2">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
