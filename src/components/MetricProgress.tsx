import { Progress } from "@/components/ui/progress";
import {
  type MetricProgressConfig,
  progressMetricIndicatorClass,
} from "@/data/reportDashboard";
import { cn } from "@/lib/utils";

type MetricProgressProps = MetricProgressConfig & {
  className?: string;
  barClassName?: string;
  layout?: "inline" | "stacked";
};

export function MetricProgress({
  value,
  label,
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
        <span className="font-semibold text-foreground text-xl tabular-nums">
          {label}
        </span>
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
      <span className="shrink-0 text-foreground text-sm tabular-nums">
        {label}
      </span>
    </div>
  );
}
