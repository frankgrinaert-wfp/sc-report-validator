import { ArrowUpDown, ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
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
import type {
  DashboardSortBy,
  DashboardSortOrder,
  SchoolStatus,
} from "@/data/reportDashboard";
import { SettingsSheet } from "@/components/SettingsSheet";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  compareDashboardReports,
  DASHBOARD_REPORTS,
  filterDashboardReports,
  REPORT_MONTH_OPTIONS,
  SCHOOL_FILTER_OPTIONS,
  SCHOOL_YEAR_OPTIONS,
} from "@/data/reportDashboard";

const SORT_BY_OPTIONS: { value: DashboardSortBy; label: string }[] = [
  { value: "school", label: "School" },
  { value: "month", label: "Month" },
  { value: "region", label: "Admin region" },
  { value: "completeness", label: "Days entered" },
  { value: "quality", label: "Data quality" },
  { value: "status", label: "Status" },
];

const SORT_ORDER_OPTIONS: { value: DashboardSortOrder; label: string }[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const COUNTRIES = [
  { value: "burkina-faso", label: "Burkina Faso", flag: "🇧🇫" },
  { value: "gambia", label: "Gambia", flag: "🇬🇲" },
  { value: "guinea", label: "Guinea", flag: "🇬🇳" },
  { value: "mali", label: "Mali", flag: "🇲🇱" },
  { value: "senegal", label: "Senegal", flag: "🇸🇳" },
] as const;

const STATUS_FILTERS: { value: "all" | SchoolStatus; label: string }[] = [
  { value: "all", label: "Status: All" },
  { value: "Submitted", label: "Submitted" },
  {
    value: "Awaiting corrections",
    label: "Awaiting corrections",
  },
  { value: "Approved", label: "Approved" },
];

export function Dashboard() {
  const [country, setCountry] = useState("gambia");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [sortBy, setSortBy] = useState<DashboardSortBy>("month");
  const [sortOrder, setSortOrder] = useState<DashboardSortOrder>("desc");
  const [schoolYear, setSchoolYear] = useState("all");
  const [reportMonth, setReportMonth] = useState("all");

  const filteredReports = filterDashboardReports(DASHBOARD_REPORTS, {
    schoolId: schoolFilter,
    schoolYear,
    monthKey: reportMonth,
    quality: qualityFilter,
    status: statusFilter,
  });

  const sortedReports = [...filteredReports].sort((a, b) =>
    compareDashboardReports(a, b, sortBy, sortOrder),
  );

  const sortByLabel =
    SORT_BY_OPTIONS.find((option) => option.value === sortBy)?.label ?? "Sort";

  const hasActiveFilters =
    schoolFilter !== "all" ||
    schoolYear !== "all" ||
    reportMonth !== "all" ||
    regionFilter !== "all" ||
    qualityFilter !== "all" ||
    statusFilter !== "all";

  const resetFilters = () => {
    setSchoolFilter("all");
    setSchoolYear("all");
    setReportMonth("all");
    setRegionFilter("all");
    setQualityFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 flex flex-col gap-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-3xl">Report reviews</h1>
              <p className="text-muted-foreground text-sm">
                Review and validate monthly school meals reports.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger
                  id="country-select"
                  className="w-40"
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
              <SettingsSheet />
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end justify-start gap-2">
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

              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger
                  id="school-select"
                  className="w-48 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:flex-1 [&_[data-slot=select-value]]:truncate"
                  aria-label="School"
                >
                  <SelectValue placeholder="School: All" />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="min-w-48 w-max max-w-80"
                >
                  <SelectItem value="all">School: All</SelectItem>
                  <SelectSeparator />
                  {SCHOOL_FILTER_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters ? (
                <Button type="button" variant="ghost" onClick={resetFilters}>
                  Reset
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" aria-label="Sort">
                    <ArrowUpDown />
                    {sortByLabel}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={(value) =>
                        setSortBy(value as DashboardSortBy)
                      }
                    >
                      {SORT_BY_OPTIONS.map(({ value, label }) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Order</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={sortOrder}
                      onValueChange={(value) =>
                        setSortOrder(value as DashboardSortOrder)
                      }
                    >
                      {SORT_ORDER_OPTIONS.map(({ value, label }) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button type="button" variant="outline">
                <Download />
                Download all issues
              </Button>
            </div>
          </div>

          <SchoolRankingTable reports={sortedReports} />
        </div>
      </div>
    </div>
  );
}
