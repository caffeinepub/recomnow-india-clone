import { useCallback, useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

function getPath(): string {
  return window.location.pathname || "/";
}

export default function App() {
  const [path, setPath] = useState(getPath);

  // Set document title
  useEffect(() => {
    document.title =
      "RecomNow India - Banarasi Saree under ₹500 | Kolkata Fashion Deals";
  }, []);

  // Listen for browser back/forward
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
    return <ProductsPage navigate={navigate} />;
  }

  if (path === "/admin") {
    return <AdminPage navigate={navigate} />;
  }

  return <HomePage navigate={navigate} />;
}
