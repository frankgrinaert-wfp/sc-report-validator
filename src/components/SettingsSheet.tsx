import { Settings2 } from "lucide-react";
import { ControlPanel } from "@/components/ControlPanel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <Settings2 />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 border-border border-b px-6 py-4">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ControlPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
