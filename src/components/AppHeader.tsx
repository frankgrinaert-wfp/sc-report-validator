import { Home, RefreshCw, Settings, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

type AppHeaderProps = {
  title: string;
  onHome?: () => void;
};

export function AppHeader({ title, onHome }: AppHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-primary px-6 py-3 text-primary-foreground">
      <div className="flex min-w-0 items-center gap-4">
        {onHome ? (
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={onHome}
            aria-label={t("aria.home")}
          >
            <Home />
          </Button>
        ) : (
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-foreground text-primary"
            aria-hidden
          >
            <Home className="size-5" />
          </div>
        )}
        <span className="truncate font-semibold">{title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <LanguageSwitcher />
        <Button type="button" size="sm" variant="secondary" className="gap-2">
          <RefreshCw />
          {t("app.sync")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-primary-foreground hover:bg-primary-700"
          aria-label={t("aria.connection")}
          title={t("aria.connection")}
        >
          <Wifi className="size-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-primary-foreground hover:bg-primary-700"
          aria-label={t("aria.settings")}
          title={t("aria.settings")}
        >
          <Settings className="size-5" />
        </Button>
      </div>
    </header>
  );
}
