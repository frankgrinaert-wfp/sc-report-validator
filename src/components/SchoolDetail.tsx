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
import { AppHeader } from "@/components/AppHeader";
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
import { useLanguage } from "@/contexts/LanguageContext";
import {
  generateHistoricalData,
  getSchoolDetail,
  type SchoolDetailRecord,
  type SchoolStatus,
} from "@/data/reportDashboard";

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
  const { t } = useLanguage();
  const [status, setStatus] = useState<SchoolStatus>(school.status);

  const getStatusText = (s: SchoolStatus) => {
    switch (s) {
      case "To be Reviewed":
        return t("status.toBeReviewed");
      case "Waiting for Corrections":
        return t("status.waitingCorrections");
      case "Accepted":
        return t("status.accepted");
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm">{t("detail.status")}</span>
      <Select
        value={status}
        onValueChange={(v) => setStatus(v as SchoolStatus)}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue>
            <Badge variant={statusBadgeVariant(status)}>
              {getStatusText(status)}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="To be Reviewed">
            <Badge variant="default">{t("status.toBeReviewed")}</Badge>
          </SelectItem>
          <SelectItem value="Waiting for Corrections">
            <Badge variant="warning">{t("status.waitingCorrections")}</Badge>
          </SelectItem>
          <SelectItem value="Accepted">
            <Badge variant="success">{t("status.accepted")}</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SchoolDetail() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
              {t("detail.backToList")}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getQualityText = (quality: string) => {
    switch (quality) {
      case "excellent":
        return t("quality.excellent");
      case "good":
        return t("quality.good");
      case "fair":
        return t("quality.fair");
      case "critical":
        return t("quality.critical");
      default:
        return quality;
    }
  };

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
      <AppHeader title={t("app.title")} onHome={() => navigate("/")} />

      <div className="relative flex flex-1 overflow-hidden">
        {!isPanelOpen ? (
          <div className="absolute top-2 left-0 z-10 flex flex-col items-center gap-2 rounded-e-md border border-border bg-card p-2 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsPanelOpen(true)}
              aria-label={t("aria.showPanel")}
              title={t("aria.showPanel")}
            >
              <ChevronRight />
            </Button>
            <span className="max-w-16 text-center text-muted-foreground text-xs font-medium">
              {t("panel.title")}
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
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">{school.name}</CardTitle>
                <CardDescription>{t("detail.month")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-border border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <SchoolStatusSelect key={school.id} school={school} />
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" className="gap-2">
                    <Download />
                    {t("detail.downloadReport")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => navigate("/")}
                  >
                    <List />
                    {t("detail.backToList")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.avgAttendance")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.total")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {(
                        (school.attendance.total / school.enrollment.total) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.boys")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {(
                        (school.attendance.boys / school.enrollment.boys) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.girls")}
                    </span>
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
                  <CardTitle>{t("dashboard.mealsDelivered")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.totalMealsDelivered")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {school.totalMeals.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.avgMealsPerDay")}
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
                    <CardTitle>{t("detail.dataQuality")}</CardTitle>
                    <CardDescription>{t("detail.dataQualityDesc")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 border-border border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("detail.currentScore")}</span>
                  <span className="font-bold text-2xl text-primary tabular-nums">
                    {school.score}%
                  </span>
                </div>
                <meter
                  className="h-2 w-full accent-primary"
                  min={0}
                  max={100}
                  value={school.score}
                >
                  {school.score}%
                </meter>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span>{t("detail.qualityLevel")}</span>
                  <Badge variant="warning" className="capitalize">
                    {getQualityText(school.quality)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="mb-4 font-semibold text-lg">
                {t("detail.flaggedIssues")}
              </h2>
              <div className="flex flex-col gap-3">
                {sortedIssues.map((issue, index) => {
                  const translatedIssue = t(issue.issueKey);
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
                              <AlertTitle className="capitalize">
                                {t(`severity.${issue.severity}`)}
                              </AlertTitle>
                              <AlertDescription>
                                {displayIssue} (
                                {issue.occurrences.length}{" "}
                                {issue.occurrences.length !== 1
                                  ? t("detail.occurrencesPlural")
                                  : t("detail.occurrences")}
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
                                  <th className="px-3 py-2 font-semibold">
                                    {t("issueTable.date")}
                                  </th>
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
                    <CardTitle>{t("detail.historical")}</CardTitle>
                    <CardDescription>{t("detail.historicalDesc")}</CardDescription>
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
                        formatter={(value) => [
                          value ?? "",
                          t("detail.currentScore"),
                        ]}
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
                {t("detail.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleNext}
                disabled={school.id === 20}
                className="gap-2"
              >
                {t("detail.next")}
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
