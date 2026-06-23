import { Progress } from "@/components/ui/progress";
import {
  REPORT_DAILY_ENTRIES_TOTAL,
  type MetricProgressConfig,
  type ProgressMetricTone,
  progressMetricIndicatorSlotClass,
} from "@/data/reportDashboard";
import { cn } from "@/lib/utils";

type ToneProgressProps = {
  value: number;
  tone: ProgressMetricTone;
  className?: string;
  "aria-label"?: string;
};

export function ToneProgress({
  value,
  tone,
  className,
  "aria-label": ariaLabel,
}: ToneProgressProps) {
  return (
    <div className={cn(progressMetricIndicatorSlotClass(tone), className)}>
      <Progress value={value} className="w-full" aria-label={ariaLabel} />
    </div>
  );
}

type MetricProgressProps = MetricProgressConfig & {
  className?: string;
  barClassName?: string;
  layout?: "inline" | "stacked";
};

function MetricProgressLabel({
  label,
  labelSuffix,
  className,
}: {
  label: string;
  labelSuffix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {label}
      {labelSuffix ? (
        <span className="text-muted-foreground"> {labelSuffix}</span>
      ) : null}
    </span>
  );
}

export function DailyEntriesDisplay({
  entries,
  total = REPORT_DAILY_ENTRIES_TOTAL,
}: {
  entries: number;
  total?: number;
}) {
  return (
    <span
      className="text-sm tabular-nums"
      aria-label={`Days entered ${entries} / ${total}`}
    >
      <span
        className={cn(entries < total ? "text-danger-600" : "text-foreground")}
      >
        {entries}
      </span>
      <span className="text-muted-foreground"> / {total}</span>
    </span>
  );
}

export function MetricProgress({
  value,
  label,
  labelSuffix,
  tone,
  ariaLabel,
  className,
  barClassName,
  layout = "inline",
}: MetricProgressProps) {
  const resolvedBarClassName =
    barClassName ?? (layout === "stacked" ? "w-full" : "w-16 shrink-0");

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <MetricProgressLabel
          label={label}
          labelSuffix={labelSuffix}
          className="font-semibold text-foreground text-xl tabular-nums"
        />
        <ToneProgress
          value={value}
          tone={tone}
          className={resolvedBarClassName}
          aria-label={ariaLabel}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ToneProgress
        value={value}
        tone={tone}
        className={resolvedBarClassName}
        aria-label={ariaLabel}
      />
      <MetricProgressLabel
        label={label}
        labelSuffix={labelSuffix}
        className="shrink-0 text-foreground text-sm tabular-nums"
      />
    </div>
  );
}
