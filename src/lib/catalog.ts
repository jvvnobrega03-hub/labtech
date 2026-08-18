import type { Category, Product } from "@/data/products";

export type CatalogSort = "catalog" | "name-asc" | "name-desc";

export type CatalogFilters = {
  query?: string;
  category?: string;
  sort?: CatalogSort;
};

export function normalizeSearchTerm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function filterProducts(
  products: readonly Product[],
  categories: readonly Category[],
  filters: CatalogFilters,
): Product[] {
  const query = normalizeSearchTerm(filters.query ?? "");
  const category = filters.category && filters.category !== "todos" ? filters.category : undefined;
  const categoryNames = new Map(categories.map((item) => [item.slug, `${item.name} ${item.shortName} ${item.description}`]));

  const filtered = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!query) return true;

    const searchable = normalizeSearchTerm([
      product.name,
      product.sku,
      product.brand,
      product.manufacturer,
      product.subcategory,
      product.summary,
      product.description,
      product.applications.join(" "),
      categoryNames.get(product.category),
    ].filter(Boolean).join(" "));

    return query.split(/\s+/).every((term) => searchable.includes(term));
  });

  if (filters.sort === "name-asc") {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  if (filters.sort === "name-desc") {
    return [...filtered].sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
  }

  return filtered;
}
