import { Progress } from "@/components/ui/progress";
import {
  type MetricProgressConfig,
  progressMetricIndicatorClass,
} from "@/data/reportDashboard";
import { cn } from "@/lib/utils";

type MetricProgressProps = MetricProgressConfig & {
  className?: string;
  barClassName?: string;
};

export function MetricProgress({
  value,
  label,
  tone,
  ariaLabel,
  className,
  barClassName = "max-w-20",
}: MetricProgressProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={value}
        className={barClassName}
        indicatorClassName={progressMetricIndicatorClass(tone)}
        aria-label={ariaLabel}
      />
      <span className="shrink-0 text-foreground text-sm tabular-nums">
        {label}
      </span>
    </div>
  );
}
