import { useState } from "react";
import type { Product } from "../backend.d";

function formatINR(price: bigint | number): string {
  const numericValue = typeof price === "bigint" ? Number(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function getCategoryLabel(product: Product): string {
  if (product.category.__kind__ === "fashion") {
    const labels: Record<string, string> = {
      sarees: "Sarees",
      kurtaKurtis: "Kurta & Kurtis",
      festive: "Festive",
      gowns: "Gowns",
      salwarSuits: "Salwar Suits",
      lehengaCholis: "Lehenga Cholis",
      westernWear: "Western Wear",
      sportsWear: "Sports Wear",
    };
    return labels[product.category.fashion] ?? product.category.fashion;
  }
  if (product.category.__kind__ === "jewellery") {
    const labels: Record<string, string> = {
      necklaces: "Necklaces",
      rings: "Rings",
    };
    return labels[product.category.jewellery] ?? product.category.jewellery;
  }
  return "";
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const discount = Number(product.discountPercentage);
  const price = product.price;
  const mrp = product.mrp;
  const hasSavings = mrp > price;
  const savings = hasSavings ? mrp - price : 0n;

  return (
    <div
      data-ocid={`products.card.item.${index}`}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            👗
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-pink-hot text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground mb-1">
          {getCategoryLabel(product)}
        </p>
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 flex-1">
          {product.title}
        </h3>

        {/* Price block */}
        <div className="mb-3">
          <span className="text-lg font-bold text-pink-hot block">
            {formatINR(price)}
          </span>
          {hasSavings && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(mrp)}
            </span>
          )}
          {hasSavings && (
            <span className="text-xs text-green-600 font-medium ml-1">
              You save {formatINR(savings)}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pink text-center py-2 rounded-xl text-sm font-medium block"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
}
