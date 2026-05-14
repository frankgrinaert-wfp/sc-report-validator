import { ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControlPanel } from "@/components/ControlPanel";
import { StatCard } from "@/components/StatCard";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import { DASHBOARD_SCHOOLS } from "@/data/reportDashboard";

export function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [qualityFilter, setQualityFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("score-asc");

  useEffect(() => {
    const handleToggle = () => setIsPanelOpen((prev) => !prev);
    window.addEventListener("togglePanel", handleToggle);
    return () => window.removeEventListener("togglePanel", handleToggle);
  }, []);

  const filteredSchools =
    qualityFilter === "all"
      ? DASHBOARD_SCHOOLS
      : DASHBOARD_SCHOOLS.filter((school) => school.quality === qualityFilter);

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (orderBy) {
      case "score-asc":
        return a.score - b.score;
      case "score-desc":
        return b.score - a.score;
      case "quality": {
        const qualityOrder = { excellent: 1, good: 2, fair: 3, critical: 4 };
        return qualityOrder[a.quality] - qualityOrder[b.quality];
      }
      case "status": {
        const statusOrder = {
          Accepted: 1,
          "To be Reviewed": 2,
          "Waiting for Corrections": 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      default:
        return 0;
    }
  });

  const aggregatedData = DASHBOARD_SCHOOLS.reduce(
    (acc, school) => {
      acc.totalEnrollment += school.enrollment.total;
      acc.boysEnrollment += school.enrollment.boys;
      acc.girlsEnrollment += school.enrollment.girls;
      acc.totalAttendance += school.attendance.total;
      acc.boysAttendance += school.attendance.boys;
      acc.girlsAttendance += school.attendance.girls;
      acc.totalMeals += school.totalMeals;
      return acc;
    },
    {
      totalEnrollment: 0,
      boysEnrollment: 0,
      girlsEnrollment: 0,
      totalAttendance: 0,
      boysAttendance: 0,
      girlsAttendance: 0,
      totalMeals: 0,
    },
  );

  const avgAttendanceTotal = (
    (aggregatedData.totalAttendance / aggregatedData.totalEnrollment) *
    100
  ).toFixed(1);
  const avgAttendanceBoys = (
    (aggregatedData.boysAttendance / aggregatedData.boysEnrollment) *
    100
  ).toFixed(1);
  const avgAttendanceGirls = (
    (aggregatedData.girlsAttendance / aggregatedData.girlsEnrollment) *
    100
  ).toFixed(1);
  const avgMealsPerDay = Math.round(aggregatedData.totalAttendance / 20);

  const getQualityLabel = (filter: string) => {
    switch (filter) {
      case "all":
        return "Quality (all)";
      case "excellent":
        return "Quality (excellent)";
      case "good":
        return "Quality (good)";
      case "fair":
        return "Quality (fair)";
      case "critical":
        return "Quality (critical)";
      default:
        return filter;
    }
  };

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
          <div className="mx-auto max-w-7xl p-8">
            <div className="mb-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="month-select">Month</Label>
                  <Select defaultValue="may">
                    <SelectTrigger id="month-select" className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="year-select">Year</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="year-select" className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="country-select">Country</Label>
                  <Select defaultValue="gambia">
                    <SelectTrigger id="country-select" className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gambia">Gambia</SelectItem>
                      <SelectItem value="senegal">Senegal</SelectItem>
                      <SelectItem value="guinea">Guinea</SelectItem>
                      <SelectItem value="mali">Mali</SelectItem>
                      <SelectItem value="burkina-faso">Burkina Faso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="region-select">Admin region</Label>
                  <Select defaultValue="region1">
                    <SelectTrigger id="region-select" className="w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="region1">Admin region 1</SelectItem>
                      <SelectItem value="region2">Admin region 2</SelectItem>
                      <SelectItem value="region3">Admin region 3</SelectItem>
                      <SelectItem value="region4">Admin region 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mb-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Total schools" value="50" />
              <StatCard label="Excellent" value="15" indicator="excellent" />
              <StatCard label="Good" value="17" indicator="good" />
              <StatCard label="Fair" value="18" indicator="fair" />
              <StatCard label="Critical" value="0" indicator="critical" />
            </div>

            <p className="mb-8 text-muted-foreground text-sm">
              Last updated: August 2025
            </p>

            <div>
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="font-semibold text-lg">
                  School monthly report for May 2025
                </h2>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <Select value={qualityFilter} onValueChange={setQualityFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue>{getQualityLabel(qualityFilter)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={orderBy} onValueChange={setOrderBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Order by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score-asc">Score (ascending)</SelectItem>
                      <SelectItem value="score-desc">Score (descending)</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button type="button" variant="secondary" className="gap-2">
                    <Download />
                    Download all schools report
                  </Button>
                </div>
              </div>

              <SchoolRankingTable schools={sortedSchools} />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Average school attendance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceTotal}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Boys</span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceBoys}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">Girls</span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceGirls}%
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
                      {aggregatedData.totalMeals.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      Average meals per day
                    </span>
                    <span className="font-semibold tabular-nums">
                      {avgMealsPerDay.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
