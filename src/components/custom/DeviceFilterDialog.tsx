"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { brandService } from "@/domain/services/brandService";
import { phoneModelService } from "@/domain/services/phoneModelService";
import { variantService } from "@/domain/services/variantService";
import { IBrand } from "@/domain/interfaces/brandInterface";
import { IPhoneModel } from "@/domain/interfaces/phoneModelInterface";
import { IVariant } from "@/domain/interfaces/variantInterface";

export interface IDeviceSelection {
  brand: IBrand;
  model: IPhoneModel;
  variant: IVariant;
}

interface DeviceFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorySlug?: string;
  onApply: (selection: IDeviceSelection) => void;
}

export function DeviceFilterDialog({
  open,
  onOpenChange,
  categorySlug,
  onApply,
}: DeviceFilterDialogProps) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [models, setModels] = useState<IPhoneModel[]>([]);
  const [variants, setVariants] = useState<IVariant[]>([]);

  const [brandSlug, setBrandSlug] = useState<string | undefined>();
  const [modelId, setModelId] = useState<string | undefined>();
  const [variantId, setVariantId] = useState<string | undefined>();

  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Load brands (scoped to current category) whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setLoadingBrands(true);
    brandService
      .getBrands(categorySlug)
      .then(setBrands)
      .finally(() => setLoadingBrands(false));
  }, [open, categorySlug]);

  // When brand changes, reset and reload its models.
  useEffect(() => {
    setModels([]);
    setVariants([]);
    setModelId(undefined);
    setVariantId(undefined);
    if (!brandSlug) return;
    setLoadingModels(true);
    phoneModelService
      .getPhoneModels(brandSlug)
      .then(setModels)
      .finally(() => setLoadingModels(false));
  }, [brandSlug]);

  // When model changes, reset and reload its variants.
  useEffect(() => {
    setVariants([]);
    setVariantId(undefined);
    if (!modelId) return;
    setLoadingVariants(true);
    variantService
      .getVariants(modelId)
      .then(setVariants)
      .finally(() => setLoadingVariants(false));
  }, [modelId]);

  const handleApply = () => {
    const brand = brands.find((b) => b.slug === brandSlug);
    const model = models.find((m) => m.id === modelId);
    const variant = variants.find((v) => v.id === variantId);
    if (!brand || !model || !variant) return;
    onApply({ brand, model, variant });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find your perfect cover</DialogTitle>
          <DialogDescription>
            Pick your phone to see only compatible products.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Brand
            </label>
            <Select
              value={brandSlug}
              onValueChange={setBrandSlug}
              disabled={loadingBrands}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loadingBrands ? "Loading brands…" : "Select brand"}
                />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.slug} value={b.slug}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Model
            </label>
            <Select
              value={modelId}
              onValueChange={setModelId}
              disabled={!brandSlug || loadingModels}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !brandSlug
                      ? "Choose a brand first"
                      : loadingModels
                        ? "Loading models…"
                        : "Select model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Variant
            </label>
            <Select
              value={variantId}
              onValueChange={setVariantId}
              disabled={!modelId || loadingVariants}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !modelId
                      ? "Choose a model first"
                      : loadingVariants
                        ? "Loading variants…"
                        : "Select variant"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Skip
          </Button>
          <Button onClick={handleApply} disabled={!variantId}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
