import { useEffect, useState } from "react";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#craft", label: "Our craft" },
  { href: "#visit", label: "Visit" },
];

function Header({ cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="site-header-inner">
        <a className="brand" href="#home" onClick={() => setOpen(false)}>
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3c4 5 7 8.5 7 13.5A7 7 0 0 1 9 16.5C9 12 12 9 16 3Z" fill="currentColor" />
            <path d="M16 14c1.6 2 2.6 3.5 2.6 5.3a2.6 2.6 0 0 1-5.2 0c0-1.8 1-3.3 2.6-5.3Z" fill="var(--bg)" />
          </svg>
          Ember
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} className="nav-link" href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="order-button" href="#menu" onClick={() => setOpen(false)}>
            Order ahead
            <span key={cartCount} className={`cart-count${cartCount > 0 ? " has-items" : ""}`}>
              {cartCount}
            </span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
