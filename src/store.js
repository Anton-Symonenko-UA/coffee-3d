// Спільний стан між DOM і 3D-сценою.
// Це звичайний об'єкт (не React state), бо його читають у useFrame 60 разів на секунду —
// так ми не викликаємо зайвих ре-рендерів React.
export const store = {
  pointer: { x: 0, y: 0 }, // позиція миші, -1..1
  introStart: null, // час старту інтро-анімації (performance.now())
  steamOpacity: 0, // прозорість пари (керує Rig)
};

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
