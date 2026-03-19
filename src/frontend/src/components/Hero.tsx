import badge1 from "../../public/assets/generated/badge1-fulfilled.webp";
import heroBannerImg from "../../public/assets/generated/hero-products.dim_1600x700.webp";
import badge3 from "../../public/assets/uploads/17738262339035498979444564371403-1.jpg";
import badge2 from "../../public/assets/uploads/17738262464457014729061646098311-2.jpg";

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
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "clamp(360px, 60vw, 600px)" }}
    >
      {/* Background image — LCP element, load eagerly */}
      <div className="absolute inset-0">
        <img
          src={heroBannerImg}
          alt="Fashion and Jewellery Banner"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="sync"
          width={1600}
          height={700}
        />
        {/* Dark navy overlay */}
        <div className="absolute inset-0 bg-navy-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl text-center sm:text-left">
          <p className="text-pink-hot font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">
            Exclusive Deals
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
            Fashion &amp; Jewellery
            <span className="block text-pink-hot">You'll Love</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-lg mb-6 max-w-lg mx-auto sm:mx-0">
            Discover handpicked collections of sarees, kurtis, jewellery and
            more — all at unbeatable prices.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mb-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              data-ocid="hero.shop_now.button"
              className="btn-pink px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold min-h-[44px]"
            >
              Shop Now
            </button>
            <button
              type="button"
              onClick={scrollToProducts}
              data-ocid="hero.view_collections.button"
              className="btn-pink-outline px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold min-h-[44px]"
            >
              View Collections
            </button>
          </div>
          {/* Trust Badges — centred with even spacing */}
          <div className="flex justify-center items-center gap-6 sm:gap-8">
            {[
              { src: badge1, alt: "Fulfilled by Amazon" },
              { src: badge2, alt: "Guaranteed 100% Happy Customers" },
              { src: badge3, alt: "100% Buyer Protection - Quality Assured" },
            ].map(({ src, alt }) => (
              <img
                key={alt}
                src={src}
                alt={alt}
                className="h-10 sm:h-14 w-auto object-contain"
                loading="lazy"
                decoding="async"
                width={80}
                height={56}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
