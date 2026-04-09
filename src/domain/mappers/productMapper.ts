import { IProduct, IProductApi } from "../interfaces/productInterface";

const toNum = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined || v === "") return 0;
  return typeof v === "number" ? v : Number(v);
};

const toNumOrNull = (
  v: number | string | null | undefined
): number | null => {
  if (v === null || v === undefined || v === "") return null;
  return typeof v === "number" ? v : Number(v);
};

export const mapProduct = (api: IProductApi): IProduct => {
  const price = toNum(api.price);
  const discountPrice = toNumOrNull(api.discount_price);
  const finalPrice = discountPrice ?? price;
  const stock = api.stock ?? 0;

  return {
    id: String(api.id),
    name: api.name,
    slug: api.slug,
    brand: api.brand,
    brandSlug: api.brand_slug,
    category: api.category,
    categorySlug: api.category_slug,
    variants: api.variants ?? [],
    material: api.material ?? "",
    colors: api.colors ?? [],
    sizes: api.sizes ?? [],
    price,
    discountPrice,
    finalPrice,
    stock,
    inStock: stock > 0,
    description: api.description ?? "",
    imageUrl: api.image,
    images: (api.images ?? []).map((img) => ({
      id: String(img.id),
      imageUrl: img.image,
      alt: img.alt ?? "",
    })),
    rating: toNum(api.rating),
    reviewCount: api.review_count ?? 0,
    hotSaleLive: !!api.hot_sale_live,
    isNew: !!api.is_new,
    createdAt: api.created_at,
  };
};
