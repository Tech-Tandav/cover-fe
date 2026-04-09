"use client";

import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/custom/SiteSettingsProvider";

export function StoreLocation() {
  const { settings } = useSiteSettings();
  if (!settings) return null;

  return (
    <section className="grid gap-6 rounded-3xl border border-border/60 bg-card p-6 md:grid-cols-2 md:p-10">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium">
          <MapPin className="h-3 w-3 text-primary" />
          Visit our store
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Find us in the heart of Pokhara
        </h2>
        <p className="max-w-md text-muted-foreground">
          Drop by our shop to see and feel the products in person. Our team is
          happy to help you pick the perfect cover or accessory for your device.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{settings.addressLine1}</div>
              <div className="text-muted-foreground">{settings.addressLine2}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{settings.phone}</div>
              <div className="text-muted-foreground">{settings.phoneNote}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{settings.hours}</div>
              <div className="text-muted-foreground">{settings.hoursNote}</div>
            </div>
          </div>
        </div>

        {settings.mapDirectionsUrl && (
          <Button className="gap-2 rounded-full" asChild>
            <a href={settings.mapDirectionsUrl} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4" />
              Get directions
            </a>
          </Button>
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted/30 md:aspect-auto">
        {settings.mapEmbedUrl && (
          <iframe
            title={`${settings.storeName} location`}
            src={settings.mapEmbedUrl}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}
