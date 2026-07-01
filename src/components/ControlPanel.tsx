import type { ReactNode } from "react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "./ui/field";

const issueTypes = [
  {
    id: "purchase-price-high",
    category: "Purchase & price",
    label: "Purchase price is suspiciously high",
  },
  {
    id: "purchase-price-low",
    category: "Purchase & price",
    label: "Purchase price is suspiciously low",
  },
  {
    id: "batch-missing",
    category: "Purchase & price",
    label: "Batch number is missing",
  },
  {
    id: "batch-digits",
    category: "Purchase & price",
    label: "Batch number is less than required digits",
  },
  {
    id: "batch-duplicate",
    category: "Purchase & price",
    label: "Two or more commodities have the same batch number",
  },
  {
    id: "vendor-missing",
    category: "Purchase & price",
    label: "Missing vendor information",
  },
  {
    id: "attendance-high",
    category: "Attendance & enrolment",
    label: "Daily attendance is higher than the tolerance level",
  },
  {
    id: "attendance-low",
    category: "Attendance & enrolment",
    label: "Daily attendance is lower than the tolerance level",
  },
  {
    id: "attendance-same",
    category: "Attendance & enrolment",
    label: "Daily attendance is the same for all school days within the month",
  },
  {
    id: "attendance-exceeds",
    category: "Attendance & enrolment",
    label: "Daily attendance exceeds enrolment",
  },
  {
    id: "enrolment-increase",
    category: "Attendance & enrolment",
    label: "Enrolment update exceeds previous enrolment by 50 percent",
  },
  {
    id: "no-absences",
    category: "Attendance & enrolment",
    label: "No absences recorded for 10 consecutive days",
  },
  {
    id: "attendance-zero",
    category: "Attendance & enrolment",
    label: "Attendance is recorded as zero",
  },
  {
    id: "cereals-exceeds",
    category: "Consumption",
    label: "Cereals consumption per student exceeds maximum",
  },
  {
    id: "pulses-exceeds",
    category: "Consumption",
    label: "Pulses consumption per student exceeds maximum",
  },
  {
    id: "consumption-high",
    category: "Consumption",
    label: "Aggregated daily consumption per student exceeds maximum",
  },
  {
    id: "consumption-low",
    category: "Consumption",
    label: "Aggregated daily consumption per student is lower than minimum",
  },
  {
    id: "consumption-zero",
    category: "Consumption",
    label: "Aggregated daily consumption per student is zero",
  },
  {
    id: "consumption-missing",
    category: "Consumption",
    label: "Aggregated daily consumption per student is missing",
  },
  {
    id: "food-stolen",
    category: "Incident",
    label: 'A loss is recorded with the "Food was stolen" reason',
  },
  {
    id: "loss-other",
    category: "Incident",
    label: 'A loss is recorded with "Other" and no comment is written',
  },
  {
    id: "loss-exceeds",
    category: "Incident",
    label: "Incident quantity loss exceeds threshold",
  },
  {
    id: "attendance-no-meal",
    category: "Cross-file",
    label:
      "Attendance was recorded, but no meal consumption or reason for no meal was provided",
  },
  {
    id: "stock-inconsistency",
    category: "Cross-file",
    label: 'Stock present on a day recorded as "No stock"',
  },
  {
    id: "salt-not-used",
    category: "Cross-file",
    label: "Meal served without salt, but salt was in stock",
  },
  {
    id: "oil-not-used",
    category: "Cross-file",
    label: "Meal served without oil, but oil was in stock",
  },
] as const;

type NumberFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
};

function NumberField({ id, label, value, onChange, step }: NumberFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          const next = e.target.valueAsNumber;
          if (!Number.isNaN(next)) onChange(next);
        }}
      />
    </Field>
  );
}

type SettingsGroupProps = {
  title: string;
  children: ReactNode;
};

function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section className="space-y-5 p-5 border-none rounded-lg shadow-sm bg-background">
      <h2 className="font-semibold text-lg">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ControlPanel() {
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

  const groupedIssues = issueTypes.reduce(
    (acc, issue) => {
      const list = acc[issue.category] ?? [];
      list.push(issue);
      acc[issue.category] = list;
      return acc;
    },
    {} as Record<string, (typeof issueTypes)[number][]>,
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        {Object.entries(groupedIssues).map(([category, issues]) => (
          <SettingsGroup key={category} title={category}>
            <div className="space-y-4">
              {issues.map((issue) => (
                <Field key={issue.id} orientation="horizontal">
                  <Checkbox
                    id={issue.id}
                    checked={selectedIssues.has(issue.id)}
                    onCheckedChange={() => toggleIssue(issue.id)}
                  />
                  <FieldLabel htmlFor={issue.id} className="font-normal">
                    {issue.label}
                  </FieldLabel>
                </Field>
              ))}
            </div>
          </SettingsGroup>
        ))}

        <SettingsGroup title="Consumption thresholds">
          <div className="space-y-5">
            <NumberField
              id="cereals-max"
              label="Cereals max (g)"
              value={cerealsMax}
              onChange={setCerealsMax}
            />
            <NumberField
              id="pulses-max"
              label="Pulses max (g)"
              value={pulsesMax}
              onChange={setPulsesMax}
            />
            <NumberField
              id="aggregated-min"
              label="Aggregated min (g)"
              value={aggregatedMin}
              onChange={setAggregatedMin}
            />
            <NumberField
              id="aggregated-max"
              label="Aggregated max (g)"
              value={aggregatedMax}
              onChange={setAggregatedMax}
            />
          </div>
        </SettingsGroup>

        <SettingsGroup title="Expected commodity prices">
          <div className="space-y-5">
            <NumberField
              id="sorghum"
              label="Sorghum ($/kg)"
              value={sorghum}
              onChange={setSorghum}
              step="0.01"
            />
            <NumberField
              id="millet"
              label="Millet ($/kg)"
              value={millet}
              onChange={setMillet}
              step="0.01"
            />
            <NumberField
              id="salt"
              label="Salt ($/kg)"
              value={salt}
              onChange={setSalt}
              step="0.01"
            />
            <NumberField
              id="palm-oil"
              label="Palm oil — red ($/kg)"
              value={palmOil}
              onChange={setPalmOil}
              step="0.01"
            />
            <NumberField
              id="onion"
              label="Onion ($/kg)"
              value={onion}
              onChange={setOnion}
              step="0.01"
            />
            <NumberField
              id="sweet-potato"
              label="Sweet potato leaves ($/kg)"
              value={sweetPotato}
              onChange={setSweetPotato}
              step="0.01"
            />
            <NumberField
              id="dried-fish"
              label="Dried fish ($/kg)"
              value={driedFish}
              onChange={setDriedFish}
              step="0.01"
            />
            <NumberField
              id="fish-fresh"
              label="Fish — fresh ($/kg)"
              value={fishFresh}
              onChange={setFishFresh}
              step="0.01"
            />
          </div>
        </SettingsGroup>
      </div>
    </div>
  );
}
