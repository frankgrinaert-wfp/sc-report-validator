import { ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SchoolStatus } from "@/data/reportDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsSheet } from "@/components/SettingsSheet";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  DASHBOARD_SCHOOLS,
  schoolQualityFromScore,
} from "@/data/reportDashboard";

const COUNTRIES = [
  { value: "burkina-faso", label: "Burkina Faso", flag: "🇧🇫" },
  { value: "gambia", label: "Gambia", flag: "🇬🇲" },
  { value: "guinea", label: "Guinea", flag: "🇬🇳" },
  { value: "mali", label: "Mali", flag: "🇲🇱" },
  { value: "senegal", label: "Senegal", flag: "🇸🇳" },
] as const;

const STATUS_FILTERS: { value: "all" | SchoolStatus; label: string }[] = [
  { value: "all", label: "Status: All" },
  { value: "To be reviewed", label: "Status: To be reviewed" },
  {
    value: "Waiting for corrections",
    label: "Status: Waiting for corrections",
  },
  { value: "Accepted", label: "Status: Accepted" },
];

export function Dashboard() {
  const [country, setCountry] = useState("gambia");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [orderBy, setOrderBy] = useState("score-asc");

  const filteredSchools = DASHBOARD_SCHOOLS.filter((school) => {
    if (
      qualityFilter !== "all" &&
      schoolQualityFromScore(school.score) !== qualityFilter
    ) {
      return false;
    }
    if (statusFilter !== "all" && school.status !== statusFilter) {
      return false;
    }
    return true;
  });

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

  const avgAttendanceTotal = Math.round(
    (aggregatedData.totalAttendance / aggregatedData.totalEnrollment) * 100,
  );
  const avgAttendanceBoys = Math.round(
    (aggregatedData.boysAttendance / aggregatedData.boysEnrollment) * 100,
  );
  const avgAttendanceGirls = Math.round(
    (aggregatedData.girlsAttendance / aggregatedData.girlsEnrollment) * 100,
  );
  const avgMealsPerDay = Math.round(aggregatedData.totalAttendance / 20);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 flex flex-col gap-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-3xl">Reports quality checker</h1>
              <p className="text-muted-foreground text-sm">
                Review and validate monthly reports. Last updated: August 2025
              </p>
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger
                id="country-select"
                className="w-40 shrink-0"
                aria-label="Country"
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(({ value, label, flag }) => (
                  <SelectItem key={value} value={value}>
                    {flag} {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Select defaultValue="may">
              <SelectTrigger
                id="month-select"
                className="w-48"
                aria-label="Month"
              >
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

            <Select defaultValue="2025">
              <SelectTrigger
                id="year-select"
                className="w-48"
                aria-label="Year"
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="region1">
              <SelectTrigger
                id="region-select"
                className="w-48"
                aria-label="Admin region"
              >
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="region1">Admin region 1</SelectItem>
                <SelectItem value="region2">Admin region 2</SelectItem>
                <SelectItem value="region3">Admin region 3</SelectItem>
                <SelectItem value="region4">Admin region 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger
                id="quality-select"
                className="w-48"
                aria-label="Quality"
              >
                <SelectValue placeholder="Quality: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Quality: All</SelectItem>
                <SelectItem value="excellent">Quality: Excellent</SelectItem>
                <SelectItem value="good">Quality: Good</SelectItem>
                <SelectItem value="fair">Quality: Fair</SelectItem>
                <SelectItem value="critical">Quality: Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | SchoolStatus)
              }
            >
              <SelectTrigger
                id="status-select"
                className="w-48"
                aria-label="Status"
              >
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" aria-label="Sort">
                  <ArrowUpDown />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={orderBy}
                  onValueChange={setOrderBy}
                >
                  <DropdownMenuRadioItem value="score-asc">
                    Data quality (ascending)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="score-desc">
                    Data quality (descending)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">
                    Status
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <SettingsSheet />

            <Button variant="outline" className="ml-auto">
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
