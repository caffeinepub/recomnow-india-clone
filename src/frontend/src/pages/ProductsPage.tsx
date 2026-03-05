import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";

interface ProductsPageProps {
  navigate: (path: string) => void;
}

export default function ProductsPage({ navigate }: ProductsPageProps) {
  return (
    <>
      <Header currentPath="/products" navigate={navigate} />
      <main className="flex-1">
        <ProductGrid />
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
