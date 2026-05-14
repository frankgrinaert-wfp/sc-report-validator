import { ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { ControlPanel } from "@/components/ControlPanel";
import { StatCard } from "@/components/StatCard";
import { SchoolRankingTable } from "@/components/SchoolRankingTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { DASHBOARD_SCHOOLS } from "@/data/reportDashboard";

export function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [qualityFilter, setQualityFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("score-asc");
  const { t } = useLanguage();

  useEffect(() => {
    const handleToggle = () => setIsPanelOpen((prev) => !prev);
    window.addEventListener("togglePanel", handleToggle);
    return () => window.removeEventListener("togglePanel", handleToggle);
  }, []);

  const filteredSchools =
    qualityFilter === "all"
      ? DASHBOARD_SCHOOLS
      : DASHBOARD_SCHOOLS.filter((school) => school.quality === qualityFilter);

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (orderBy) {
      case "score-asc":
        return a.score - b.score;
      case "score-desc":
        return b.score - a.score;
      case "quality": {
        const qualityOrder = { excellent: 1, good: 2, fair: 3, critical: 4 };
        return qualityOrder[a.quality] - qualityOrder[b.quality];
      }
      case "status": {
        const statusOrder = {
          Accepted: 1,
          "To be Reviewed": 2,
          "Waiting for Corrections": 3,
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
        return t("dashboard.qualityAll");
      case "excellent":
        return t("dashboard.qualityExcellent");
      case "good":
        return t("dashboard.qualityGood");
      case "fair":
        return t("dashboard.qualityFair");
      case "critical":
        return t("dashboard.qualityCritical");
      default:
        return filter;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title={t("app.title")} />

      <div className="relative flex flex-1 overflow-hidden">
        {!isPanelOpen ? (
          <div className="absolute top-2 left-0 z-10 flex flex-col items-center gap-2 rounded-e-md border border-border bg-card p-2 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsPanelOpen(true)}
              aria-label={t("aria.showPanel")}
              title={t("aria.showPanel")}
            >
              <ChevronRight />
            </Button>
            <span className="max-w-16 text-center text-muted-foreground text-xs font-medium">
              {t("panel.title")}
            </span>
          </div>
        ) : null}

        <div
          className={`shrink-0 overflow-hidden border-e border-border transition-[width] duration-300 ease-in-out ${
            isPanelOpen ? "w-72" : "w-0"
          }`}
        >
          <ControlPanel />
        </div>

        <div className="flex-1 overflow-y-auto bg-muted">
          <div className="mx-auto max-w-7xl p-8">
            <div className="mb-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="month-select">{t("dashboard.month")}</Label>
                  <Select defaultValue="may">
                    <SelectTrigger id="month-select" className="w-full">
                      <SelectValue placeholder={t("dashboard.selectMonth")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">{t("month.january")}</SelectItem>
                      <SelectItem value="february">
                        {t("month.february")}
                      </SelectItem>
                      <SelectItem value="march">{t("month.march")}</SelectItem>
                      <SelectItem value="april">{t("month.april")}</SelectItem>
                      <SelectItem value="may">{t("month.may")}</SelectItem>
                      <SelectItem value="june">{t("month.june")}</SelectItem>
                      <SelectItem value="july">{t("month.july")}</SelectItem>
                      <SelectItem value="august">{t("month.august")}</SelectItem>
                      <SelectItem value="september">
                        {t("month.september")}
                      </SelectItem>
                      <SelectItem value="october">{t("month.october")}</SelectItem>
                      <SelectItem value="november">
                        {t("month.november")}
                      </SelectItem>
                      <SelectItem value="december">
                        {t("month.december")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="year-select">{t("dashboard.year")}</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="year-select" className="w-full">
                      <SelectValue placeholder={t("dashboard.selectYear")} />
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
                  <Label htmlFor="country-select">{t("dashboard.country")}</Label>
                  <Select defaultValue="gambia">
                    <SelectTrigger id="country-select" className="w-full">
                      <SelectValue placeholder={t("dashboard.selectCountry")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gambia">{t("country.gambia")}</SelectItem>
                      <SelectItem value="senegal">{t("country.senegal")}</SelectItem>
                      <SelectItem value="guinea">{t("country.guinea")}</SelectItem>
                      <SelectItem value="mali">{t("country.mali")}</SelectItem>
                      <SelectItem value="burkina-faso">
                        {t("country.burkinaFaso")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="region-select">{t("dashboard.adminRegion")}</Label>
                  <Select defaultValue="region1">
                    <SelectTrigger id="region-select" className="w-full">
                      <SelectValue placeholder={t("dashboard.selectRegion")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="region1">
                        {t("region.adminRegion1")}
                      </SelectItem>
                      <SelectItem value="region2">
                        {t("region.adminRegion2")}
                      </SelectItem>
                      <SelectItem value="region3">
                        {t("region.adminRegion3")}
                      </SelectItem>
                      <SelectItem value="region4">
                        {t("region.adminRegion4")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mb-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label={t("stats.totalSchools")} value="50" />
              <StatCard
                label={t("stats.excellent")}
                value="15"
                indicator="excellent"
              />
              <StatCard label={t("stats.good")} value="17" indicator="good" />
              <StatCard label={t("stats.fair")} value="18" indicator="fair" />
              <StatCard
                label={t("stats.critical")}
                value="0"
                indicator="critical"
              />
            </div>

            <p className="mb-8 text-muted-foreground text-sm">
              {t("dashboard.lastUpdated")}
            </p>

            <div>
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="font-semibold text-lg">
                  {t("dashboard.schoolReport")}
                </h2>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <Select value={qualityFilter} onValueChange={setQualityFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue>{getQualityLabel(qualityFilter)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("quality.all")}</SelectItem>
                      <SelectItem value="excellent">
                        {t("quality.excellent")}
                      </SelectItem>
                      <SelectItem value="good">{t("quality.good")}</SelectItem>
                      <SelectItem value="fair">{t("quality.fair")}</SelectItem>
                      <SelectItem value="critical">
                        {t("quality.critical")}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={orderBy} onValueChange={setOrderBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder={t("dashboard.orderBy")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score-asc">
                        {t("dashboard.scoreAsc")}
                      </SelectItem>
                      <SelectItem value="score-desc">
                        {t("dashboard.scoreDesc")}
                      </SelectItem>
                      <SelectItem value="quality">{t("dashboard.quality")}</SelectItem>
                      <SelectItem value="status">{t("dashboard.status")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button type="button" variant="secondary" className="gap-2">
                    <Download />
                    {t("dashboard.downloadAll")}
                  </Button>
                </div>
              </div>

              <SchoolRankingTable schools={sortedSchools} />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.avgAttendance")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.total")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceTotal}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.boys")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceBoys}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.girls")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {avgAttendanceGirls}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.mealsDelivered")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 border-border border-t pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.totalMealsDelivered")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {aggregatedData.totalMeals.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground text-sm">
                      {t("dashboard.avgMealsPerDay")}
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
    </div>
  );
}
