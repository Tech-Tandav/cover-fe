"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/custom/HeroSection";
import { CategoryCard } from "@/components/custom/CategoryCard";
import { HotSale } from "@/components/custom/HotSale";
import { StoreLocation } from "@/components/custom/StoreLocation";
import { categoryService } from "@/domain/services/categoryService";
import { productService } from "@/domain/services/productService";
import { ICategory } from "@/domain/interfaces/categoryInterface";
import { IProduct } from "@/domain/interfaces/productInterface";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useSiteSettings } from "@/components/custom/SiteSettingsProvider";

const TRUST_ICONS: Record<string, LucideIcon> = {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
};

export default function LandingPage() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [hotSale, setHotSale] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      categoryService.getCategories(),
      productService.getHotSaleProducts(),
    ])
      .then(([cats, hot]) => {
        setCategories(cats);
        setHotSale(hot);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">
      <HeroSection />

      {/* Trust strip */}
      {settings?.trustBadges && settings.trustBadges.length > 0 && (
        <section className="grid gap-3 md:grid-cols-4">
          {settings.trustBadges.map((badge, i) => {
            const Icon = TRUST_ICONS[badge.icon] ?? Sparkles;
            return (
              <div
                key={`${badge.title}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{badge.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Categories */}
      <section id="categories" className="space-y-6">
        <SectionHeader
          eyebrow="Browse by category"
          title="Shop electronic gadgets"
          subtitle="Eight categories, one trusted store in Pokhara."
        />
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

      {/* Hot Sale */}
      <HotSale products={hotSale} loading={loading} />

      {/* Store location */}
      <StoreLocation />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
