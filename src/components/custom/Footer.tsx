"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Zap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
} from "lucide-react";
import { useSiteSettings } from "@/components/custom/SiteSettingsProvider";
import { categoryService } from "@/domain/services/categoryService";
import { ICategory } from "@/domain/interfaces/categoryInterface";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  return (
    <footer className="mt-20 border-t border-border/40 bg-muted/20">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base">{settings?.storeName ?? ""}</span>
              {settings?.storeTagline && (
                <span className="text-[10px] font-normal text-muted-foreground">
                  {settings.storeTagline}
                </span>
              )}
            </div>
          </Link>
          {settings?.footerAbout && (
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {settings.footerAbout}
            </p>
          )}
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="mt-4 flex gap-2">
              {settings.socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] ?? Globe;
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 hover:bg-accent"
                    aria-label={link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Shop</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Visit Us</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {settings && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {settings.addressLine1}
                  <br />
                  {settings.addressLine2}
                </span>
              </li>
            )}
            {settings?.phone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{settings.phone}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{settings.email}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4">
        <p className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {settings?.storeName ?? ""} · All rights reserved
        </p>
      </div>
    </footer>
  );
}
