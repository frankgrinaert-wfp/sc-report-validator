import { RotateCcw } from "lucide-react";
import { ControlPanel } from "@/components/ControlPanel";
import { Button } from "@/components/ui/button";

export function Settings() {
  return (
    <div className="flex flex-col gap-7 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-semibold text-2xl">Settings</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline">
            <RotateCcw />
            Revert changes
          </Button>
          <Button type="button">Save</Button>
        </div>
      </div>
      <ControlPanel />
    </div>
  );
}
