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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SchoolStatus } from "@/data/reportDashboard";
import { SettingsSheet } from "@/components/SettingsSheet";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  DASHBOARD_REPORTS,
  filterDashboardReports,
  REPORT_MONTH_OPTIONS,
  SCHOOL_YEAR_OPTIONS,
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
  { value: "To review", label: "To review" },
  {
    value: "Corrections requested",
    label: "Corrections requested",
  },
  { value: "Accepted", label: "Accepted" },
];

export function Dashboard() {
  const [country, setCountry] = useState("gambia");
  const [regionFilter, setRegionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [orderBy, setOrderBy] = useState("score-asc");
  const [schoolYear, setSchoolYear] = useState("all");
  const [reportMonth, setReportMonth] = useState("all");

  const filteredReports = filterDashboardReports(DASHBOARD_REPORTS, {
    schoolYear,
    monthKey: reportMonth,
    quality: qualityFilter,
    status: statusFilter,
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
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
          "To review": 2,
          "Corrections requested": 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      default:
        return 0;
    }
  });

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
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger
                id="school-year-select"
                className="w-48"
                aria-label="School year"
              >
                <SelectValue placeholder="School year: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">School year: All</SelectItem>
                <SelectSeparator />
                {SCHOOL_YEAR_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={reportMonth} onValueChange={setReportMonth}>
              <SelectTrigger
                id="month-select"
                className="w-48"
                aria-label="Month"
              >
                <SelectValue placeholder="Month: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Month: All</SelectItem>
                <SelectSeparator />
                {REPORT_MONTH_OPTIONS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger
                id="region-select"
                className="w-48"
                aria-label="Admin region"
              >
                <SelectValue placeholder="Admin region: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Admin region: All</SelectItem>
                <SelectSeparator />
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
                aria-label="Data quality"
              >
                <SelectValue placeholder="Data quality: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Data quality: All</SelectItem>
                <SelectSeparator />
                <SelectItem value="excellent">
                  Data quality: Excellent
                </SelectItem>
                <SelectItem value="good">Data quality: Good</SelectItem>
                <SelectItem value="fair">Data quality: Fair</SelectItem>
                <SelectItem value="critical">Data quality: Critical</SelectItem>
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
                <SelectItem value="all">Status: All</SelectItem>
                <SelectSeparator />
                {STATUS_FILTERS.filter(({ value }) => value !== "all").map(
                  ({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ),
                )}
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

          <SchoolRankingTable reports={sortedReports} />
        </div>
      </div>
    </div>
  );
}
