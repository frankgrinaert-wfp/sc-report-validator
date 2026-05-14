import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-md border border-border bg-card">
      <Button
        type="button"
        variant={language === "EN" ? "default" : "ghost"}
        size="sm"
        className="rounded-e-none"
        onClick={() => setLanguage("EN")}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={language === "FR" ? "default" : "ghost"}
        size="sm"
        className="rounded-s-none"
        onClick={() => setLanguage("FR")}
      >
        FR
      </Button>
    </div>
  );
}
