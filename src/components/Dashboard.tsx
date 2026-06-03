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
import { SettingsSheet } from "@/components/SettingsSheet";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  DASHBOARD_SCHOOLS,
  formatReportMonth,
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
  { value: "To review", label: "Status: To review" },
  {
    value: "Corrections requested",
    label: "Status: Corrections requested",
  },
  { value: "Accepted", label: "Status: Accepted" },
];

export function Dashboard() {
  const [country, setCountry] = useState("gambia");
  const [regionFilter, setRegionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [orderBy, setOrderBy] = useState("score-asc");
  const [reportMonth, setReportMonth] = useState("may");
  const [reportYear, setReportYear] = useState("2025");
  const reportMonthLabel = formatReportMonth(reportMonth, reportYear);

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
            <Select value={reportMonth} onValueChange={setReportMonth}>
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

            <Select value={reportYear} onValueChange={setReportYear}>
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

          <SchoolRankingTable
            schools={sortedSchools}
            reportMonth={reportMonthLabel}
          />
        </div>
      </div>
    </div>
  );
}
