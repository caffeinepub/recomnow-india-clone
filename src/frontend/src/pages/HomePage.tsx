import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

interface HomePageProps {
  navigate: (path: string) => void;
}

export default function HomePage({ navigate }: HomePageProps) {
  return (
    <>
      <Header currentPath="/" navigate={navigate} />
      <main className="flex-1">
        <Hero navigate={navigate} />
        <ProductGrid />
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
