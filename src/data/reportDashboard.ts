export type SchoolQuality = "excellent" | "good" | "fair" | "critical";

/** Tier implied by the numeric score (no separate quality field on records). */
export function schoolQualityFromScore(score: number): SchoolQuality {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "fair";
  return "critical";
}

export type ProgressMetricTone = "success" | "warning" | "danger";

const PROGRESS_METRIC_TONE_CLASSES: Record<
  ProgressMetricTone,
  { text: string; indicator: string }
> = {
  success: { text: "text-success-600", indicator: "bg-success-500" },
  warning: { text: "text-warning-600", indicator: "bg-warning-500" },
  danger: { text: "text-danger-600", indicator: "bg-danger-500" },
};

export function progressMetricTextClass(tone: ProgressMetricTone): string {
  return PROGRESS_METRIC_TONE_CLASSES[tone].text;
}

export function progressMetricIndicatorClass(tone: ProgressMetricTone): string {
  return PROGRESS_METRIC_TONE_CLASSES[tone].indicator;
}

export function dataQualityScoreTone(score: number): ProgressMetricTone {
  switch (schoolQualityFromScore(score)) {
    case "excellent":
      return "success";
    case "good":
    case "fair":
      return "warning";
    case "critical":
      return "danger";
  }
}

/** Text color for a displayed data quality score (e.g. `87%`). */
export function dataQualityScoreTextClass(score: number): string {
  return progressMetricTextClass(dataQualityScoreTone(score));
}

/** Fill color for `Progress` indicators tied to the same tiers. */
export function dataQualityScoreIndicatorClass(score: number): string {
  return progressMetricIndicatorClass(dataQualityScoreTone(score));
}

export type SchoolStatus = "To review" | "Corrections requested" | "Accepted";

export type Occurrence = { date: string; value: unknown };

export type ValidationIssue = {
  categoryKey: string;
  issueKey: string;
  severity: "warning" | "error" | "critical" | "info";
  metric: string;
  occurrences: Occurrence[];
  commodity?: string;
};

export const REPORT_DAILY_ENTRIES_TOTAL = 20;

export function dailyEntriesTone(
  entries: number,
  total = REPORT_DAILY_ENTRIES_TOTAL,
): ProgressMetricTone {
  return entries >= total ? "success" : "warning";
}

export type MetricProgressConfig = {
  value: number;
  label: string;
  tone: ProgressMetricTone;
  ariaLabel: string;
};

export function dataQualityMetricConfig(score: number): MetricProgressConfig {
  const rounded = Math.round(score);
  return {
    value: rounded,
    label: `${rounded}%`,
    tone: dataQualityScoreTone(score),
    ariaLabel: `Data quality ${rounded} percent`,
  };
}

export function dailyEntriesMetricConfig(
  entries: number,
  total = REPORT_DAILY_ENTRIES_TOTAL,
): MetricProgressConfig {
  return {
    value: Math.min(100, Math.round((entries / total) * 100)),
    label: `${entries} of ${total}`,
    tone: dailyEntriesTone(entries, total),
    ariaLabel: `Days entered ${entries} of ${total}`,
  };
}

export const SCHOOL_YEAR_OPTIONS = [
  { value: "2024-2025", label: "2024–2025", startYear: 2024 },
  { value: "2023-2024", label: "2023–2024", startYear: 2023 },
  { value: "2022-2023", label: "2022–2023", startYear: 2022 },
  { value: "2021-2022", label: "2021–2022", startYear: 2021 },
] as const;

export const REPORT_MONTH_OPTIONS = [
  "september",
  "october",
  "november",
  "december",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
] as const;

const FALL_REPORT_MONTHS = new Set<string>([
  "september",
  "october",
  "november",
  "december",
]);

export function schoolYearStartYear(schoolYearValue: string): number {
  return (
    SCHOOL_YEAR_OPTIONS.find((option) => option.value === schoolYearValue)
      ?.startYear ?? SCHOOL_YEAR_OPTIONS[0].startYear
  );
}

/** Calendar year for a month within a school year (e.g. May in 2024–2025 → 2025). */
export function calendarYearForSchoolReport(
  monthKey: string,
  schoolYearStart: number,
): string {
  const year = FALL_REPORT_MONTHS.has(monthKey)
    ? schoolYearStart
    : schoolYearStart + 1;
  return String(year);
}

/** e.g. `formatReportMonth("march", "2025")` → `"March 2025"` */
export function formatReportMonth(monthKey: string, year: string): string {
  const monthName =
    monthKey.charAt(0).toUpperCase() + monthKey.slice(1).toLowerCase();
  return `${monthName} ${year}`;
}

export function buildReportPeriodLabel(
  schoolYear: string,
  monthKey: string,
): string {
  return formatReportMonth(
    monthKey,
    calendarYearForSchoolReport(monthKey, schoolYearStartYear(schoolYear)),
  );
}

export const ADMIN_REGIONS = [
  "Admin region 1",
  "Admin region 2",
  "Admin region 3",
  "Admin region 4",
] as const;

export type DashboardSortBy =
  | "school"
  | "month"
  | "region"
  | "completeness"
  | "quality"
  | "status";

export type DashboardSortOrder = "asc" | "desc";

export type ReportIssueCounts = {
  critical: number;
  high: number;
  low: number;
};

export type DashboardReportRow = {
  reportId: string;
  schoolId: number;
  schoolName: string;
  schoolCode: string;
  adminRegion: (typeof ADMIN_REGIONS)[number];
  schoolYear: string;
  monthKey: string;
  periodLabel: string;
  score: number;
  status: SchoolStatus;
  dailyEntries: number;
  issueCounts: ReportIssueCounts;
};

const REPORT_MONTH_SORT_INDEX = Object.fromEntries(
  REPORT_MONTH_OPTIONS.map((month, index) => [month, index]),
) as Record<string, number>;

function reportPeriodSortKey(report: DashboardReportRow): number {
  const calendarYear = Number(
    calendarYearForSchoolReport(
      report.monthKey,
      schoolYearStartYear(report.schoolYear),
    ),
  );
  const monthIndex = REPORT_MONTH_SORT_INDEX[report.monthKey] ?? 0;
  return calendarYear * 12 + monthIndex;
}

export function compareDashboardReports(
  a: DashboardReportRow,
  b: DashboardReportRow,
  sortBy: DashboardSortBy,
  sortOrder: DashboardSortOrder,
): number {
  const direction = sortOrder === "asc" ? 1 : -1;
  let comparison = 0;

  switch (sortBy) {
    case "school":
      comparison = a.schoolName.localeCompare(b.schoolName);
      break;
    case "month":
      comparison = reportPeriodSortKey(a) - reportPeriodSortKey(b);
      break;
    case "region":
      comparison = a.adminRegion.localeCompare(b.adminRegion);
      break;
    case "completeness":
      comparison = a.dailyEntries - b.dailyEntries;
      break;
    case "quality":
      comparison = a.score - b.score;
      break;
    case "status": {
      const statusOrder = {
        Accepted: 1,
        "To review": 2,
        "Corrections requested": 3,
      };
      comparison = statusOrder[a.status] - statusOrder[b.status];
      break;
    }
  }

  return comparison * direction;
}

export function filterDashboardReports(
  reports: DashboardReportRow[],
  filters: {
    schoolId?: string;
    schoolYear?: string;
    monthKey?: string;
    quality?: string;
    status?: "all" | SchoolStatus;
  },
): DashboardReportRow[] {
  return reports.filter((report) => {
    if (
      filters.schoolId &&
      filters.schoolId !== "all" &&
      report.schoolId !== Number(filters.schoolId)
    ) {
      return false;
    }
    if (
      filters.schoolYear &&
      filters.schoolYear !== "all" &&
      report.schoolYear !== filters.schoolYear
    ) {
      return false;
    }
    if (
      filters.monthKey &&
      filters.monthKey !== "all" &&
      report.monthKey !== filters.monthKey
    ) {
      return false;
    }
    if (
      filters.quality &&
      filters.quality !== "all" &&
      schoolQualityFromScore(report.score) !== filters.quality
    ) {
      return false;
    }
    if (
      filters.status &&
      filters.status !== "all" &&
      report.status !== filters.status
    ) {
      return false;
    }
    return true;
  });
}

type SchoolRecordCore = {
  id: number;
  name: string;
  code: string;
  score: number;
  status: SchoolStatus;
  enrollment: { total: number; boys: number; girls: number };
  attendance: { total: number; boys: number; girls: number };
  totalMeals: number;
  avgMealsPerDay: number;
};

export type SchoolDetailRecord = SchoolRecordCore & {
  issues: ValidationIssue[];
};

const allValidationIssues = {
  purchasePrice: [
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.purchasePriceHigh",
      severity: "warning",
      metric: "Price per kg",
      generateData: () => {
        const commodities = ["Rice", "Beans", "Sorghum", "Maize", "Oil"];
        const commodity =
          commodities[Math.floor(Math.random() * commodities.length)];
        const occurrences = generateRandomOccurrences(
          ["2025-05-05", "2025-05-12", "2025-05-19"],
          () => Math.floor(Math.random() * 50) + 150,
        );
        return { commodity, occurrences };
      },
    },
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.purchasePriceLow",
      severity: "warning",
      metric: "Price per kg",
      generateData: () => {
        const commodities = ["Rice", "Beans", "Sorghum", "Maize", "Oil"];
        const commodity =
          commodities[Math.floor(Math.random() * commodities.length)];
        const occurrences = generateRandomOccurrences(
          ["2025-05-08", "2025-05-15"],
          () => Math.floor(Math.random() * 20) + 10,
        );
        return { commodity, occurrences };
      },
    },
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.batchMissing",
      severity: "error",
      metric: "Commodity",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-03", "2025-05-10", "2025-05-17", "2025-05-24"],
          () => ["Rice", "Beans", "Oil", "Salt"][Math.floor(Math.random() * 4)],
        ),
    },
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.batchDigits",
      severity: "warning",
      metric: "Batch number",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-06", "2025-05-13"],
          () => Math.floor(Math.random() * 9000) + 1000,
        ),
    },
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.batchDuplicate",
      severity: "error",
      metric: "Batch number",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-09", "2025-05-16"],
          () => Math.floor(Math.random() * 90000) + 10000,
        ),
    },
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.vendorMissing",
      severity: "error",
      metric: "Commodity",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-07", "2025-05-14", "2025-05-21"],
          () => ["Rice", "Beans", "Oil"][Math.floor(Math.random() * 3)],
        ),
    },
  ],
  attendance: [
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceHigh",
      severity: "warning",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-02", "2025-05-09", "2025-05-16"],
          () => Math.floor(Math.random() * 50) + 250,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceLow",
      severity: "warning",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-04", "2025-05-11", "2025-05-18", "2025-05-25"],
          () => Math.floor(Math.random() * 30) + 50,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceSame",
      severity: "warning",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          [
            "2025-05-01",
            "2025-05-02",
            "2025-05-03",
            "2025-05-04",
            "2025-05-05",
          ],
          () => 180,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceExceeds",
      severity: "error",
      metric: "Attendance / enrolment",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-08", "2025-05-15"],
          () => `${Math.floor(Math.random() * 20) + 210} / 200`,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.enrolmentIncrease",
      severity: "warning",
      metric: "Enrolment change",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-10"],
          () => `${Math.floor(Math.random() * 40) + 50}%`,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.noAbsences",
      severity: "info",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          [
            "2025-05-01",
            "2025-05-02",
            "2025-05-03",
            "2025-05-04",
            "2025-05-05",
            "2025-05-06",
            "2025-05-07",
            "2025-05-08",
            "2025-05-09",
            "2025-05-10",
          ],
          () => 200,
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceMissing",
      severity: "error",
      metric: "Status",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-12", "2025-05-19", "2025-05-26"],
          () => "Missing",
        ),
    },
    {
      categoryKey: "alert.attendance",
      issueKey: "issue.attendanceZero",
      severity: "warning",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-06", "2025-05-13", "2025-05-20", "2025-05-27"],
          () => 0,
        ),
    },
  ],
  consumption: [
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.cerealsExceeds",
      severity: "warning",
      metric: "Grams/student",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-05", "2025-05-12", "2025-05-19"],
          () => Math.floor(Math.random() * 50) + 200,
        ),
    },
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.pulsesExceeds",
      severity: "warning",
      metric: "Grams/student",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-07", "2025-05-14"],
          () => Math.floor(Math.random() * 30) + 120,
        ),
    },
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.consumptionHigh",
      severity: "warning",
      metric: "Total grams/student",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-03", "2025-05-10", "2025-05-17"],
          () => Math.floor(Math.random() * 100) + 350,
        ),
    },
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.consumptionLow",
      severity: "warning",
      metric: "Total grams/student",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-06", "2025-05-13", "2025-05-20", "2025-05-27"],
          () => Math.floor(Math.random() * 50) + 100,
        ),
    },
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.consumptionZero",
      severity: "error",
      metric: "Total grams/student",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-08", "2025-05-15", "2025-05-22"],
          () => 0,
        ),
    },
    {
      categoryKey: "alert.consumption",
      issueKey: "issue.consumptionMissing",
      severity: "error",
      metric: "Status",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-09", "2025-05-16", "2025-05-23"],
          () => "Missing",
        ),
    },
  ],
  incident: [
    {
      categoryKey: "alert.incident",
      issueKey: "issue.foodStolen",
      severity: "critical",
      metric: "Quantity lost (kg)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-11"],
          () => Math.floor(Math.random() * 50) + 10,
        ),
    },
    {
      categoryKey: "alert.incident",
      issueKey: "issue.lossOther",
      severity: "warning",
      metric: "Quantity lost (kg)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-14", "2025-05-21"],
          () => Math.floor(Math.random() * 20) + 5,
        ),
    },
    {
      categoryKey: "alert.incident",
      issueKey: "issue.lossExceeds",
      severity: "error",
      metric: "Quantity lost (kg)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-18"],
          () => Math.floor(Math.random() * 100) + 100,
        ),
    },
  ],
  crossFile: [
    {
      categoryKey: "alert.crossFile",
      issueKey: "issue.attendanceNoMeal",
      severity: "error",
      metric: "Attendance",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-04", "2025-05-11", "2025-05-18"],
          () => Math.floor(Math.random() * 50) + 150,
        ),
    },
    {
      categoryKey: "alert.crossFile",
      issueKey: "issue.stockInconsistency",
      severity: "error",
      metric: "Stock (kg)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-07", "2025-05-14"],
          () => Math.floor(Math.random() * 30) + 10,
        ),
    },
    {
      categoryKey: "alert.crossFile",
      issueKey: "issue.saltNotUsed",
      severity: "warning",
      metric: "Salt stock (kg)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-09", "2025-05-16", "2025-05-23"],
          () => Math.floor(Math.random() * 10) + 5,
        ),
    },
    {
      categoryKey: "alert.crossFile",
      issueKey: "issue.oilNotUsed",
      severity: "warning",
      metric: "Oil stock (L)",
      generateData: () =>
        generateRandomOccurrences(
          ["2025-05-10", "2025-05-17", "2025-05-24"],
          () => Math.floor(Math.random() * 15) + 5,
        ),
    },
  ],
};

// Helper function to generate random occurrences
const generateRandomOccurrences = (
  dates: string[],
  valueGenerator: () => unknown,
) => {
  // Randomly select a subset of dates
  const numDates = Math.floor(Math.random() * dates.length) + 1;
  const selectedDates = dates
    .sort(() => 0.5 - Math.random())
    .slice(0, numDates);

  return selectedDates.sort().map((date) => ({
    date,
    value: valueGenerator(),
  }));
};

// Function to randomly select issues for a school
const getRandomIssues = (schoolScore: number) => {
  const allIssues = [
    ...allValidationIssues.purchasePrice,
    ...allValidationIssues.attendance,
    ...allValidationIssues.consumption,
    ...allValidationIssues.incident,
    ...allValidationIssues.crossFile,
  ];

  // Number of issues based on quality score (lower score = more issues)
  let issueCount;
  if (schoolScore >= 90)
    issueCount = Math.floor(Math.random() * 3) + 1; // 1-3 issues
  else if (schoolScore >= 80)
    issueCount = Math.floor(Math.random() * 4) + 2; // 2-5 issues
  else if (schoolScore >= 70)
    issueCount = Math.floor(Math.random() * 5) + 3; // 3-7 issues
  else issueCount = Math.floor(Math.random() * 6) + 4; // 4-9 issues

  // Randomly shuffle and select issues
  const shuffled = [...allIssues].sort(() => 0.5 - Math.random());
  const selectedIssues = shuffled.slice(0, issueCount);

  // Generate occurrences for each selected issue
  return selectedIssues.map((issue) => {
    const data = issue.generateData() as
      | Occurrence[]
      | { commodity?: string; occurrences: Occurrence[] };
    return {
      categoryKey: issue.categoryKey,
      issueKey: issue.issueKey,
      severity: issue.severity as ValidationIssue["severity"],
      metric: issue.metric,
      occurrences: Array.isArray(data) ? data : data.occurrences,
      commodity: !Array.isArray(data) ? data.commodity : undefined,
    };
  });
};

export const MAX_SCHOOL_ID = 5;

const SCHOOL_DETAIL_BY_ID: Record<string, SchoolDetailRecord> = {
  "1": {
    id: 1,
    name: "Bundung Lower Basic School",
    code: "1001",
    score: 72,
    status: "To review",
    enrollment: { total: 220, boys: 112, girls: 108 },
    attendance: { total: 187, boys: 95, girls: 92 },
    totalMeals: 3740,
    avgMealsPerDay: 187,
    issues: getRandomIssues(72),
  },
  "2": {
    id: 2,
    name: "Brikama Upper Basic School",
    code: "1002",
    score: 76,
    status: "Corrections requested",
    enrollment: { total: 315, boys: 163, girls: 152 },
    attendance: { total: 276, boys: 143, girls: 133 },
    totalMeals: 5520,
    avgMealsPerDay: 276,
    issues: getRandomIssues(76),
  },
  "3": {
    id: 3,
    name: "Serrekunda Lower Basic School",
    code: "1003",
    score: 82,
    status: "Corrections requested",
    enrollment: { total: 325, boys: 168, girls: 157 },
    attendance: { total: 287, boys: 149, girls: 138 },
    totalMeals: 5740,
    avgMealsPerDay: 287,
    issues: getRandomIssues(82),
  },
  "4": {
    id: 4,
    name: "Armitage Senior Secondary School",
    code: "1004",
    score: 90,
    status: "To review",
    enrollment: { total: 305, boys: 158, girls: 147 },
    attendance: { total: 267, boys: 139, girls: 128 },
    totalMeals: 5340,
    avgMealsPerDay: 267,
    issues: getRandomIssues(90),
  },
  "5": {
    id: 5,
    name: "St. Therese's Upper Basic School",
    code: "1005",
    score: 97,
    status: "Accepted",
    enrollment: { total: 365, boys: 189, girls: 176 },
    attendance: { total: 325, boys: 169, girls: 156 },
    totalMeals: 6500,
    avgMealsPerDay: 325,
    issues: getRandomIssues(97),
  },
};

export function getSchoolDetail(
  schoolId: string | undefined,
): SchoolDetailRecord | undefined {
  if (!schoolId) return undefined;
  return SCHOOL_DETAIL_BY_ID[schoolId];
}

export const SCHOOL_FILTER_OPTIONS = Object.values(SCHOOL_DETAIL_BY_ID)
  .map(({ id, name }) => ({ value: String(id), label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));

/** Mock daily-entry counts (out of REPORT_DAILY_ENTRIES_TOTAL) per school id. */
export const MOCK_DAILY_ENTRIES_BY_ID: Record<number, number> = {
  1: 12,
  2: 16,
  3: 19,
  4: 20,
  5: 20,
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function statusForReportScore(score: number, rand: number): SchoolStatus {
  if (score >= 92) {
    return rand < 0.65 ? "Accepted" : "To review";
  }
  if (score >= 85) {
    if (rand < 0.35) return "Accepted";
    if (rand < 0.7) return "To review";
    return "Corrections requested";
  }
  if (score >= 75) {
    return rand < 0.45 ? "To review" : "Corrections requested";
  }
  return rand < 0.25 ? "Corrections requested" : "To review";
}

function generateReportIssueCounts(
  score: number,
  rand: () => number,
): ReportIssueCounts {
  const scale = score < 75 ? 1.4 : score < 85 ? 1 : 0.6;

  const countForSeverity = (max: number, zeroChance: number) => {
    if (rand() < zeroChance) return 0;
    return Math.min(
      max,
      Math.max(1, Math.round((Math.floor(rand() * 4) + 1) * scale)),
    );
  };

  // Higher scores more often omit critical/important issues entirely.
  const criticalZeroChance = score >= 90 ? 0.55 : score >= 80 ? 0.35 : 0.15;
  const highZeroChance = score >= 85 ? 0.4 : 0.2;
  const lowZeroChance = score < 75 ? 0.15 : 0.35;

  return {
    critical: countForSeverity(6, criticalZeroChance),
    high: countForSeverity(8, highZeroChance),
    low: countForSeverity(6, lowZeroChance),
  };
}

function generateMockReports(count: number): DashboardReportRow[] {
  const schools = Object.values(SCHOOL_DETAIL_BY_ID);
  const periods = SCHOOL_YEAR_OPTIONS.flatMap(({ value: schoolYear }) =>
    REPORT_MONTH_OPTIONS.map((monthKey) => ({ schoolYear, monthKey })),
  );
  const rand = createSeededRandom(42);
  const usedSlots = new Set<string>();
  const reports: DashboardReportRow[] = [];
  let attempts = 0;

  while (reports.length < count && attempts < count * 100) {
    attempts += 1;
    const school = schools[Math.floor(rand() * schools.length)]!;
    const period = periods[Math.floor(rand() * periods.length)]!;
    const slotKey = `${school.id}:${period.schoolYear}:${period.monthKey}`;
    if (usedSlots.has(slotKey)) {
      continue;
    }
    usedSlots.add(slotKey);

    const score = Math.max(
      60,
      Math.min(100, school.score + Math.floor(rand() * 9) - 4),
    );
    const entriesBase = MOCK_DAILY_ENTRIES_BY_ID[school.id] ?? 17;
    const dailyEntries = Math.max(
      8,
      Math.min(
        REPORT_DAILY_ENTRIES_TOTAL,
        entriesBase + Math.floor(rand() * 5) - 2,
      ),
    );

    reports.push({
      reportId: `report-${reports.length + 1}`,
      schoolId: school.id,
      schoolName: school.name,
      schoolCode: school.code,
      adminRegion: ADMIN_REGIONS[(school.id - 1) % ADMIN_REGIONS.length]!,
      schoolYear: period.schoolYear,
      monthKey: period.monthKey,
      periodLabel: buildReportPeriodLabel(period.schoolYear, period.monthKey),
      score,
      status: statusForReportScore(score, rand()),
      dailyEntries,
      issueCounts: generateReportIssueCounts(score, rand),
    });
  }

  return reports;
}

/** ~100 monthly reports across schools and school-year months (mock DB). */
export const DASHBOARD_REPORTS = generateMockReports(100);

export function getDashboardReportForSchool(
  schoolId: number,
): DashboardReportRow | undefined {
  const reports = DASHBOARD_REPORTS.filter(
    (report) => report.schoolId === schoolId,
  );
  if (reports.length === 0) return undefined;
  return [...reports].sort((a, b) =>
    compareDashboardReports(a, b, "month", "desc"),
  )[0];
}

export type ReportAuditIssueSeverity = "critical" | "high" | "low";

export type ReportAuditIssue = {
  date: string;
  severity: ReportAuditIssueSeverity;
  title: string;
};

/** Static issues table shared by all report detail pages (mock). */
export const REPORT_AUDIT_ISSUES: ReportAuditIssue[] = [
  {
    date: "2024-04-12",
    severity: "critical",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    date: "2024-04-08",
    severity: "high",
    title:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    date: "2024-04-15",
    severity: "low",
    title:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
  },
  {
    date: "2024-04-22",
    severity: "high",
    title:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  },
  {
    date: "2024-04-03",
    severity: "critical",
    title:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.",
  },
  {
    date: "2024-04-01",
    severity: "low",
    title:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
  },
  {
    date: "2024-04-05",
    severity: "critical",
    title:
      "Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta.",
  },
  {
    date: "2024-04-10",
    severity: "high",
    title:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
  },
  {
    date: "2024-04-18",
    severity: "critical",
    title:
      "Hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis.",
  },
  {
    date: "2024-04-25",
    severity: "high",
    title:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
  },
];

export function countAuditIssuesBySeverity(
  issues: readonly ReportAuditIssue[],
): ReportIssueCounts {
  return issues.reduce(
    (counts, issue) => {
      counts[issue.severity] += 1;
      return counts;
    },
    { critical: 0, high: 0, low: 0 },
  );
}

/** e.g. `"2024-04-12"` → `"12 Apr 2024"` */
export function formatAuditIssueDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

// Generate historical data for the last 12 months
export function generateHistoricalData(currentScore: number, schoolId: number) {
  const months = [
    "Jun 2024",
    "Jul 2024",
    "Aug 2024",
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
    "Jan 2025",
    "Feb 2025",
    "Mar 2025",
    "Apr 2025",
    "May 2025",
  ];

  // Generate realistic score variations around the current score
  return months.map((month, index) => {
    const variation = (Math.random() - 0.5) * 10; // Random variation between -5 and +5
    const baseScore = currentScore + (index - 11) * 0.5; // Slight upward trend
    const score = Math.max(60, Math.min(100, baseScore + variation));

    return {
      id: `school-${schoolId}-${month}-${index}`, // Add school ID to make it unique
      month,
      score: Math.round(score),
    };
  });
}
