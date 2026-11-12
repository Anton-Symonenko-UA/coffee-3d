import { cupColors, openingHours } from "../data";

const todayHours =
  openingHours.find((entry) => entry.dayIndexes.includes(new Date().getDay()))?.hours ?? "";

const titleLines = [["Good", "coffee."], ["Better", <em key="m">mornings.</em>]];

function Hero({ cupColor, onCupColor, isRotating, onToggleRotation }) {
  let wordIndex = 0;

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-fade" style={{ "--delay": "100ms" }}>
            <span className="pulse-dot" aria-hidden="true" />
            Specialty coffee · Nørrebro, Copenhagen
          </p>

          <h1 className="hero-title">
            {titleLines.map((line, lineIndex) => (
              <span className="hero-title-line" key={lineIndex}>
                {line.map((word, i) => {
                  const index = wordIndex++;
                  return (
                    <span className="word" key={i}>
                      <span style={{ "--i": index }}>{word}</span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <p className="hero-description hero-fade" style={{ "--delay": "700ms" }}>
            Small-batch roasts, silky milk and a quiet moment just for you. Freshly roasted every
            week, poured with care every morning.
          </p>

          <div className="hero-actions hero-fade" style={{ "--delay": "850ms" }}>
            <a href="#menu" className="button button-primary">
              Explore the menu
              <span aria-hidden="true" className="button-arrow">→</span>
            </a>
            <a href="#craft" className="button button-ghost">
              Our craft
            </a>
          </div>

          <div className="customizer hero-fade" style={{ "--delay": "1000ms" }}>
            <p className="customizer-label">
              Pick your glaze
              <span>{cupColors.find((c) => c.value === cupColor)?.name}</span>
            </p>
            <div className="swatches">
              {cupColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className="swatch"
                  aria-label={`${color.name} glaze`}
                  aria-pressed={cupColor === color.value}
                  style={{ "--swatch": color.value }}
                  onClick={() => onCupColor(color.value)}
                />
              ))}
              <span className="swatch-divider" aria-hidden="true" />
              <button
                type="button"
                className="icon-button"
                onClick={onToggleRotation}
                aria-label={isRotating ? "Pause rotation" : "Resume rotation"}
                title={isRotating ? "Pause rotation" : "Resume rotation"}
              >
                {isRotating ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="7" y="6" width="3.2" height="12" rx="1" />
                    <rect x="13.8" y="6" width="3.2" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Місце під 3D-чашку (на мобільному тримає висоту) */}
        <div className="cup-stage" aria-hidden="true" />
      </div>

      <div className="hero-footer hero-fade" style={{ "--delay": "1300ms" }}>
        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue-line" />
          Scroll
        </div>
        <ul className="hero-facts">
          <li>
            <strong>Roasted weekly</strong>
            <span>in our own roastery</span>
          </li>
          <li>
            <strong>3 origins</strong>
            <span>this season</span>
          </li>
          <li>
            <strong>Open today</strong>
            <span>{todayHours}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;
