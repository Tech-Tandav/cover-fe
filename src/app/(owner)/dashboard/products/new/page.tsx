"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { brandService } from "@/domain/services/brandService";
import { phoneModelService } from "@/domain/services/phoneModelService";
import { variantService } from "@/domain/services/variantService";
import { categoryService } from "@/domain/services/categoryService";
import { productService } from "@/domain/services/productService";
import { IBrand } from "@/domain/interfaces/brandInterface";
import { IPhoneModel } from "@/domain/interfaces/phoneModelInterface";
import { IVariant } from "@/domain/interfaces/variantInterface";
import { ICategory } from "@/domain/interfaces/categoryInterface";
import { ProductCreateSchema } from "@/domain/schema/ProductSchema";

type ProductFormInput = z.input<typeof ProductCreateSchema>;
type ProductFormOutput = z.output<typeof ProductCreateSchema>;

const extractError = (e: unknown): string => {
  const errs = (e as { response?: { data?: { errors?: { detail: string }[] } } })
    ?.response?.data?.errors;
  return errs?.[0]?.detail ?? "Something went wrong";
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allBrands, setAllBrands] = useState<IBrand[]>([]);
  const [phoneModels, setPhoneModels] = useState<IPhoneModel[]>([]);
  const [variants, setVariants] = useState<IVariant[]>([]);

  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [creatingBrand, setCreatingBrand] = useState(false);

  const [addingModel, setAddingModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [creatingModel, setCreatingModel] = useState(false);

  const [addingVariant, setAddingVariant] = useState(false);
  const [newVariantName, setNewVariantName] = useState("");
  const [creatingVariant, setCreatingVariant] = useState(false);

  // Tag input state for colors and sizes
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      variants: [],
      colors: [],
      sizes: [],
      is_active: true,
      hot_sale_live: false,
      is_new: false,
    },
  });

  const selectedCategoryId = watch("category");
  const selectedBrandName = watch("brand");
  const selectedVariants = watch("variants") ?? [];
  const colors = watch("colors") ?? [];
  const sizes = watch("sizes") ?? [];

  const addColor = () => {
    const v = colorInput.trim();
    if (v && !colors.includes(v)) {
      setValue("colors", [...colors, v], { shouldValidate: true });
    }
    setColorInput("");
  };

  const removeColor = (c: string) => {
    setValue("colors", colors.filter((x) => x !== c), { shouldValidate: true });
  };

  const addSize = () => {
    const v = sizeInput.trim();
    if (v && !sizes.includes(v)) {
      setValue("sizes", [...sizes, v], { shouldValidate: true });
    }
    setSizeInput("");
  };

  const removeSize = (s: string) => {
    setValue("sizes", sizes.filter((x) => x !== s), { shouldValidate: true });
  };

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const selectedBrand = useMemo(
    () => allBrands.find((b) => b.name === selectedBrandName),
    [allBrands, selectedBrandName]
  );

  const selectedModel = useMemo(
    () => phoneModels.find((m) => m.id === selectedModelId),
    [phoneModels, selectedModelId]
  );

  const filteredBrands = useMemo(() => {
    if (!selectedCategory) return [];
    return allBrands.filter((b) =>
      b.categorySlugs.includes(selectedCategory.slug)
    );
  }, [allBrands, selectedCategory]);

  useEffect(() => {
    Promise.all([categoryService.getCategories(), brandService.getBrands()]).then(
      ([cs, bs]) => {
        setCategories(cs);
        setAllBrands(bs);
      }
    );
  }, []);

  useEffect(() => {
    setSelectedModelId("");
    setVariants([]);
    setValue("variants", [], { shouldValidate: false });
    if (!selectedBrand) {
      setPhoneModels([]);
      return;
    }
    phoneModelService.getPhoneModels(selectedBrand.slug).then(setPhoneModels);
  }, [selectedBrand, setValue]);

  useEffect(() => {
    setValue("variants", [], { shouldValidate: false });
    if (!selectedModelId) {
      setVariants([]);
      return;
    }
    variantService.getVariants(selectedModelId).then(setVariants);
  }, [selectedModelId, setValue]);

  useEffect(() => {
    setValue("brand", "", { shouldValidate: false });
    setValue("variants", [], { shouldValidate: false });
    setSelectedModelId("");
    setPhoneModels([]);
    setVariants([]);
    setAddingBrand(false);
    setNewBrandName("");
  }, [selectedCategoryId, setValue]);

  const handleAddBrand = async () => {
    const name = newBrandName.trim();
    if (!name || !selectedCategory) return;
    setCreatingBrand(true);
    try {
      const created = await brandService.createBrand(name, [selectedCategory.id]);
      setAllBrands((prev) => [...prev, created]);
      setValue("brand", created.name, { shouldValidate: true });
      setAddingBrand(false);
      setNewBrandName("");
      toast.success(`Added brand "${name}"`);
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleAddModel = async () => {
    const name = newModelName.trim();
    if (!name || !selectedBrand) return;
    setCreatingModel(true);
    try {
      const created = await phoneModelService.createPhoneModel(
        name,
        selectedBrand.id
      );
      setPhoneModels((prev) => [...prev, created]);
      setSelectedModelId(created.id);
      setAddingModel(false);
      setNewModelName("");
      toast.success(`Added model "${name}"`);
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setCreatingModel(false);
    }
  };

  const handleAddVariant = async () => {
    const name = newVariantName.trim();
    if (!name || !selectedModel) return;
    setCreatingVariant(true);
    try {
      const created = await variantService.createVariant(name, selectedModel.id);
      setVariants((prev) => [...prev, created]);
      setValue("variants", [...selectedVariants, created.name], {
        shouldValidate: true,
      });
      setAddingVariant(false);
      setNewVariantName("");
      toast.success(`Added variant "${name}"`);
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setCreatingVariant(false);
    }
  };

  const toggleVariant = (name: string) => {
    const next = selectedVariants.includes(name)
      ? selectedVariants.filter((v) => v !== name)
      : [...selectedVariants, name];
    setValue("variants", next, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormOutput) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("category", data.category);
    fd.append("brand", data.brand);
    fd.append("price", String(data.price));
    fd.append("stock", String(data.stock));
    if (data.discount_price !== "" && data.discount_price != null) {
      fd.append("discount_price", String(data.discount_price));
    }
    fd.append("material", data.material ?? "");
    fd.append("colors", JSON.stringify(data.colors ?? []));
    fd.append("sizes", JSON.stringify(data.sizes ?? []));
    fd.append("description", data.description ?? "");
    fd.append("is_active", data.is_active ? "true" : "false");
    fd.append("hot_sale_live", data.hot_sale_live ? "true" : "false");
    fd.append("is_new", data.is_new ? "true" : "false");

    for (const name of data.variants ?? []) {
      const v = variants.find((vv) => vv.name === name);
      if (v) fd.append("variants", v.id);
    }

    if (imageFile) fd.append("image", imageFile);

    try {
      await productService.createProduct(fd);
      toast.success("Product created");
      router.push("/dashboard/products");
    } catch (e: unknown) {
      const errs =
        (e as { response?: { data?: { errors?: { detail: string }[] } } })
          ?.response?.data?.errors ?? [];
      if (errs.length) {
        for (const err of errs) toast.error(err.detail);
      } else {
        toast.error("Failed to create product");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New product</h1>
          <p className="text-sm text-muted-foreground">
            Add a new item to your catalog.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Slim Silicone Case"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={selectedCategoryId ?? ""}
                  onValueChange={(v) =>
                    setValue("category", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Brand</Label>
                  {selectedCategory && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => {
                        setAddingBrand((v) => !v);
                        setNewBrandName("");
                      }}
                    >
                      <Plus className="h-3 w-3" /> New
                    </Button>
                  )}
                </div>
                <Select
                  value={selectedBrandName ?? ""}
                  onValueChange={(v) =>
                    setValue("brand", v, { shouldValidate: true })
                  }
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedCategory
                          ? filteredBrands.length
                            ? "Pick a brand"
                            : "No brands yet — add one"
                          : "Pick a category first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBrands.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addingBrand && (
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      placeholder={`New brand for ${selectedCategory?.name ?? ""}`}
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddBrand();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddBrand}
                      disabled={creatingBrand || !newBrandName.trim()}
                    >
                      {creatingBrand ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                )}
                {errors.brand && (
                  <p className="text-sm text-destructive">{errors.brand.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Model</Label>
                  {selectedBrand && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => {
                        setAddingModel((v) => !v);
                        setNewModelName("");
                      }}
                    >
                      <Plus className="h-3 w-3" /> New
                    </Button>
                  )}
                </div>
                <Select
                  value={selectedModelId}
                  onValueChange={setSelectedModelId}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedBrand
                          ? phoneModels.length
                            ? "Pick a model"
                            : `No models for ${selectedBrand.name} — add one`
                          : "Pick a brand first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {phoneModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addingModel && selectedBrand && (
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      placeholder={`New ${selectedBrand.name} model (e.g. iPhone 16)`}
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddModel();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddModel}
                      disabled={creatingModel || !newModelName.trim()}
                    >
                      {creatingModel ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Variants</Label>
                  {selectedModel && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => {
                        setAddingVariant((v) => !v);
                        setNewVariantName("");
                      }}
                    >
                      <Plus className="h-3 w-3" /> New
                    </Button>
                  )}
                </div>

                {!selectedModel ? (
                  <p className="text-sm text-muted-foreground">
                    Pick a model to see its variants.
                  </p>
                ) : variants.length === 0 && !addingVariant ? (
                  <p className="text-sm text-muted-foreground">
                    No variants for {selectedModel.name} yet — add one.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {variants.map((v) => {
                      const checked = selectedVariants.includes(v.name);
                      return (
                        <label
                          key={v.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-2 text-sm hover:bg-muted/40"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleVariant(v.name)}
                          />
                          <span>{v.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {addingVariant && selectedModel && (
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      placeholder={`New ${selectedModel.name} variant (e.g. 16 Plus)`}
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddVariant();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddVariant}
                      disabled={creatingVariant || !newVariantName.trim()}
                    >
                      {creatingVariant ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                )}

                {selectedVariants.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVariants.map((name) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="gap-1 px-2 py-1"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => toggleVariant(name)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  {...register("material")}
                  placeholder="Silicone"
                />
              </div>

              {/* Colors tag input */}
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Midnight Blue"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColor}
                    disabled={!colorInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map((c) => (
                      <Badge key={c} variant="secondary" className="gap-1 px-2 py-1">
                        {c}
                        <button
                          type="button"
                          onClick={() => removeColor(c)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes tag input */}
              <div className="space-y-2">
                <Label>
                  Sizes{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. S, M, L"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSize}
                    disabled={!sizeInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1 px-2 py-1">
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSize(s)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  placeholder="Short product description…"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & stock</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount price</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  {...register("discount_price")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {imageFile && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  ["is_active", "Active"],
                  ["hot_sale_live", "Hot Sale"],
                  ["is_new", "Mark as new"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="cursor-pointer">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={!!watch(key)}
                    onCheckedChange={(v) => setValue(key, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
