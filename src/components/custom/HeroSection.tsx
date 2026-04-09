"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/components/custom/SiteSettingsProvider";

export function HeroSection() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_50%,transparent_100%)]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(to right,currentColor 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-20">
        <div className="space-y-6">
          {settings?.heroEyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <MapPin className="h-3 w-3 text-primary" />
              {settings.heroEyebrow}
            </div>
          )}
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {settings?.heroTitleTop ?? ""}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {settings?.heroTitleHighlight ?? ""}
            </span>
          </h1>
          {settings?.heroSubtitle && (
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              {settings.heroSubtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {settings?.heroPrimaryCtaLabel && (
              <Link href={settings.heroPrimaryCtaHref}>
                <Button size="lg" className="gap-2 rounded-full">
                  {settings.heroPrimaryCtaLabel}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {settings?.heroSecondaryCtaLabel && (
              <Link href={settings.heroSecondaryCtaHref}>
                <Button size="lg" variant="outline" className="rounded-full">
                  {settings.heroSecondaryCtaLabel}
                </Button>
              </Link>
            )}
          </div>
          {settings?.heroStats && settings.heroStats.length > 0 && (
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              {settings.heroStats.map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="flex items-center gap-6">
                  {i > 0 && <div className="h-10 w-px bg-border" />}
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-2xl">
            {settings?.heroImageUrl && (
              <Image
                src={settings.heroImageUrl}
                alt="Featured products"
                fill
                priority
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-border/60 bg-background/90 p-3 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">New arrivals weekly</p>
                <p className="text-xs text-muted-foreground">
                  Direct from authorized suppliers
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -left-4 top-8 hidden rounded-xl border border-border/60 bg-background/95 p-3 shadow-xl backdrop-blur md:block">
            <div className="text-[10px] uppercase text-muted-foreground">
              Save up to
            </div>
            <div className="text-2xl font-bold">40%</div>
          </div>
        </div>
      </div>
    </section>
  );
}
