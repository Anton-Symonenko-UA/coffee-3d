import { useEffect, useRef, useState } from "react";

// Кастомний курсор: точка + кільце з інерцією. Тільки для миші, не для тачскрінів.
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame;

    function move(event) {
      target.x = event.clientX;
      target.y = event.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      const interactive = event.target.closest?.("a, button, input, label, [data-cursor]");
      const mode = interactive?.dataset?.cursor ?? (interactive ? "link" : "");
      if (ring.current) ring.current.dataset.mode = mode;
    }

    function down() {
      ring.current?.classList.add("is-down");
    }
    function up() {
      ring.current?.classList.remove("is-down");
    }
    function leave() {
      ring.current?.classList.add("is-hidden");
      dot.current?.classList.add("is-hidden");
    }
    function enter() {
      ring.current?.classList.remove("is-hidden");
      dot.current?.classList.remove("is-hidden");
    }

    function loop() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    frame = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

export default Cursor;
