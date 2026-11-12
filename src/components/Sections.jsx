import { useState } from "react";
import { craftSteps, featuredDrinks, fullMenu, openingHours } from "../data";

const marqueeWords = [
  "Single origin",
  "Roasted weekly",
  "Oat milk at no extra cost",
  "Freshly baked cardamom buns",
  "Nørrebro, Copenhagen",
];

export function Marquee() {
  // Дублюємо вміст, щоб анімація translateX(-50%) була безшовною
  const items = [...marqueeWords, ...marqueeWords];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, i) => (
          <span key={i} className="marquee-item">
            {word}
            <svg viewBox="0 0 24 24">
              <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(35 12 12)" />
              <path d="M9 5.5c3 3 3 10 6 13" transform="rotate(0 12 12)" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Craft() {
  return (
    <section className="craft" id="craft">
      <div className="craft-inner">
        <div className="craft-spacer" aria-hidden="true" />
        <div className="craft-content">
          <p className="eyebrow" data-reveal>
            Our craft
          </p>
          <h2 className="section-title" data-reveal style={{ "--d": "80ms" }}>
            From a single farm <br />
            to your cup, in <em>three slow steps.</em>
          </h2>

          <ol className="craft-steps">
            {craftSteps.map((step, i) => (
              <li key={step.number} className="craft-step" data-reveal style={{ "--d": `${160 + i * 120}ms` }}>
                <span className="craft-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="craft-stats" data-reveal style={{ "--d": "300ms" }}>
            <div>
              <dt>7 days</dt>
              <dd>resting after roast</dd>
            </div>
            <div>
              <dt>93 °C</dt>
              <dd>brewing temperature</dd>
            </div>
            <div>
              <dt>18 g</dt>
              <dd>in every double shot</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

// Картка з 3D-нахилом за курсором
function DrinkCard({ drink, index, onAdd }) {
  function handleMove(event) {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--rx", `${-y * 8}deg`);
    card.style.setProperty("--ry", `${x * 10}deg`);
    card.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  }

  function handleLeave(event) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <article
      className="drink-card"
      data-reveal
      style={{ "--d": `${index * 120}ms` }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="drink-card-inner">
        <div className="drink-image-wrapper">
          <img
            className="drink-image"
            src={drink.image}
            alt={drink.imageAlt}
            width={800}
            height={600}
            loading="lazy"
          />
          {drink.badge && <span className="drink-badge">{drink.badge}</span>}
        </div>

        <div className="drink-content">
          <div className="drink-heading">
            <h3>{drink.name}</h3>
            <span className="drink-price">{drink.price} DKK</span>
          </div>
          <p>{drink.description}</p>
          <ul className="drink-notes" aria-label="Tasting notes">
            {drink.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <button type="button" className="add-button" onClick={() => onAdd(drink.name)}>
            <span aria-hidden="true">+</span> Add to order
          </button>
        </div>
      </div>
    </article>
  );
}

export function Menu({ onAdd }) {
  return (
    <section className="menu" id="menu">
      <div className="menu-inner">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal>
              Find your favourite
            </p>
            <h2 className="section-title" data-reveal style={{ "--d": "80ms" }}>
              Our coffee <em>menu</em>
            </h2>
          </div>
          <p className="section-lead" data-reveal style={{ "--d": "160ms" }}>
            Every drink starts with a double shot of our seasonal espresso. Oat, almond and whole
            milk — always at the same price.
          </p>
        </div>

        <div className="drink-grid">
          {featuredDrinks.map((drink, i) => (
            <DrinkCard key={drink.name} drink={drink} index={i} onAdd={onAdd} />
          ))}
        </div>

        <div className="full-menu">
          {fullMenu.map((group, groupIndex) => (
            <div key={group.title} className="full-menu-group" data-reveal style={{ "--d": `${groupIndex * 120}ms` }}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <button type="button" className="menu-row" onClick={() => onAdd(item.name)}>
                      <span className="menu-row-name">
                        {item.name}
                        <small>{item.detail}</small>
                      </span>
                      <span className="menu-row-dots" aria-hidden="true" />
                      <span className="menu-row-price">{item.price} DKK</span>
                      <span className="menu-row-add" aria-hidden="true">+</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  const today = new Date().getDay();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // Тут можна підключити справжній сервіс розсилки (Mailchimp, Resend тощо)
    setSubscribed(true);
  }

  return (
    <section className="visit" id="visit">
      <div className="visit-inner">
        <div className="visit-info">
          <p className="eyebrow" data-reveal>
            Visit us
          </p>
          <h2 className="section-title" data-reveal style={{ "--d": "80ms" }}>
            Come say <em>hej.</em>
          </h2>
          <address className="visit-address" data-reveal style={{ "--d": "160ms" }}>
            Ember Coffee
            <br />
            Nørrebro, 2200 København N
            <br />
            Denmark
          </address>

          <ul className="hours" data-reveal style={{ "--d": "240ms" }}>
            {openingHours.map((entry) => {
              const isToday = entry.dayIndexes.includes(today);
              return (
                <li key={entry.days} className={isToday ? "is-today" : undefined}>
                  <span>
                    {entry.days}
                    {isToday && <em> · Today</em>}
                  </span>
                  <span>{entry.hours}</span>
                </li>
              );
            })}
          </ul>

          <a
            className="button button-ghost"
            href="https://www.google.com/maps/search/?api=1&query=N%C3%B8rrebro%2C+Copenhagen"
            target="_blank"
            rel="noreferrer"
            data-reveal
            style={{ "--d": "320ms" }}
          >
            Get directions <span aria-hidden="true" className="button-arrow">↗</span>
          </a>
        </div>

        <div className="newsletter" data-reveal style={{ "--d": "200ms" }}>
          <div className="newsletter-glow" aria-hidden="true" />
          <p className="eyebrow">The roast calendar</p>
          <h3>New beans, first.</h3>
          <p>
            One short email a month: fresh origins, roastery events and the occasional free cup.
            No spam, ever.
          </p>
          {subscribed ? (
            <p className="newsletter-success" role="status">
              ☕ Thank you! Check your inbox for a welcome treat.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" className="button button-primary">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <p className="footer-tagline">A little coffee. A little calm.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#menu">Menu</a>
            <a href="#craft">Our craft</a>
            <a href="#visit">Visit</a>
          </nav>
        </div>
        <a className="footer-wordmark" href="#home" aria-label="Ember — back to top">
          Ember
        </a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ember Coffee</span>
          <span>Roasted &amp; poured in Copenhagen</span>
        </div>
      </div>
    </footer>
  );
}
