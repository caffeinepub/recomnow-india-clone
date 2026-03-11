import { useState } from "react";
import logoImg from "../../public/assets/generated/recomnow-logo-upload.dim_200x200.webp";

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function Header({ currentPath, navigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Admin", path: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("/")}
            className="flex items-center gap-2.5 focus:outline-none"
            aria-label="Go to homepage"
          >
            <img
              src={logoImg}
              alt="RecomNow India Logo"
              className="w-9 h-9 rounded-full object-cover"
              width={36}
              height={36}
            />
            <span className="text-lg sm:text-xl font-bold text-foreground truncate max-w-[160px] sm:max-w-none">
              RecomNow India
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNav(link.path)}
                data-ocid={
                  link.path === "/"
                    ? "nav.home.link"
                    : link.path === "/products"
                      ? "nav.products.link"
                      : "nav.admin.link"
                }
                className={`text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? "text-pink-hot"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav("/products")}
              data-ocid="nav.shop_now.button"
              className="btn-pink hidden sm:block px-4 py-2 rounded-full text-sm"
            >
              Shop Now
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.mobile_menu.toggle"
              className="md:hidden p-2 text-foreground hover:text-pink-hot transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <span className="text-xl leading-none">✕</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNav(link.path)}
                data-ocid={
                  link.path === "/"
                    ? "nav.home.link"
                    : link.path === "/products"
                      ? "nav.products.link"
                      : "nav.admin.link"
                }
                className={`text-sm font-medium text-left transition-colors px-2 py-1.5 rounded-lg ${
                  currentPath === link.path
                    ? "text-pink-hot bg-pink-hot/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav("/products")}
              data-ocid="nav.shop_now.button"
              className="btn-pink px-4 py-2 rounded-full text-sm mt-2 w-fit"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
