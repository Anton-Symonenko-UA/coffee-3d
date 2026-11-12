import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Experience from "./three/Experience";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Cursor from "./components/Cursor";
import { Craft, Footer, Marquee, Menu, Visit } from "./components/Sections";
import { store } from "./store";

function App() {
  const [isRotating, setIsRotating] = useState(true);
  const [cupColor, setCupColor] = useState("#fff4e6");
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const handleReady = useCallback(() => {
    store.introStart = performance.now();
    setReady(true);
  }, []);

  // Позиція миші для паралаксу 3D-сцени
  useEffect(() => {
    function onMove(event) {
      store.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Поява елементів під час скролу: [data-reveal] отримує клас is-visible
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function handleAdd(name) {
    setCartCount((count) => count + 1);
    setToast({ name, id: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  return (
    <div className={`app${ready ? " is-ready" : ""}`}>
      <Preloader onReady={handleReady} />
      <Cursor />
      <Experience cupColor={cupColor} isRotating={isRotating} />
      <div className="grain" aria-hidden="true" />

      <Header cartCount={cartCount} />

      <main className="content">
        <Hero
          cupColor={cupColor}
          onCupColor={setCupColor}
          isRotating={isRotating}
          onToggleRotation={() => setIsRotating((value) => !value)}
        />
        <Marquee />
        <Craft />
        <Menu onAdd={handleAdd} />
        <Visit />
      </main>

      <Footer />

      <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span className="toast-icon" aria-hidden="true">✓</span>
            <span>
              <strong>{toast.name}</strong> added to your order
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
