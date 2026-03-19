import { Suspense, lazy, useCallback, useEffect, useState } from "react";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
import HomePage from "./pages/HomePage";

function getPath(): string {
  return window.location.pathname || "/";
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-pink-hot border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    document.title =
      "RecomNow India - Banarasi Saree under \u20b9500 | Kolkata Fashion Deals";
  }, []);

  useEffect(() => {
    const handlePopState = () => setPath(getPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to !== window.location.pathname) {
      window.history.pushState(null, "", to);
    }
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (path === "/products") {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProductsPage navigate={navigate} />
      </Suspense>
    );
  }

  if (path === "/admin") {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminPage navigate={navigate} />
      </Suspense>
    );
  }

  return <HomePage navigate={navigate} />;
}
