import './App.css';
import CoffeeScene from './CoffeeScene';

const drinks = [
  {
    name: 'Espresso',
    description: 'A rich, concentrated shot with a smooth finish.',
    price: '25 DKK',
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and airy foam.',
    price: '38 DKK',
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with plenty of creamy steamed milk.',
    price: '42 DKK',
  },
];

function App() {
  function scrollToMenu(event) {
  event.preventDefault();

  const menu = document.getElementById('menu');

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
      behavior: 'instant',
    });

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
  return (
    <main >
      <section className='hero'>
        <div className='hero-content'>
      <p className="eyebrow">FRESHLY BREWED, JUST FOR YOU</p>
      <h1>Your daily moment of warmth.</h1>
      <p className="hero-description">
          Slow down, take a sip, and enjoy coffee made with care.
        </p>
        <a href="#menu" className='menu-button' onClick={scrollToMenu}>
          Explore the menu
          </a>
          </div>
        <CoffeeScene/>
      </section>
      <section className='menu' id='menu'>
        <p className="eyebrow">FIND YOUR FAVORITE</p>
        <h2>Our coffee menu</h2>

        <div className='menu-grid'>
          {drinks.map((drink) => (
            <article className='menu-card' key={drink.name}>
              <h3>{drink.name}</h3>
              <p>{drink.description}</p>
              <span className='menu-price'>{drink.price}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;