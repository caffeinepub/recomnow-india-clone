import { Suspense, lazy } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const ProductGrid = lazy(() => import("../components/ProductGrid"));

const SKELETON_KEYS = Array.from(
  { length: 10 },
  (_, i) => `home-skeleton-${i}`,
);

function ProductGridSkeleton() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse flex flex-col"
            >
              <div className="aspect-[3/4] bg-muted" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-5 bg-muted rounded w-1/2 mt-1" />
                <div className="h-9 bg-muted rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface HomePageProps {
  navigate: (path: string) => void;
}

export default function HomePage({ navigate }: HomePageProps) {
  return (
    <>
      <Header currentPath="/" navigate={navigate} />
      <main className="flex-1">
        <Hero navigate={navigate} />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
