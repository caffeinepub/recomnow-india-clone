import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import { useDebounce } from "../hooks/useDebounce";
import { useGetAllProducts } from "../hooks/useQueries";
import ProductCard from "./ProductCard";

const PRODUCTS_PER_PAGE = 20;

type SortOption = "default" | "price-asc" | "price-desc" | "discount";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Fashion", value: "fashion" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Sarees", value: "sarees" },
  { label: "Kurta & Kurtis", value: "kurtaKurtis" },
  { label: "Festive", value: "festive" },
  { label: "Gowns", value: "gowns" },
  { label: "Salwar Suits", value: "salwarSuits" },
  { label: "Lehenga Cholis", value: "lehengaCholis" },
  { label: "Western Wear", value: "westernWear" },
  { label: "Sports Wear", value: "sportsWear" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Rings", value: "rings" },
];

const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

function matchesCategory(product: Product, category: string): boolean {
  if (category === "all") return true;
  if (category === "fashion") return product.category.__kind__ === "fashion";
  if (category === "jewellery")
    return product.category.__kind__ === "jewellery";
  if (product.category.__kind__ === "fashion") {
    return product.category.fashion === category;
  }
  if (product.category.__kind__ === "jewellery") {
    return product.category.jewellery === category;
  }
  return false;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2 mt-1" />
        <div className="h-9 bg-muted rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = [...products];

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // Category filter
    list = list.filter((p) => matchesCategory(p, activeCategory));

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price - b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price - a.price));
    } else if (sortBy === "discount") {
      list.sort((a, b) => Number(b.discountPercentage - a.discountPercentage));
    }

    return list;
  }, [products, debouncedSearch, activeCategory, sortBy]);

  // Reset page when filters change - derive from filtered instead of using effect
  const effectivePage = useMemo(() => {
    const totalPgs = Math.max(
      1,
      Math.ceil(filtered.length / PRODUCTS_PER_PAGE),
    );
    return Math.min(page, totalPgs);
  }, [filtered.length, page]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PRODUCTS_PER_PAGE),
  );
  const paginated = filtered.slice(
    (effectivePage - 1) * PRODUCTS_PER_PAGE,
    effectivePage * PRODUCTS_PER_PAGE,
  );

  const handleCategoryChange = (val: string) => {
    setActiveCategory(val);
    setPage(1);
  };

  const handleSortChange = (val: SortOption) => {
    setSortBy(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <section className="py-12 bg-background" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Our Collection
          </h2>
          <p className="text-muted-foreground">
            Discover amazing deals on fashion &amp; jewellery
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              data-ocid="products.search.input"
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-pink-hot/50 placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            data-ocid="products.filters.toggle"
            className={`border border-border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              showFilters
                ? "bg-pink-hot text-white border-pink-hot"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            🔧 Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            data-ocid="products.sort.select"
            className="border border-border rounded-xl px-4 py-2.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-pink-hot/50"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
            <p>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              product{filtered.length !== 1 ? "s" : ""} in{" "}
              <span className="font-semibold text-foreground capitalize">
                {CATEGORIES.find((c) => c.value === activeCategory)?.label ??
                  activeCategory}
              </span>
              {debouncedSearch && (
                <>
                  {" "}
                  matching{" "}
                  <span className="font-semibold text-foreground">
                    &ldquo;{debouncedSearch}&rdquo;
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              data-ocid={`products.category.tab.${idx + 1}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-pink-hot text-white"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div
            data-ocid="products.grid.list"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {SKELETON_KEYS.map((key) => (
              <SkeletonCard key={key} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div data-ocid="products.grid.list" className="py-24 text-center">
            <p className="text-4xl mb-4">🛍️</p>
            <p className="text-lg font-semibold text-foreground mb-2">
              No products found
            </p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div
            data-ocid="products.grid.list"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {paginated.map((product, idx) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                index={(effectivePage - 1) * PRODUCTS_PER_PAGE + idx + 1}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage === 1}
              data-ocid="products.pagination_prev.button"
              className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - effectivePage) <= 1) return true;
                return false;
              })
              .map((p, i, arr) => (
                <span key={p} className="flex items-center gap-2">
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="text-muted-foreground px-1">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p === effectivePage
                        ? "bg-pink-hot text-white"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage === totalPages}
              data-ocid="products.pagination_next.button"
              className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
