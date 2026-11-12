import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

const MIN_DURATION = 1600; // навіть якщо все завантажилось миттєво — даємо інтро «подихати»
const FAILSAFE = 8000;

function Preloader({ onReady }) {
  const { progress, total } = useProgress();
  const [displayed, setDisplayed] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const live = useRef({ progress: 0, total: 0 });
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    live.current = { progress, total };
  }, [progress, total]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");
    const start = performance.now();
    let current = 0;
    let frame;
    let done = false;
    let last = start;

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const elapsed = now - start;
      const loaded = live.current.total > 0 ? live.current.progress : 0;
      const timeCap = Math.min(100, (elapsed / MIN_DURATION) * 100);
      const target = elapsed > FAILSAFE ? 100 : Math.min(loaded, timeCap);

      current += (target - current) * (1 - Math.exp(-dt * 5));
      if (target - current < 0.4) current = target;
      setDisplayed(current);

      if (current >= 100 && !done) {
        done = true;
        setLeaving(true);
        document.documentElement.classList.remove("is-loading");
        onReadyRef.current?.();
        setTimeout(() => setHidden(true), 1400);
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (hidden) return null;

  const value = Math.round(displayed);

  return (
    <div className={`preloader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="preloader-inner">
        <p className="preloader-brand">
          Ember <em>Coffee</em>
        </p>
        <p className="preloader-count" aria-label={`Loading ${value}%`}>
          {String(value).padStart(3, "0")}
        </p>
        <div className="preloader-bar">
          <span style={{ transform: `scaleX(${displayed / 100})` }} />
        </div>
        <p className="preloader-caption">Brewing your experience</p>
      </div>
    </div>
  );
}

export default Preloader;
