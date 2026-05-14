/** English copy for validation issue keys used in mock data. */
export const ISSUE_LABELS: Record<string, string> = {
  "issue.purchasePriceHigh": "Purchase price is suspiciously high",
  "issue.purchasePriceLow": "Purchase price is suspiciously low",
  "issue.batchMissing": "Batch number is missing",
  "issue.batchDigits": "Batch number is less than required digits",
  "issue.batchDuplicate":
    "Two or more commodities have the same batch number",
  "issue.vendorMissing": "Missing vendor information",
  "issue.attendanceHigh":
    "Daily attendance is higher than the tolerance level",
  "issue.attendanceLow":
    "Daily attendance is lower than the tolerance level",
  "issue.attendanceSame":
    "Daily attendance is the same for all school days within the month",
  "issue.attendanceExceeds": "Daily attendance exceeds enrolment",
  "issue.enrolmentIncrease":
    "Enrolment update exceeds previous enrolment by 50 percent",
  "issue.noAbsences": "No absences recorded for 10 consecutive days",
  "issue.attendanceMissing": "Attendance data is missing",
  "issue.attendanceZero": "Attendance is recorded as zero",
  "issue.cerealsExceeds":
    "Cereals consumption per student exceeds maximum",
  "issue.pulsesExceeds":
    "Pulses consumption per student exceeds maximum",
  "issue.consumptionHigh":
    "Aggregated daily consumption per student exceeds maximum",
  "issue.consumptionLow":
    "Aggregated daily consumption per student is lower than minimum",
  "issue.consumptionZero":
    "Aggregated daily consumption per student is zero",
  "issue.consumptionMissing":
    "Aggregated daily consumption per student is missing",
  "issue.foodStolen":
    'A loss is recorded with the "Food was stolen" reason',
  "issue.lossOther":
    'A loss is recorded with "Other" and no comment is written',
  "issue.lossExceeds": "Incident quantity loss exceeds threshold",
  "issue.attendanceNoMeal":
    "Attendance was recorded, but no meal consumption or reason for no meal was provided",
  "issue.stockInconsistency":
    'Stock present on a day recorded as "No stock"',
  "issue.saltNotUsed": "Meal served without salt, but salt was in stock",
  "issue.oilNotUsed": "Meal served without oil, but oil was in stock",
};

export function issueLabel(issueKey: string): string {
  return ISSUE_LABELS[issueKey] ?? issueKey;
}

export const SEVERITY_LABELS: Record<string, string> = {
  warning: "Warning",
  error: "Error",
  critical: "Critical",
  info: "Info",
};
