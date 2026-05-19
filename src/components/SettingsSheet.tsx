import { RotateCcw, Settings2 } from "lucide-react";
import { ControlPanel } from "@/components/ControlPanel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          <Settings2 />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-2xl gap-0">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-5">
          <ControlPanel />
        </div>
        <SheetFooter className="shrink-0 flex-row justify-between gap-2">
          <Button type="button" variant="ghost">
            <RotateCcw />
            Reset
          </Button>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button type="button">Apply</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
