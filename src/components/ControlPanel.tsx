import { ChevronDown, ChevronLeft, Minus, Plus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const issueTypes = [
  { id: "purchase-price-high", labelKey: "issue.purchasePriceHigh", categoryKey: "alert.purchasePrice" },
  { id: "purchase-price-low", labelKey: "issue.purchasePriceLow", categoryKey: "alert.purchasePrice" },
  { id: "batch-missing", labelKey: "issue.batchMissing", categoryKey: "alert.purchasePrice" },
  { id: "batch-digits", labelKey: "issue.batchDigits", categoryKey: "alert.purchasePrice" },
  { id: "batch-duplicate", labelKey: "issue.batchDuplicate", categoryKey: "alert.purchasePrice" },
  { id: "vendor-missing", labelKey: "issue.vendorMissing", categoryKey: "alert.purchasePrice" },
  { id: "attendance-high", labelKey: "issue.attendanceHigh", categoryKey: "alert.attendance" },
  { id: "attendance-low", labelKey: "issue.attendanceLow", categoryKey: "alert.attendance" },
  { id: "attendance-same", labelKey: "issue.attendanceSame", categoryKey: "alert.attendance" },
  { id: "attendance-exceeds", labelKey: "issue.attendanceExceeds", categoryKey: "alert.attendance" },
  { id: "enrolment-increase", labelKey: "issue.enrolmentIncrease", categoryKey: "alert.attendance" },
  { id: "no-absences", labelKey: "issue.noAbsences", categoryKey: "alert.attendance" },
  { id: "attendance-missing", labelKey: "issue.attendanceMissing", categoryKey: "alert.attendance" },
  { id: "attendance-zero", labelKey: "issue.attendanceZero", categoryKey: "alert.attendance" },
  { id: "cereals-exceeds", labelKey: "issue.cerealsExceeds", categoryKey: "alert.consumption" },
  { id: "pulses-exceeds", labelKey: "issue.pulsesExceeds", categoryKey: "alert.consumption" },
  { id: "consumption-high", labelKey: "issue.consumptionHigh", categoryKey: "alert.consumption" },
  { id: "consumption-low", labelKey: "issue.consumptionLow", categoryKey: "alert.consumption" },
  { id: "consumption-zero", labelKey: "issue.consumptionZero", categoryKey: "alert.consumption" },
  { id: "consumption-missing", labelKey: "issue.consumptionMissing", categoryKey: "alert.consumption" },
  { id: "food-stolen", labelKey: "issue.foodStolen", categoryKey: "alert.incident" },
  { id: "loss-other", labelKey: "issue.lossOther", categoryKey: "alert.incident" },
  { id: "loss-exceeds", labelKey: "issue.lossExceeds", categoryKey: "alert.incident" },
  { id: "attendance-no-meal", labelKey: "issue.attendanceNoMeal", categoryKey: "alert.crossFile" },
  { id: "stock-inconsistency", labelKey: "issue.stockInconsistency", categoryKey: "alert.crossFile" },
  { id: "salt-not-used", labelKey: "issue.saltNotUsed", categoryKey: "alert.crossFile" },
  { id: "oil-not-used", labelKey: "issue.oilNotUsed", categoryKey: "alert.crossFile" },
] as const;

type ThresholdItemProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function ThresholdItem({ label, value, onChange }: ThresholdItemProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-muted-foreground text-xs">{label}</p>
      <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
        <span className="font-medium text-primary-600 text-xs tabular-nums">
          {value.toFixed(2).replace(".", ",")}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Decrease"
            onClick={() => onChange(value - 1)}
          >
            <Minus />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Increase"
            onClick={() => onChange(value + 1)}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}

type PanelSectionProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

function PanelSection({ title, open, onOpenChange, children }: PanelSectionProps) {
  return (
    <details
      className="group rounded-md border border-border"
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 bg-secondary px-3 py-2 font-medium text-sm [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-border border-t px-3 py-2">{children}</div>
    </details>
  );
}

export function ControlPanel() {
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [commodityPricesOpen, setCommodityPricesOpen] = useState(false);
  const [issueTypesOpen, setIssueTypesOpen] = useState(false);

  const [cerealsMax, setCerealsMax] = useState(250.0);
  const [pulsesMax, setPulsesMax] = useState(90.0);
  const [aggregatedMin, setAggregatedMin] = useState(150.0);
  const [aggregatedMax, setAggregatedMax] = useState(350.0);

  const [sorghum, setSorghum] = useState(5.38);
  const [millet, setMillet] = useState(0.64);
  const [salt, setSalt] = useState(0.2);
  const [palmOil, setPalmOil] = useState(1.66);
  const [onion, setOnion] = useState(0.84);
  const [sweetPotato, setSweetPotato] = useState(0.43);
  const [driedFish, setDriedFish] = useState(1.41);
  const [fishFresh, setFishFresh] = useState(1.41);

  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(
    () => new Set(issueTypes.map((issue) => issue.id)),
  );

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) next.delete(issueId);
      else next.add(issueId);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIssues(new Set(issueTypes.map((issue) => issue.id)));
  };

  const deselectAll = () => {
    setSelectedIssues(new Set());
  };

  const groupedIssues = issueTypes.reduce(
    (acc, issue) => {
      const list = acc[issue.categoryKey] ?? [];
      list.push(issue);
      acc[issue.categoryKey] = list;
      return acc;
    },
    {} as Record<string, (typeof issueTypes)[number][]>,
  );

  const { t } = useLanguage();

  return (
    <div className="h-full overflow-y-auto border-border border-e bg-card">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-base">{t("panel.title")}</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => window.dispatchEvent(new Event("togglePanel"))}
            aria-label={t("aria.hidePanel")}
            title={t("aria.hidePanel")}
          >
            <ChevronLeft />
          </Button>
        </div>

        <div className="mb-6">
          <Button type="button" variant="outline" className="w-full justify-start gap-2">
            <RotateCcw />
            {t("panel.resetFilters")}
          </Button>
        </div>

        <div className="flex flex-col gap-2 border-border border-t pt-6">
          <PanelSection
            title={t("panel.alertsFilter")}
            open={issueTypesOpen}
            onOpenChange={setIssueTypesOpen}
          >
            <div className="mb-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                onClick={selectAll}
              >
                {t("panel.selectAll")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                onClick={deselectAll}
              >
                {t("panel.deselectAll")}
              </Button>
            </div>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {Object.entries(groupedIssues).map(([category, issues]) => (
                <div key={category}>
                  <p className="mb-2 font-semibold text-muted-foreground text-xs">
                    {t(category)}
                  </p>
                  <div className="space-y-2">
                    {issues.map((issue) => (
                      <div key={issue.id} className="flex items-start gap-2">
                        <Checkbox
                          id={issue.id}
                          checked={selectedIssues.has(issue.id)}
                          onCheckedChange={() => toggleIssue(issue.id)}
                        />
                        <Label
                          htmlFor={issue.id}
                          className="font-normal text-muted-foreground text-xs leading-snug"
                        >
                          {t(issue.labelKey)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>

          <PanelSection
            title={t("panel.consumptionThresholds")}
            open={consumptionOpen}
            onOpenChange={setConsumptionOpen}
          >
            <ThresholdItem
              label={t("threshold.cerealsMax")}
              value={cerealsMax}
              onChange={setCerealsMax}
            />
            <ThresholdItem
              label={t("threshold.pulsesMax")}
              value={pulsesMax}
              onChange={setPulsesMax}
            />
            <ThresholdItem
              label={t("threshold.aggregatedMin")}
              value={aggregatedMin}
              onChange={setAggregatedMin}
            />
            <ThresholdItem
              label={t("threshold.aggregatedMax")}
              value={aggregatedMax}
              onChange={setAggregatedMax}
            />
          </PanelSection>

          <PanelSection
            title={t("panel.expectedPrices")}
            open={commodityPricesOpen}
            onOpenChange={setCommodityPricesOpen}
          >
            <ThresholdItem
              label={t("commodity.sorghum")}
              value={sorghum}
              onChange={setSorghum}
            />
            <ThresholdItem
              label={t("commodity.millet")}
              value={millet}
              onChange={setMillet}
            />
            <ThresholdItem label={t("commodity.salt")} value={salt} onChange={setSalt} />
            <ThresholdItem
              label={t("commodity.palmOil")}
              value={palmOil}
              onChange={setPalmOil}
            />
            <ThresholdItem
              label={t("commodity.onion")}
              value={onion}
              onChange={setOnion}
            />
            <ThresholdItem
              label={t("commodity.sweetPotato")}
              value={sweetPotato}
              onChange={setSweetPotato}
            />
            <ThresholdItem
              label={t("commodity.driedFish")}
              value={driedFish}
              onChange={setDriedFish}
            />
            <ThresholdItem
              label={t("commodity.fishFresh")}
              value={fishFresh}
              onChange={setFishFresh}
            />
          </PanelSection>
        </div>
      </div>
    </div>
  );
}
