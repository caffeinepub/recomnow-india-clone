import heroBannerImg from "../../public/assets/generated/hero-products.dim_1600x700.jpg";

interface HeroProps {
  navigate: (path: string) => void;
}

export default function Hero({ navigate }: HeroProps) {
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBannerImg}
          alt="Fashion and Jewellery Banner"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Dark navy overlay */}
        <div className="absolute inset-0 bg-navy-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-pink-hot font-semibold text-sm uppercase tracking-widest mb-3">
            Exclusive Deals
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Fashion &amp; Jewellery
            <span className="block text-pink-hot">You'll Love</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg">
            Discover handpicked collections of sarees, kurtis, jewellery and
            more — all at unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              data-ocid="hero.shop_now.button"
              className="btn-pink px-8 py-3 rounded-full text-base font-semibold"
            >
              Shop Now
            </button>
            <button
              type="button"
              onClick={scrollToProducts}
              data-ocid="hero.view_collections.button"
              className="btn-pink-outline px-8 py-3 rounded-full text-base font-semibold"
            >
              View Collections
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
