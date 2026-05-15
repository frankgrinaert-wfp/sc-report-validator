import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsSheet } from "@/components/SettingsSheet";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  DASHBOARD_SCHOOLS,
  schoolQualityFromScore,
} from "@/data/reportDashboard";

export function Dashboard() {
  const [qualityFilter, setQualityFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("score-asc");

  const filteredSchools =
    qualityFilter === "all"
      ? DASHBOARD_SCHOOLS
      : DASHBOARD_SCHOOLS.filter(
          (school) => schoolQualityFromScore(school.score) === qualityFilter,
        );

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (orderBy) {
      case "score-asc":
        return a.score - b.score;
      case "score-desc":
        return b.score - a.score;
      case "quality": {
        const qualityOrder = { excellent: 1, good: 2, fair: 3, critical: 4 };
        return (
          qualityOrder[schoolQualityFromScore(a.score)] -
          qualityOrder[schoolQualityFromScore(b.score)]
        );
      }
      case "status": {
        const statusOrder = {
          Accepted: 1,
          "To be reviewed": 2,
          "Waiting for corrections": 3,
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
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl">Monthly reports</h1>
            <p className="text-muted-foreground text-sm">
              Review and validate monthly reports. Last updated: August 2025
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <SettingsSheet />
          </div>

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

            <Button variant="outline">
              <Download />
              Download all reports
            </Button>
          </div>

          <SchoolRankingTable schools={sortedSchools} />

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
  );
}
