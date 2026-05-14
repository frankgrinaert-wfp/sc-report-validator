import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  Info,
  List,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ControlPanel } from "@/components/ControlPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dataQualityScoreAccentClass,
  dataQualityScoreTextClass,
  generateHistoricalData,
  getSchoolDetail,
  type SchoolDetailRecord,
  type SchoolStatus,
} from "@/data/reportDashboard";
import { issueLabel, SEVERITY_LABELS } from "@/data/issueLabels";
import { cn } from "@/lib/utils";

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

function issueAlertVariant(severity: string) {
  switch (severity) {
    case "critical":
    case "error":
      return "destructive" as const;
    case "warning":
      return "warning" as const;
    case "info":
      return "info" as const;
    default:
      return "default" as const;
  }
}

function IssueSeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case "critical":
    case "error":
      return <CircleAlert className="size-4" />;
    case "warning":
      return <AlertTriangle className="size-4" />;
    case "info":
      return <Info className="size-4" />;
    default:
      return <Info className="size-4" />;
  }
}

function SchoolStatusSelect({ school }: { school: SchoolDetailRecord }) {
  const [status, setStatus] = useState<SchoolStatus>(school.status);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm">Status</span>
      <Select
        value={status}
        onValueChange={(v) => setStatus(v as SchoolStatus)}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue>
            <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="To be Reviewed">
            <Badge variant="default">To be reviewed</Badge>
          </SelectItem>
          <SelectItem value="Waiting for Corrections">
            <Badge variant="warning">Waiting for corrections</Badge>
          </SelectItem>
          <SelectItem value="Accepted">
            <Badge variant="success">Accepted</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SchoolDetail() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const school = getSchoolDetail(schoolId);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    const handleToggle = () => setIsPanelOpen((prev) => !prev);
    window.addEventListener("togglePanel", handleToggle);
    return () => window.removeEventListener("togglePanel", handleToggle);
  }, []);

  const historicalData = useMemo(() => {
    if (!school) return [];
    return generateHistoricalData(school.score, school.id);
  }, [school]);

  if (!school) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>School not found</AlertTitle>
          <AlertDescription>
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Back to list
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handlePrevious = () => {
    navigate(`/school/${Math.max(1, school.id - 1)}`);
  };

  const handleNext = () => {
    navigate(`/school/${Math.min(20, school.id + 1)}`);
  };

  const sortedIssues = [...school.issues].sort((a, b) => {
    const severityOrder: Record<string, number> = {
      warning: 1,
      error: 2,
      critical: 2,
      info: 3,
    };
    return (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4);
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="relative flex flex-1 overflow-hidden">
        {!isPanelOpen ? (
          <div className="absolute top-2 left-0 z-10 flex flex-col items-center gap-2 rounded-e-md border border-border bg-card p-2 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsPanelOpen(true)}
              aria-label="Show control panel"
              title="Show control panel"
            >
              <ChevronRight />
            </Button>
            <span className="max-w-16 text-center text-muted-foreground text-xs font-medium">
              Control panel
            </span>
          </div>
        ) : null}

        <div
          className={`shrink-0 overflow-hidden border-e border-border transition-[width] duration-300 ease-in-out ${
            isPanelOpen ? "w-72" : "w-0"
          }`}
        >
          <ControlPanel />
        </div>

        <div className="flex-1 overflow-y-auto bg-muted">
          <div className="mx-auto max-w-5xl p-8">
            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate("/")}
              >
                <ChevronLeft />
                Back
              </Button>
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">{school.name}</CardTitle>
                <CardDescription>Month: 2025-05</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-border border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <SchoolStatusSelect key={school.id} school={school} />
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" className="gap-2">
                    <Download />
                    Download issues report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => navigate("/")}
                  >
                    <List />
                    Back to list
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Average school attendance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="font-semibold tabular-nums">
                      {(
                        (school.attendance.total / school.enrollment.total) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Boys</span>
                    <span className="font-semibold tabular-nums">
                      {(
                        (school.attendance.boys / school.enrollment.boys) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Girls</span>
                    <span className="font-semibold tabular-nums">
                      {(
                        (school.attendance.girls / school.enrollment.girls) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meals delivered</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      Total meals delivered
                    </span>
                    <span className="font-semibold tabular-nums">
                      {school.totalMeals.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      Average meals per day
                    </span>
                    <span className="font-semibold tabular-nums">
                      {school.avgMealsPerDay}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex gap-3">
                  <Info className="mt-1 size-5 shrink-0 text-primary" />
                  <div>
                    <CardTitle>Data quality score</CardTitle>
                    <CardDescription>
                      Overall assessment of data completeness and accuracy
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 border-border border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current score</span>
                  <span
                    className={cn(
                      "font-bold text-2xl tabular-nums",
                      dataQualityScoreTextClass(school.score),
                    )}
                  >
                    {school.score}%
                  </span>
                </div>
                <meter
                  className={cn(
                    "h-2 w-full",
                    dataQualityScoreAccentClass(school.score),
                  )}
                  min={0}
                  max={100}
                  value={school.score}
                >
                  {school.score}%
                </meter>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="mb-4 font-semibold text-lg">Flagged issues</h2>
              <div className="flex flex-col gap-3">
                {sortedIssues.map((issue, index) => {
                  const translatedIssue = issueLabel(issue.issueKey);
                  const displayIssue = issue.commodity
                    ? translatedIssue.replace("{commodity}", String(issue.commodity))
                    : translatedIssue;

                  return (
                    <Card key={`issue-${index}`} className="gap-0 py-0">
                      <details className="group">
                        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <div className="p-0">
                            <Alert variant={issueAlertVariant(issue.severity)}>
                              <IssueSeverityIcon severity={issue.severity} />
                              <AlertTitle>
                                {SEVERITY_LABELS[issue.severity] ?? issue.severity}
                              </AlertTitle>
                              <AlertDescription>
                                {displayIssue} (
                                {issue.occurrences.length}{" "}
                                {issue.occurrences.length !== 1
                                  ? "occurrences"
                                  : "occurrence"}
                                )
                              </AlertDescription>
                            </Alert>
                          </div>
                        </summary>
                        <CardContent className="border-border border-t pt-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border text-left">
                                  <th className="px-3 py-2 font-semibold">Date</th>
                                  <th className="px-3 py-2 font-semibold">
                                    {issue.metric}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {issue.occurrences.map((occurrence, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-border last:border-0"
                                  >
                                    <td className="px-3 py-2 tabular-nums">
                                      {occurrence.date}
                                    </td>
                                    <td className="px-3 py-2">
                                      {String(occurrence.value)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </details>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex gap-3">
                  <Info className="mt-1 size-5 shrink-0 text-primary" />
                  <div>
                    <CardTitle>Historical data quality score</CardTitle>
                    <CardDescription>
                      Trend of data quality scores over the last 12 months
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="border-border border-t pt-6">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                        angle={-45}
                        textAnchor="end"
                        height={72}
                      />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <Tooltip
                        formatter={(value) => [value ?? "", "Current score"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--primary)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between border-border border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={school.id === 1}
                className="gap-2"
              >
                <ChevronLeft />
                Previous school
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleNext}
                disabled={school.id === 20}
                className="gap-2"
              >
                Next school
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
