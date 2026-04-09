export interface IHeroStatApi {
  value: string;
  label: string;
}

export interface ITrustBadgeApi {
  icon: string;
  title: string;
  subtitle: string;
}

export interface ISocialLinkApi {
  platform: string;
  href: string;
}

export interface ISiteSettingsApi {
  id: number;
  store_name: string;
  store_tagline: string;
  hero_eyebrow: string;
  hero_title_top: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_primary_cta_label: string;
  hero_primary_cta_href: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_href: string;
  hero_stats: IHeroStatApi[];
  trust_badges: ITrustBadgeApi[];
  address_line1: string;
  address_line2: string;
  phone: string;
  phone_note: string;
  email: string;
  hours: string;
  hours_note: string;
  map_embed_url: string;
  map_directions_url: string;
  social_links: ISocialLinkApi[];
  footer_about: string;
  updated_at: string;
}

export interface IHeroStat {
  value: string;
  label: string;
}

export interface ITrustBadge {
  icon: string;
  title: string;
  subtitle: string;
}

export interface ISocialLink {
  platform: string;
  href: string;
}

export interface ISiteSettings {
  id: number;
  storeName: string;
  storeTagline: string;
  heroEyebrow: string;
  heroTitleTop: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroStats: IHeroStat[];
  trustBadges: ITrustBadge[];
  addressLine1: string;
  addressLine2: string;
  phone: string;
  phoneNote: string;
  email: string;
  hours: string;
  hoursNote: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
  socialLinks: ISocialLink[];
  footerAbout: string;
  updatedAt: string;
}
