"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { IProductFilter } from "@/domain/services/productService";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface IFilterOptions {
  brands: string[];
  variants: string[];
  materials: string[];
  priceRange: { min: number; max: number };
}

interface FilterPanelProps {
  options: IFilterOptions;
  filter: IProductFilter;
  onChange: (filter: IProductFilter) => void;
  onReset: () => void;
}

export function FilterPanel({ options, filter, onChange, onReset }: FilterPanelProps) {
  const toggleArray = (key: keyof IProductFilter, value: string) => {
    const current = (filter[key] as string[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filter, [key]: next.length ? next : undefined });
  };

  const isChecked = (key: keyof IProductFilter, value: string) =>
    ((filter[key] as string[] | undefined) ?? []).includes(value);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-1 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            Reset
          </Button>
        </div>

        {/* In stock */}
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5">
          <Label htmlFor="in-stock" className="text-sm">In stock only</Label>
          <Switch
            id="in-stock"
            checked={filter.inStockOnly ?? false}
            onCheckedChange={(c) =>
              onChange({ ...filter, inStockOnly: c || undefined })
            }
          />
        </div>

        {/* Price range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Price
            </Label>
          </div>
          <Slider
            min={options.priceRange.min}
            max={options.priceRange.max}
            step={100}
            value={[
              filter.minPrice ?? options.priceRange.min,
              filter.maxPrice ?? options.priceRange.max,
            ]}
            onValueChange={([min, max]) =>
              onChange({ ...filter, minPrice: min, maxPrice: max })
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(filter.minPrice ?? options.priceRange.min)}</span>
            <span>{formatPrice(filter.maxPrice ?? options.priceRange.max)}</span>
          </div>
        </div>

        <Separator />

        {options.brands.length > 0 && (
          <FilterGroup label="Brand">
            {options.brands.map((b) => (
              <CheckboxRow
                key={b}
                id={`brand-${b}`}
                label={b}
                checked={isChecked("brands", b)}
                onChange={() => toggleArray("brands", b)}
              />
            ))}
          </FilterGroup>
        )}

        {options.variants.length > 0 && (
          <FilterGroup label="Variant">
            {options.variants.map((v) => (
              <CheckboxRow
                key={v}
                id={`variant-${v}`}
                label={v}
                checked={isChecked("variants", v)}
                onChange={() => toggleArray("variants", v)}
              />
            ))}
          </FilterGroup>
        )}

        {options.materials.length > 0 && (
          <FilterGroup label="Material">
            {options.materials.map((m) => (
              <CheckboxRow
                key={m}
                id={`mat-${m}`}
                label={m}
                checked={isChecked("materials", m)}
                onChange={() => toggleArray("materials", m)}
              />
            ))}
          </FilterGroup>
        )}
      </div>
    </ScrollArea>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}
