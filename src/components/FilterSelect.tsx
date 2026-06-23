"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  id?: string;
  label: string;
  value?: string;
  onValueChange: (value: string | undefined) => void;
  options: FilterSelectOption[];
  className?: string;
  contentClassName?: string;
};

export function FilterSelect({
  id,
  label,
  value,
  onValueChange,
  options,
  className,
  contentClassName,
}: FilterSelectProps) {
  const selectedItem =
    options.find((option) => option.value === value) ?? null;

  return (
    <Combobox
      items={options}
      value={selectedItem}
      onValueChange={(item) =>
        onValueChange(item ? item.value : undefined)
      }
      isItemEqualToValue={(a, b) => a.value === b.value}
    >
      <ComboboxInput
        id={id}
        placeholder={label}
        showClear
        className={cn("w-48", className)}
        aria-label={label}
      />
      <ComboboxContent className={contentClassName}>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
