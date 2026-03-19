import { r as reactExports, j as jsxRuntimeExports } from "./index-DEhLQzcn.js";
import { u as useActor, a as useQuery } from "./useActor-B-vCTMEe.js";
function useDebounce(value, delay) {
  const [debounced, setDebounced] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4,
    // Retry up to 4 times with exponential backoff to handle ICP canister cold-starts
    retry: 4,
    retryDelay: (attempt) => Math.min(2e3 * 2 ** attempt, 2e4),
    // Refetch in background after mount so stale data is refreshed
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
function paiseToRupees(paise) {
  const numericValue = typeof paise === "bigint" ? Number(paise) : paise;
  return numericValue / 100;
}
function formatINR(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(paiseToRupees(price));
}
function getCategoryLabel(product) {
  if (product.category.__kind__ === "fashion") {
    const labels = {
      sarees: "Sarees",
      kurtaKurtis: "Kurta & Kurtis",
      festive: "Festive",
      gowns: "Gowns",
      salwarSuits: "Salwar Suits",
      lehengaCholis: "Lehenga Cholis",
      westernWear: "Western Wear",
      sportsWear: "Sports Wear"
    };
    return labels[product.category.fashion] ?? product.category.fashion;
  }
  if (product.category.__kind__ === "jewellery") {
    const labels = {
      necklaces: "Necklaces",
      rings: "Rings"
    };
    return labels[product.category.jewellery] ?? product.category.jewellery;
  }
  return "";
}
function ProductCard({ product, index }) {
  const [imgError, setImgError] = reactExports.useState(false);
  const discount = Number(product.discountPercentage);
  const price = product.price;
  const mrp = product.mrp;
  const hasSavings = mrp > price;
  const savings = hasSavings ? mrp - price : 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `products.card.item.${index}`,
      className: "bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-muted", children: [
          imgError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-5xl", children: "👗" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.imageUrl,
              alt: product.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              loading: "lazy",
              onError: () => setImgError(true)
            }
          ),
          discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 left-2 bg-pink-hot text-white text-xs font-bold px-2 py-1 rounded-full", children: [
            discount,
            "% OFF"
          ] }),
          product.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full", children: "⭐ Featured" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: getCategoryLabel(product) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm line-clamp-2 mb-2 flex-1", children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-pink-hot block", children: formatINR(price) }),
            hasSavings && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground line-through", children: formatINR(mrp) }),
            hasSavings && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-600 font-medium ml-1", children: [
              "You save ",
              formatINR(savings)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: product.affiliateLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "btn-pink text-center py-2 rounded-xl text-sm font-medium block",
              children: "View on Amazon"
            }
          )
        ] })
      ]
    }
  );
}
const PRODUCTS_PER_PAGE = 12;
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
  { label: "Rings", value: "rings" }
];
const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);
function matchesCategory(product, category) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden animate-pulse flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-1/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 bg-muted rounded w-1/2 mt-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 bg-muted rounded-xl mt-2" })
    ] })
  ] });
}
function ProductGrid() {
  var _a;
  const {
    isError: isActorError,
    isFetching: isActorFetching,
    refetchActor
  } = useActor();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching
  } = useGetAllProducts();
  const [search, setSearch] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [sortBy, setSortBy] = reactExports.useState("default");
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [page, setPage] = reactExports.useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const filtered = reactExports.useMemo(() => {
    let list = [...products];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => matchesCategory(p, activeCategory));
    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price - b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price - a.price));
    } else if (sortBy === "discount") {
      list.sort((a, b) => Number(b.discountPercentage - a.discountPercentage));
    }
    return list;
  }, [products, debouncedSearch, activeCategory, sortBy]);
  const effectivePage = reactExports.useMemo(() => {
    const totalPgs = Math.max(
      1,
      Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
    );
    return Math.min(page, totalPgs);
  }, [filtered.length, page]);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
  );
  const paginated = filtered.slice(
    (effectivePage - 1) * PRODUCTS_PER_PAGE,
    effectivePage * PRODUCTS_PER_PAGE
  );
  const handleCategoryChange = (val) => {
    setActiveCategory(val);
    setPage(1);
  };
  const handleSortChange = (val) => {
    setSortBy(val);
    setPage(1);
  };
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };
  const showLoading = isActorFetching || isLoading || isFetching && products.length === 0;
  const showError = isActorError || isError;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 bg-background", id: "products", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-foreground mb-2", children: "Our Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Discover amazing deals on fashion & jewellery" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm", children: "🔍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => handleSearchChange(e.target.value),
            placeholder: "Search products...",
            "data-ocid": "products.search.input",
            className: "w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-pink-hot/50 placeholder:text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowFilters(!showFilters),
          "data-ocid": "products.filters.toggle",
          className: `border border-border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${showFilters ? "bg-pink-hot text-white border-pink-hot" : "bg-card text-foreground hover:bg-muted"}`,
          children: "🔧 Filters"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: sortBy,
          onChange: (e) => handleSortChange(e.target.value),
          "data-ocid": "products.sort.select",
          className: "border border-border rounded-xl px-4 py-2.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-pink-hot/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "default", children: "Default" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-asc", children: "Price: Low to High" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-desc", children: "Price: High to Low" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "discount", children: "Biggest Discount" })
          ]
        }
      )
    ] }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Showing",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
      " ",
      "product",
      filtered.length !== 1 ? "s" : "",
      " in",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground capitalize", children: ((_a = CATEGORIES.find((c) => c.value === activeCategory)) == null ? void 0 : _a.label) ?? activeCategory }),
      debouncedSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " ",
        "matching",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
          "“",
          debouncedSearch,
          "”"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: CATEGORIES.map((cat, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => handleCategoryChange(cat.value),
        "data-ocid": `products.category.tab.${idx + 1}`,
        className: `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.value ? "bg-pink-hot text-white" : "border border-border text-foreground hover:bg-muted"}`,
        children: cat.label
      },
      cat.value
    )) }),
    showError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "products.error_state", className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground mb-2", children: "Could not load products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "The server may be waking up. Please try again." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            void refetchActor();
            void refetch();
          },
          className: "px-5 py-2 bg-pink-hot text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity",
          children: "Retry"
        }
      )
    ] }),
    !showError && (showLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "products.grid.list",
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, key))
      }
    ) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "products.grid.empty_state",
        className: "py-24 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-4", children: "🛍️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground mb-2", children: "No products found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Try adjusting your search or filters." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "products.grid.list",
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        children: paginated.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductCard,
          {
            product,
            index: (effectivePage - 1) * PRODUCTS_PER_PAGE + idx + 1
          },
          String(product.id)
        ))
      }
    )),
    !showError && !showLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPage((p) => Math.max(1, p - 1)),
          disabled: effectivePage === 1,
          "data-ocid": "products.pagination_prev",
          className: "px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
          children: "← Previous"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => {
        if (totalPages <= 7) return true;
        if (p === 1 || p === totalPages) return true;
        if (Math.abs(p - effectivePage) <= 1) return true;
        return false;
      }).map((p, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        i > 0 && arr[i - 1] !== p - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground px-1", children: "…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setPage(p),
            className: `w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === effectivePage ? "bg-pink-hot text-white" : "border border-border text-foreground hover:bg-muted"}`,
            children: p
          }
        )
      ] }, p)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
          disabled: effectivePage === totalPages,
          "data-ocid": "products.pagination_next",
          className: "px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
          children: "Next →"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-full text-center text-sm text-muted-foreground mt-1", children: [
        "Page",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: effectivePage }),
        " ",
        "of",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: totalPages })
      ] })
    ] })
  ] }) });
}
export {
  ProductGrid as default
};
