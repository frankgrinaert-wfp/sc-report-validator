import { ArrowUpDown, Calendar, ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cascader } from "@/components/ui/cascader";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  ReportAuditIssueSeverity,
  SchoolStatus,
} from "@/data/reportDashboard";
import { SettingsSheet } from "@/components/SettingsSheet";
import { GAMBIA_ADMIN_REGION_OPTIONS } from "@/data/gambiaAdminRegions";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  compareDashboardReports,
  DASHBOARD_REPORTS,
  filterDashboardReports,
  getCurrentSchoolYearValue,
  ISSUE_TYPE_FILTER_OPTIONS,
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
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [qualityFilter, setQualityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [sortBy, setSortBy] = useState<DashboardSortBy>("month");
  const [sortOrder, setSortOrder] = useState<DashboardSortOrder>("desc");
  const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYearValue);
  const [reportMonth, setReportMonth] = useState("all");
  const [issueTypeFilter, setIssueTypeFilter] = useState<
    ReportAuditIssueSeverity[]
  >([]);

  const filteredReports = filterDashboardReports(DASHBOARD_REPORTS, {
    schoolId: schoolFilter,
    schoolYear,
    monthKey: reportMonth,
    quality: qualityFilter,
    status: statusFilter,
    issueTypes: issueTypeFilter,
    adminRegionPath: regionFilter,
  });

  const sortedReports = [...filteredReports].sort((a, b) =>
    compareDashboardReports(a, b, sortBy, sortOrder),
  );

  const sortByLabel =
    SORT_BY_OPTIONS.find((option) => option.value === sortBy)?.label ?? "Sort";

  const issueTypeFilterLabel =
    issueTypeFilter.length === 0
      ? "Issue types: All"
      : `Issue types: ${issueTypeFilter
          .map(
            (severity) =>
              ISSUE_TYPE_FILTER_OPTIONS.find(
                (option) => option.value === severity,
              )?.label,
          )
          .join(", ")}`;

  const toggleIssueType = (severity: ReportAuditIssueSeverity) => {
    setIssueTypeFilter((current) =>
      current.includes(severity)
        ? current.filter((value) => value !== severity)
        : [...current, severity],
    );
  };

  const hasActiveFilters =
    schoolFilter !== "all" ||
    reportMonth !== "all" ||
    regionFilter.length > 0 ||
    qualityFilter !== "all" ||
    statusFilter !== "all" ||
    issueTypeFilter.length > 0;

  const resetFilters = () => {
    setSchoolFilter("all");
    setReportMonth("all");
    setRegionFilter([]);
    setQualityFilter("all");
    setStatusFilter("all");
    setIssueTypeFilter([]);
  };

  const headerControls = (
    <>
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
      <Select value={schoolYear} onValueChange={setSchoolYear}>
        <InputGroup className="w-40">
          <SelectTrigger
            id="school-year-select"
            data-slot="input-group-control"
            className="w-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
            aria-label="School year"
          >
            <SelectValue placeholder="School year" />
          </SelectTrigger>
          <InputGroupAddon align="inline-start">
            <Calendar />
          </InputGroupAddon>
        </InputGroup>
        <SelectContent>
          {SCHOOL_YEAR_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SettingsSheet />
    </>
  );

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 flex flex-col gap-7">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            <h1 className="font-bold text-3xl md:col-start-1 md:row-start-1">
              Report reviews
            </h1>
            <p className="text-muted-foreground text-sm md:col-start-1 md:row-start-2">
              Review and validate monthly school meals reports.
            </p>
            <div className="flex flex-wrap items-center gap-2 md:col-start-2 md:row-span-2 md:row-start-1 md:justify-end md:self-start">
              {headerControls}
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end justify-start gap-2">
              <Cascader
                options={GAMBIA_ADMIN_REGION_OPTIONS}
                value={regionFilter}
                onChange={(value) => setRegionFilter(value)}
                placeholder="Admin region: All"
                allowClear
                changeOnSelect
                className="h-9 w-48 px-3"
              />

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-48 justify-between px-3 font-normal border-neutral-alpha-500 text-foreground"
                    aria-label="Issue types"
                  >
                    <span className="truncate">{issueTypeFilterLabel}</span>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {ISSUE_TYPE_FILTER_OPTIONS.map(({ value, label }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={issueTypeFilter.includes(value)}
                      onCheckedChange={() => toggleIssueType(value)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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
