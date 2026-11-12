export const cupColors = [
  { name: "Cream", value: "#fff4e6" },
  { name: "Charcoal", value: "#2e2a28" },
  { name: "Terracotta", value: "#c46b4f" },
  { name: "Sage", value: "#94a88a" },
  { name: "Mist", value: "#a9bccb" },
];

export const featuredDrinks = [
  {
    name: "Espresso",
    description: "A rich, concentrated shot with a syrupy body and a long, sweet finish.",
    notes: ["Dark chocolate", "Cherry", "Cane sugar"],
    price: 25,
    image: "/images/espresso.webp",
    imageAlt: "A cup of espresso with golden crema",
    badge: null,
  },
  {
    name: "Cappuccino",
    description: "Double espresso under a thick cap of velvety, hand-textured milk foam.",
    notes: ["Hazelnut", "Caramel", "Silky"],
    price: 38,
    image: "/images/cappuccino.webp",
    imageAlt: "A cappuccino topped with milk foam",
    badge: "Bestseller",
  },
  {
    name: "Latte",
    description: "Smooth espresso with plenty of creamy steamed milk and a rosetta on top.",
    notes: ["Milk chocolate", "Toffee", "Creamy"],
    price: 42,
    image: "/images/latte.webp",
    imageAlt: "A latte with delicate latte art",
    badge: "Signature",
  },
];

export const fullMenu = [
  {
    title: "Coffee",
    items: [
      { name: "Cortado", detail: "Espresso, equal part milk", price: 34 },
      { name: "Flat white", detail: "Double ristretto, micro-foam", price: 40 },
      { name: "Filter of the week", detail: "Hand-brewed V60", price: 36 },
      { name: "Cold brew", detail: "Steeped 18 hours, on ice", price: 39 },
      { name: "Mocha", detail: "Espresso, 70% cacao, milk", price: 44 },
    ],
  },
  {
    title: "Bakery & more",
    items: [
      { name: "Cardamom bun", detail: "Baked every morning", price: 32 },
      { name: "Butter croissant", detail: "Laminated in-house", price: 29 },
      { name: "Chai latte", detail: "Spiced black tea, oat milk", price: 41 },
      { name: "Ceremonial matcha", detail: "Whisked to order", price: 46 },
      { name: "Fresh orange juice", detail: "Squeezed on the spot", price: 35 },
    ],
  },
];

export const craftSteps = [
  {
    number: "01",
    title: "Source",
    text: "We buy green coffee directly from small farms in Ethiopia, Colombia and Kenya — and pay well above fair-trade prices.",
  },
  {
    number: "02",
    title: "Roast",
    text: "Small batches roasted every Tuesday in our Nørrebro roastery, then rested for seven days to let the flavour settle.",
  },
  {
    number: "03",
    title: "Pour",
    text: "Dialled in every single morning: 18 g in, 36 g out, 28 seconds. Then poured with care, one cup at a time.",
  },
];

export const openingHours = [
  { days: "Monday – Friday", hours: "07:00 – 18:00", dayIndexes: [1, 2, 3, 4, 5] },
  { days: "Saturday", hours: "08:00 – 17:00", dayIndexes: [6] },
  { days: "Sunday", hours: "09:00 – 16:00", dayIndexes: [0] },
];
