import Image from "next/image";
import Link from "next/link";
import { ICategory } from "@/domain/interfaces/categoryInterface";
import {
  Smartphone,
  ShieldCheck,
  Zap,
  Headphones,
  Watch,
  BatteryCharging,
  Speaker,
  Anchor,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  ShieldCheck,
  Zap,
  Headphones,
  Watch,
  BatteryCharging,
  Speaker,
  Anchor,
};

export function CategoryCard({ category }: { category: ICategory }) {
  const Icon = ICON_MAP[category.icon] ?? Smartphone;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-muted/40 to-muted/10">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width:640px) 50vw, 25vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-background/90 backdrop-blur shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">{category.name}</h3>
          <p className="text-xs text-muted-foreground">
            {category.productCount} products
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          →
        </div>
      </div>
    </Link>
  );
}
