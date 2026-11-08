import "./App.css";
import CoffeeScene from "./CoffeeScene";
import { useState } from "react";

const cupColors = [
  { name: "Cream", value: "#fff8ef" },
  { name: "Terracotta", value: "#c46b4f" },
  { name: "Sage", value: "#94a88a" },
];

const drinks = [
  {
    name: "Espresso",
    description: "A rich, concentrated shot with a smooth finish.",
    price: "25 DKK",
    image: "../public/images/espresso.webp",
    imageAlt: "A cup of espresso with golden crema",
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk and airy foam.",
    price: "38 DKK",
    image: "../public/images/cappuccino.webp",
    imageAlt: "A cappuccino topped with milk foam",
  },
  {
    name: "Latte",
    description: "Smooth espresso with plenty of creamy steamed milk.",
    price: "42 DKK",
    image: "../public/images/latte.webp",
    imageAlt: "A latte with delicate latte art",
  },
];

function App() {
  const [isRotating, setIsRotating] = useState(true);
  const [cupColor, setCupColor] = useState("#fff8ef");

  function scrollToMenu(event) {
    event.preventDefault();

    const menu = document.getElementById("menu");

    if (!menu) return;

    const start = window.scrollY;
    const distance = menu.getBoundingClientRect().top;
    const duration = 2000;
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo({
        top: start + distance * easedProgress,
        behavior: "instant",
      });

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }
  return (
    <>
      <header id="home" className="site-header">
        <a className="brand" href="#home">
          Ember Coffee
        </a>

        <nav aria-label="Main navigation">
          <a className="nav-link" href="#menu" onClick={scrollToMenu}>
            Our menu
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">SPECIALTY COFFEE · SLOW MOMENTS</p>
            <h1>
              Good coffee
              <br />
              Better mornings
            </h1>
            <p className="hero-description">
              Rich espresso, silky milk, and a moment to yourself. Find your
              favorite cup.
            </p>
            <a href="#menu" className="menu-button" onClick={scrollToMenu}>
              Explore the menu
            </a>
            <div className="color-picker">
              <p className="color-picker-label">Choose your cup color</p>
              <div className="color-options">
                <button
                  className="rotation-button"
                  type="button"
                  onClick={() => setIsRotating((previous) => !previous)}
                >
                  {isRotating ? "Pause rotation" : "Resume rotation"}
                </button>
                {cupColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className="color-option"
                    aria-pressed={cupColor === color.value}
                    onClick={() => setCupColor(color.value)}
                  >
                    <span
                      className="color-swatch"
                      style={{ backgroundColor: color.value }}
                      aria-hidden="true"
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <CoffeeScene cupColor={cupColor} isRotating={isRotating} />
        </section>
        <section className="menu" id="menu">
          <p className="eyebrow">FIND YOUR FAVORITE</p>
          <h2>Our coffee menu</h2>

          <div className="menu-grid">
            {drinks.map((drink) => (
              <article className="menu-card" key={drink.name}>
                <div className="menu-card-image-wrapper">
                  <img
                    className="menu-card-image"
                    src={drink.image}
                    alt={drink.imageAlt}
                    width={800}
                    height={600}
                    loading="lazy"
                  />
                </div>

                <div className="menu-card-content">
                  <h3>{drink.name}</h3>
                  <p>{drink.description}</p>
                  <span className="menu-price">{drink.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <a className="brand" href="#home">
            Ember Coffee
          </a>

          <p className="footer-description">A little coffee. A little calm.</p>
        </div>

        <a className="nav-link" href="#home">
          Back to top ↑
        </a>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Coffee 3D
        </p>
      </footer>
    </>
  );
}

export default App;
