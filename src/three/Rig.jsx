import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import CoffeeCup, { COFFEE_SURFACE_Y } from "./CoffeeCup";
import Steam from "./Steam";
import Beans from "./Beans";
import { store, prefersReducedMotion } from "../store";

const { clamp, lerp, damp } = THREE.MathUtils;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Скільки секції вже «заїхало» у вікно: 0 — верх секції внизу екрана, 1 — верх секції вгорі.
function sectionProgress(id) {
  const element = document.getElementById(id);
  if (!element) return 0;
  const top = element.getBoundingClientRect().top;
  return clamp((window.innerHeight - top) / window.innerHeight, 0, 1);
}

// Ключові кадри: де стоїть чашка в кожній секції
const KEYFRAMES = {
  desktop: {
    hero: { x: 1.95, y: -0.75, z: 0, scale: 0.84, tiltX: 0.3, tiltZ: 0 },
    craft: { x: -2.75, y: -0.45, z: 0, scale: 0.78, tiltX: 0.62, tiltZ: -0.12 },
    out: { x: -2.75, y: -6, z: 0, scale: 0.7, tiltX: 0.9, tiltZ: -0.3 },
  },
  mobile: {
    hero: { x: 0, y: 0.7, z: 0, scale: 0.58, tiltX: 0.35, tiltZ: 0 },
    craft: { x: 0, y: 3.4, z: -1, scale: 0.55, tiltX: 0.6, tiltZ: 0 },
    out: { x: 0, y: 6, z: -1, scale: 0.5, tiltX: 0.6, tiltZ: 0 },
  },
};

function mix(a, b, t) {
  const result = {};
  for (const key in a) result[key] = lerp(a[key], b[key], t);
  return result;
}

function Rig({ cupColor, isRotating }) {
  const outer = useRef();
  const tilt = useRef();
  const spinner = useRef();
  const shadow = useRef();
  const spin = useRef(0);
  const scroll = useRef({ craft: 0, menu: 0 });
  const intro = useRef(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const mobile = state.size.width < 760;
    const frames = mobile ? KEYFRAMES.mobile : KEYFRAMES.desktop;

    // 1. Інтро після прелоадера
    if (store.introStart !== null) {
      const t = reduced ? 1 : clamp((performance.now() - store.introStart) / 2600, 0, 1);
      intro.current = t;
    }
    const e = easeOutExpo(intro.current);

    // 2. Скрол: плавно наздоганяємо реальне значення
    const s = scroll.current;
    s.craft = damp(s.craft, sectionProgress("craft"), 5, d);
    s.menu = damp(s.menu, sectionProgress("menu"), 5, d);
    let pose = mix(frames.hero, frames.craft, easeInOut(s.craft));
    pose = mix(pose, frames.out, easeInOut(s.menu));

    // 3. Інтро: чашка виринає знизу і збільшується
    const introOffsetY = (1 - e) * -3.5;
    const introScale = 0.55 + 0.45 * e;

    outer.current.position.set(pose.x, pose.y + introOffsetY, pose.z);
    outer.current.scale.setScalar(pose.scale * introScale);

    // 4. Нахил + реакція на мишу
    const px = store.pointer.x;
    const py = store.pointer.y;
    tilt.current.rotation.x = damp(tilt.current.rotation.x, pose.tiltX - py * 0.12, 4, d);
    tilt.current.rotation.z = damp(tilt.current.rotation.z, pose.tiltZ - px * 0.06, 4, d);

    // 5. Обертання: авто + доворот на скролі
    if (isRotating && !reduced) spin.current += d * 0.22;
    spinner.current.rotation.y =
      spin.current - (1 - e) * Math.PI * 1.4 + easeInOut(s.craft) * Math.PI * 0.75;

    // 6. Пара видна в hero і зникає далі
    store.steamOpacity = e * (1 - s.craft * 0.6) * (1 - s.menu);

    // 7. Камера трохи «пливе» за мишею — відчуття глибини
    const camera = state.camera;
    camera.position.x = damp(camera.position.x, px * 0.35, 2.5, d);
    camera.position.y = damp(camera.position.y, 1.35 + py * 0.22, 2.5, d);
    camera.lookAt(0, 0.1, 0);

    if (shadow.current) shadow.current.visible = s.menu < 0.98;
  });

  return (
    <group ref={outer}>
      <group ref={tilt}>
        <group ref={spinner}>
          <CoffeeCup cupColor={cupColor} />
        </group>
        <Steam baseY={COFFEE_SURFACE_Y} />
      </group>
      <Beans intro={intro} />
      <group ref={shadow}>
        <ContactShadows
          position={[0, -0.005, 0]}
          opacity={0.6}
          scale={7}
          blur={2.4}
          far={3}
          resolution={512}
          color="#120a05"
        />
      </group>
    </group>
  );
}

export default Rig;
