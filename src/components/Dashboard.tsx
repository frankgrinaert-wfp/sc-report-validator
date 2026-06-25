import { ArrowUpDown, Calendar, ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { FilterSelect } from "@/components/FilterSelect";
import { Button } from "@/components/ui/button";
import { Cascader } from "@/components/ui/cascader";
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
import type {
  DashboardSortBy,
  DashboardSortOrder,
  ReportAuditIssueSeverity,
  SchoolStatus,
} from "@/data/reportDashboard";
import { SettingsSheet } from "@/components/SettingsSheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GAMBIA_ADMIN_REGION_OPTIONS } from "@/data/gambiaAdminRegions";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
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
  { value: "region", label: "Admin region" },
  { value: "month", label: "Month" },
  { value: "school", label: "School" },
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

const MONTH_FILTER_OPTIONS = REPORT_MONTH_OPTIONS.map((month) => ({
  value: month,
  label: month.charAt(0).toUpperCase() + month.slice(1),
}));

const QUALITY_FILTER_OPTIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "critical", label: "Critical" },
];

const STATUS_FILTER_OPTIONS: { value: SchoolStatus; label: string }[] = [
  { value: "Submitted", label: "Submitted" },
  { value: "Awaiting corrections", label: "Awaiting corrections" },
  { value: "Approved", label: "Approved" },
];

export function Dashboard() {
  const [country, setCountry] = useState("gambia");
  const [schoolFilter, setSchoolFilter] = useState<string | undefined>();
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [qualityFilter, setQualityFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<SchoolStatus | undefined>();
  const [sortBy, setSortBy] = useState<DashboardSortBy>("month");
  const [sortOrder, setSortOrder] = useState<DashboardSortOrder>("desc");
  const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYearValue);
  const [reportMonth, setReportMonth] = useState<string | undefined>();
  const [issueTypeFilter, setIssueTypeFilter] = useState<
    ReportAuditIssueSeverity | undefined
  >();

  const filteredReports = filterDashboardReports(DASHBOARD_REPORTS, {
    schoolId: schoolFilter,
    schoolYear,
    monthKey: reportMonth,
    quality: qualityFilter,
    status: statusFilter,
    issueType: issueTypeFilter,
    adminRegionPath: regionFilter,
  });

  const sortedReports = [...filteredReports].sort((a, b) =>
    compareDashboardReports(a, b, sortBy, sortOrder),
  );

  const hasActiveFilters =
    schoolFilter != null ||
    reportMonth != null ||
    regionFilter.length > 0 ||
    qualityFilter != null ||
    statusFilter != null ||
    issueTypeFilter != null;

  const resetFilters = () => {
    setSchoolFilter(undefined);
    setReportMonth(undefined);
    setRegionFilter([]);
    setQualityFilter(undefined);
    setStatusFilter(undefined);
    setIssueTypeFilter(undefined);
  };

  const selectedCountry = COUNTRIES.find(({ value }) => value === country);
  const selectedSchoolYear = SCHOOL_YEAR_OPTIONS.find(
    ({ value }) => value === schoolYear,
  );

  const headerControls = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            id="country-select"
            aria-label="Country"
          >
            {selectedCountry
              ? `${selectedCountry.flag} ${selectedCountry.label}`
              : "Select country"}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuRadioGroup value={country} onValueChange={setCountry}>
            {COUNTRIES.map(({ value, label, flag }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {flag} {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            id="school-year-select"
            aria-label="School year"
          >
            <Calendar />
            {selectedSchoolYear?.label ?? "School year"}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuRadioGroup value={schoolYear} onValueChange={setSchoolYear}>
            {SCHOOL_YEAR_OPTIONS.map(({ value, label }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <div className="p-8 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-semibold text-2xl">Report reviews</h1>
              <div className="flex flex-wrap items-center gap-0">
              {headerControls}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Review and validate monthly school meals reports.
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end justify-start gap-2">
              <Cascader
                options={GAMBIA_ADMIN_REGION_OPTIONS}
                value={regionFilter}
                onChange={(value) => setRegionFilter(value)}
                placeholder="Admin region"
                allowClear
                changeOnSelect
                displayRender={(labels) => labels[labels.length - 1]}
                className="h-9 w-44 px-3"
              />

              <FilterSelect
                id="month-select"
                label="Month"
                value={reportMonth}
                onValueChange={setReportMonth}
                options={MONTH_FILTER_OPTIONS}
                contentClassName="min-w-44 w-max max-w-80"
              />

              <FilterSelect
                id="school-select"
                label="School"
                value={schoolFilter}
                onValueChange={setSchoolFilter}
                options={SCHOOL_FILTER_OPTIONS}
                contentClassName="min-w-44 w-max max-w-80"
              />

              <FilterSelect
                id="issue-type-select"
                label="Data issue type"
                value={issueTypeFilter}
                onValueChange={(value) =>
                  setIssueTypeFilter(value as ReportAuditIssueSeverity | undefined)
                }
                options={ISSUE_TYPE_FILTER_OPTIONS}
                contentClassName="min-w-44 w-max max-w-80"
              />

              <FilterSelect
                id="quality-select"
                label="Data quality"
                value={qualityFilter}
                onValueChange={setQualityFilter}
                options={QUALITY_FILTER_OPTIONS}
                contentClassName="min-w-44 w-max max-w-80"
              />

              <FilterSelect
                id="status-select"
                label="Status"
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as SchoolStatus | undefined)
                }
                options={STATUS_FILTER_OPTIONS}
                contentClassName="min-w-44 w-max max-w-80"
              />

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
                    Sort
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

              <SettingsSheet />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Download all data issues"
                  >
                    <Download />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download all data issues</TooltipContent>
              </Tooltip>
            </div>
          </div>

      <SchoolRankingTable reports={sortedReports} />
    </div>
  );
}
