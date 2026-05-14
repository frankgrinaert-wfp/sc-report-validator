export type SchoolQuality = "excellent" | "good" | "fair" | "critical";

/** Tier implied by the numeric score (no separate quality field on records). */
export function schoolQualityFromScore(score: number): SchoolQuality {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "fair";
  return "critical";
}

/** Text color for a displayed data quality score (e.g. `87.1%`). */
export function dataQualityScoreTextClass(score: number): string {
  switch (schoolQualityFromScore(score)) {
    case "excellent":
      return "text-success-600";
    case "good":
      return "text-warning-600";
    case "fair":
      return "text-warning-600";
    case "critical":
      return "text-danger-600";
  }
}

/** `accent-*` for score meters / progress UI tied to the same tiers. */
export function dataQualityScoreAccentClass(score: number): string {
  switch (schoolQualityFromScore(score)) {
    case "excellent":
      return "accent-success-600";
    case "good":
      return "accent-warning-600";
    case "fair":
      return "accent-warning-600";
    case "critical":
      return "accent-danger-600";
  }
}

export type SchoolStatus =
  | "To be Reviewed"
  | "Waiting for Corrections"
  | "Accepted";

export type Occurrence = { date: string; value: unknown };

export type ValidationIssue = {
  categoryKey: string;
  issueKey: string;
  severity: "warning" | "error" | "critical" | "info";
  metric: string;
  occurrences: Occurrence[];
  commodity?: string;
};

export type SchoolDashboardRow = {
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

export type SchoolDetailRecord = SchoolDashboardRow & {
  issues: ValidationIssue[];
};

const allValidationIssues = {
  purchasePrice: [
    {
      categoryKey: "alert.purchasePrice",
      issueKey: "issue.purchasePriceHigh",
      severity: "warning",
      metric: "Price per Kg",
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
      metric: "Price per Kg",
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
      metric: "Batch Number",
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
      metric: "Batch Number",
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
      metric: "Attendance / Enrolment",
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
      metric: "Enrolment Change",
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
      metric: "Grams/Student",
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
      metric: "Grams/Student",
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
      metric: "Total Grams/Student",
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
      metric: "Total Grams/Student",
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
      metric: "Total Grams/Student",
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
      metric: "Quantity Lost (kg)",
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
      metric: "Quantity Lost (kg)",
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
      metric: "Quantity Lost (kg)",
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
      metric: "Salt Stock (kg)",
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
      metric: "Oil Stock (L)",
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

const SCHOOL_DETAIL_BY_ID: Record<string, SchoolDetailRecord> = {
  "1": {
    id: 1,
    name: "School 45",
    code: "1045",
    score: 71.8,
    status: "To be Reviewed",
    enrollment: { total: 220, boys: 112, girls: 108 },
    attendance: { total: 187, boys: 95, girls: 92 },
    totalMeals: 3740,
    avgMealsPerDay: 187,
    issues: getRandomIssues(71.8),
  },
  "2": {
    id: 2,
    name: "School 2",
    code: "1002",
    score: 73.1,
    status: "To be Reviewed",
    enrollment: { total: 280, boys: 145, girls: 135 },
    attendance: { total: 245, boys: 128, girls: 117 },
    totalMeals: 4900,
    avgMealsPerDay: 245,
    issues: getRandomIssues(73.1),
  },
  "3": {
    id: 3,
    name: "School 38",
    code: "1038",
    score: 75.0,
    status: "To be Reviewed",
    enrollment: { total: 350, boys: 180, girls: 170 },
    attendance: { total: 312, boys: 164, girls: 148 },
    totalMeals: 6240,
    avgMealsPerDay: 312,
    issues: getRandomIssues(75.0),
  },
  "4": {
    id: 4,
    name: "School 37",
    code: "1037",
    score: 75.1,
    status: "To be Reviewed",
    enrollment: { total: 230, boys: 118, girls: 112 },
    attendance: { total: 198, boys: 102, girls: 96 },
    totalMeals: 3960,
    avgMealsPerDay: 198,
    issues: getRandomIssues(75.1),
  },
  "5": {
    id: 5,
    name: "School 23",
    code: "1023",
    score: 75.6,
    status: "Waiting for Corrections",
    enrollment: { total: 315, boys: 163, girls: 152 },
    attendance: { total: 276, boys: 143, girls: 133 },
    totalMeals: 5520,
    avgMealsPerDay: 276,
    issues: getRandomIssues(75.6),
  },
  "6": {
    id: 6,
    name: "School 39",
    code: "1039",
    score: 76.3,
    status: "To be Reviewed",
    enrollment: { total: 255, boys: 132, girls: 123 },
    attendance: { total: 223, boys: 115, girls: 108 },
    totalMeals: 4460,
    avgMealsPerDay: 223,
    issues: getRandomIssues(76.3),
  },
  "7": {
    id: 7,
    name: "School 3",
    code: "1003",
    score: 76.6,
    status: "Waiting for Corrections",
    enrollment: { total: 215, boys: 110, girls: 105 },
    attendance: { total: 189, boys: 97, girls: 92 },
    totalMeals: 3780,
    avgMealsPerDay: 189,
    issues: getRandomIssues(76.6),
  },
  "8": {
    id: 8,
    name: "School 36",
    code: "1036",
    score: 77.4,
    status: "To be Reviewed",
    enrollment: { total: 300, boys: 155, girls: 145 },
    attendance: { total: 264, boys: 138, girls: 126 },
    totalMeals: 5280,
    avgMealsPerDay: 264,
    issues: getRandomIssues(77.4),
  },
  "9": {
    id: 9,
    name: "School 14",
    code: "1014",
    score: 79.2,
    status: "To be Reviewed",
    enrollment: { total: 235, boys: 122, girls: 113 },
    attendance: { total: 201, boys: 104, girls: 97 },
    totalMeals: 4020,
    avgMealsPerDay: 201,
    issues: getRandomIssues(79.2),
  },
  "10": {
    id: 10,
    name: "School 8",
    code: "1008",
    score: 81.5,
    status: "Waiting for Corrections",
    enrollment: { total: 325, boys: 168, girls: 157 },
    attendance: { total: 287, boys: 149, girls: 138 },
    totalMeals: 5740,
    avgMealsPerDay: 287,
    issues: getRandomIssues(81.5),
  },
  "11": {
    id: 11,
    name: "School 29",
    code: "1029",
    score: 82.8,
    status: "To be Reviewed",
    enrollment: { total: 270, boys: 140, girls: 130 },
    attendance: { total: 234, boys: 121, girls: 113 },
    totalMeals: 4680,
    avgMealsPerDay: 234,
    issues: getRandomIssues(82.8),
  },
  "12": {
    id: 12,
    name: "School 17",
    code: "1017",
    score: 84.3,
    status: "Waiting for Corrections",
    enrollment: { total: 360, boys: 186, girls: 174 },
    attendance: { total: 318, boys: 166, girls: 152 },
    totalMeals: 6360,
    avgMealsPerDay: 318,
    issues: getRandomIssues(84.3),
  },
  "13": {
    id: 13,
    name: "School 41",
    code: "1041",
    score: 85.6,
    status: "To be Reviewed",
    enrollment: { total: 290, boys: 150, girls: 140 },
    attendance: { total: 256, boys: 133, girls: 123 },
    totalMeals: 5120,
    avgMealsPerDay: 256,
    issues: getRandomIssues(85.6),
  },
  "14": {
    id: 14,
    name: "School 12",
    code: "1012",
    score: 87.1,
    status: "To be Reviewed",
    enrollment: { total: 240, boys: 124, girls: 116 },
    attendance: { total: 209, boys: 108, girls: 101 },
    totalMeals: 4180,
    avgMealsPerDay: 209,
    issues: getRandomIssues(87.1),
  },
  "15": {
    id: 15,
    name: "School 26",
    code: "1026",
    score: 88.9,
    status: "Waiting for Corrections",
    enrollment: { total: 335, boys: 174, girls: 161 },
    attendance: { total: 295, boys: 154, girls: 141 },
    totalMeals: 5900,
    avgMealsPerDay: 295,
    issues: getRandomIssues(88.9),
  },
  "16": {
    id: 16,
    name: "School 5",
    code: "1005",
    score: 90.2,
    status: "To be Reviewed",
    enrollment: { total: 305, boys: 158, girls: 147 },
    attendance: { total: 267, boys: 139, girls: 128 },
    totalMeals: 5340,
    avgMealsPerDay: 267,
    issues: getRandomIssues(90.2),
  },
  "17": {
    id: 17,
    name: "School 33",
    code: "1033",
    score: 91.4,
    status: "Waiting for Corrections",
    enrollment: { total: 275, boys: 143, girls: 132 },
    attendance: { total: 241, boys: 125, girls: 116 },
    totalMeals: 4820,
    avgMealsPerDay: 241,
    issues: getRandomIssues(91.4),
  },
  "18": {
    id: 18,
    name: "School 19",
    code: "1019",
    score: 93.7,
    status: "To be Reviewed",
    enrollment: { total: 320, boys: 166, girls: 154 },
    attendance: { total: 278, boys: 145, girls: 133 },
    totalMeals: 5560,
    avgMealsPerDay: 278,
    issues: getRandomIssues(93.7),
  },
  "19": {
    id: 19,
    name: "School 7",
    code: "1007",
    score: 95.3,
    status: "Accepted",
    enrollment: { total: 340, boys: 176, girls: 164 },
    attendance: { total: 302, boys: 157, girls: 145 },
    totalMeals: 6040,
    avgMealsPerDay: 302,
    issues: getRandomIssues(95.3),
  },
  "20": {
    id: 20,
    name: "School 22",
    code: "1022",
    score: 96.8,
    status: "Accepted",
    enrollment: { total: 365, boys: 189, girls: 176 },
    attendance: { total: 325, boys: 169, girls: 156 },
    totalMeals: 6500,
    avgMealsPerDay: 325,
    issues: getRandomIssues(96.8),
  },
};

export function getSchoolDetail(
  schoolId: string | undefined,
): SchoolDetailRecord | undefined {
  if (!schoolId) return undefined;
  return SCHOOL_DETAIL_BY_ID[schoolId];
}

export const DASHBOARD_SCHOOLS: SchoolDashboardRow[] = (
  Object.values(SCHOOL_DETAIL_BY_ID) as SchoolDetailRecord[]
).map(stripIssuesFromDetail);

function stripIssuesFromDetail(row: SchoolDetailRecord): SchoolDashboardRow {
  const { issues, ...rest } = row;
  void issues;
  return rest;
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
      score: parseFloat(score.toFixed(1)),
    };
  });
}
