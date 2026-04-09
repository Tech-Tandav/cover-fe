import {
  ISiteSettings,
  ISiteSettingsApi,
} from "../interfaces/siteSettingsInterface";

export const mapSiteSettings = (api: ISiteSettingsApi): ISiteSettings => ({
  id: api.id,
  storeName: api.store_name,
  storeTagline: api.store_tagline,
  heroEyebrow: api.hero_eyebrow,
  heroTitleTop: api.hero_title_top,
  heroTitleHighlight: api.hero_title_highlight,
  heroSubtitle: api.hero_subtitle,
  heroImageUrl: api.hero_image_url,
  heroPrimaryCtaLabel: api.hero_primary_cta_label,
  heroPrimaryCtaHref: api.hero_primary_cta_href,
  heroSecondaryCtaLabel: api.hero_secondary_cta_label,
  heroSecondaryCtaHref: api.hero_secondary_cta_href,
  heroStats: (api.hero_stats ?? []).map((s) => ({
    value: s.value,
    label: s.label,
  })),
  trustBadges: (api.trust_badges ?? []).map((b) => ({
    icon: b.icon,
    title: b.title,
    subtitle: b.subtitle,
  })),
  addressLine1: api.address_line1,
  addressLine2: api.address_line2,
  phone: api.phone,
  phoneNote: api.phone_note,
  email: api.email,
  hours: api.hours,
  hoursNote: api.hours_note,
  mapEmbedUrl: api.map_embed_url,
  mapDirectionsUrl: api.map_directions_url,
  socialLinks: (api.social_links ?? []).map((l) => ({
    platform: l.platform,
    href: l.href,
  })),
  footerAbout: api.footer_about,
  updatedAt: api.updated_at,
});
