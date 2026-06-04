import { Progress } from "@/components/ui/progress";
import {
  REPORT_DAILY_ENTRIES_TOTAL,
  type MetricProgressConfig,
  progressMetricIndicatorClass,
} from "@/data/reportDashboard";
import { cn } from "@/lib/utils";

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
        className={cn(
          "font-medium",
          entries < total ? "text-danger-600" : "text-foreground",
        )}
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
    barClassName ?? (layout === "stacked" ? "w-full" : "max-w-20");

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <MetricProgressLabel
          label={label}
          labelSuffix={labelSuffix}
          className="font-semibold text-foreground text-xl tabular-nums"
        />
        <Progress
          value={value}
          className={resolvedBarClassName}
          indicatorClassName={progressMetricIndicatorClass(tone)}
          aria-label={ariaLabel}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={value}
        className={resolvedBarClassName}
        indicatorClassName={progressMetricIndicatorClass(tone)}
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
