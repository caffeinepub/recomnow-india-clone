import { useState } from "react";
import logoImg from "../../public/assets/uploads/IMG_20251201_202915-1-1.jpg";

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const socialLinks = [
    { icon: "f", label: "Facebook", href: "https://facebook.com" },
    { icon: "𝕏", label: "Twitter / X", href: "https://twitter.com" },
    { icon: "📸", label: "Instagram", href: "https://instagram.com" },
    { icon: "▶", label: "YouTube", href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Brand + Subscribe */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src={logoImg}
                alt="RecomNow India Logo"
                className="w-9 h-9 rounded-full object-cover"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold">RecomNow India</span>
            </div>
            <p className="text-white/70 text-sm mb-6 max-w-sm">
              Your trusted destination for curated fashion and jewellery deals.
              We handpick the best products so you don't have to.
            </p>

            {/* Email subscribe */}
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-green-400">✓</span>
                <span>Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 flex-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  data-ocid="footer.email.input"
                  className="flex-1 min-w-0 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-pink-hot focus:ring-1 focus:ring-pink-hot/50"
                />
                <button
                  type="submit"
                  data-ocid="footer.subscribe.button"
                  className="btn-pink px-4 py-2 rounded-xl text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                data-ocid="nav.home.link"
                className="text-white/70 hover:text-white text-sm text-left transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => navigate("/products")}
                data-ocid="nav.products.link"
                className="text-white/70 hover:text-white text-sm text-left transition-colors"
              >
                Products
              </button>
            </div>
          </div>

          {/* Column 3 - Follow Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-hot flex items-center justify-center transition-colors text-sm font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <p>© {year} RecomNow India. All rights reserved.</p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Built with ♥ using Caffeine
          </a>
        </div>
      </div>
    </footer>
  );
}
