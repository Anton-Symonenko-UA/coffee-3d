import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Розміри з GLB: чашка+блюдце мають ширину 0.13 і висоту ~0.057,
// поверхня кави — на висоті ~0.0496, радіус ~0.0335.
const SOURCE_WIDTH = 0.13;
export const CUP_SCALE = 3 / SOURCE_WIDTH; // нормалізуємо ширину блюдця до 3 одиниць
export const COFFEE_SURFACE_Y = 0.0496 * CUP_SCALE;

// Малюємо крему з латте-артом на canvas і використовуємо як текстуру.
function createCremaTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const c = size / 2;

  const base = ctx.createRadialGradient(c, c, 0, c, c, c);
  base.addColorStop(0, "#c98d58");
  base.addColorStop(0.55, "#a8652f");
  base.addColorStop(0.86, "#6b3818");
  base.addColorStop(1, "#3a1c0c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Дрібні бульбашки та «тигрові» плями крема
  for (let i = 0; i < 1400; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * c * 0.95;
    const x = c + Math.cos(angle) * radius;
    const y = c + Math.sin(angle) * radius;
    const light = Math.random() > 0.5;
    ctx.fillStyle = light
      ? `rgba(240, 200, 150, ${Math.random() * 0.18})`
      : `rgba(60, 25, 8, ${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Латте-арт: серце з «протяжкою»
  ctx.save();
  ctx.translate(c, c + 20);
  ctx.shadowColor = "rgba(255, 240, 220, 0.9)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#f6e8d4";
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.bezierCurveTo(-150, 30, -150, -110, -70, -125);
  ctx.bezierCurveTo(-25, -133, 0, -100, 0, -70);
  ctx.bezierCurveTo(0, -100, 25, -133, 70, -125);
  ctx.bezierCurveTo(150, -110, 150, 30, 0, 120);
  ctx.fill();

  // Внутрішні кільця серця — відтінок крема всередині молока
  ctx.shadowBlur = 6;
  ctx.strokeStyle = "rgba(190, 130, 80, 0.45)";
  ctx.lineWidth = 6;
  for (const k of [0.62, 0.36]) {
    ctx.beginPath();
    ctx.moveTo(0, 120 * k);
    ctx.bezierCurveTo(-150 * k, 30 * k, -150 * k, -110 * k, -70 * k, -125 * k);
    ctx.bezierCurveTo(-25 * k, -133 * k, 0, -100 * k, 0, -70 * k);
    ctx.bezierCurveTo(0, -100 * k, 25 * k, -133 * k, 70 * k, -125 * k);
    ctx.bezierCurveTo(150 * k, -110 * k, 150 * k, 30 * k, 0, 120 * k);
    ctx.stroke();
  }
  ctx.restore();

  // Тонка лінія «протяжки» через серце
  ctx.strokeStyle = "rgba(246, 232, 212, 0.9)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(c, c - 150);
  ctx.lineTo(c, c + 165);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function CoffeeCup({ cupColor }) {
  const { scene } = useGLTF("/models/coffeecup.glb");

  const { model, ceramic, disposables } = useMemo(() => {
    const copy = scene.clone(true);
    const created = [];

    // Глазурована кераміка: м'який блиск через clearcoat
    const ceramicMaterial = new THREE.MeshPhysicalMaterial({
      color: "#fff4e6",
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.3,
      sheenColor: new THREE.Color("#fff1de"),
      side: THREE.DoubleSide,
    });

    // Кава: темна рідина з глянцем
    const coffeeMaterial = new THREE.MeshPhysicalMaterial({
      color: "#2a1408",
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
    });
    created.push(ceramicMaterial, coffeeMaterial);

    copy.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      const name = Array.isArray(object.material)
        ? object.material[0]?.name
        : object.material?.name;
      object.material = name === "Coffee" ? coffeeMaterial : ceramicMaterial;
    });

    // Диск з кремою трохи вище поверхні кави
    const cremaTexture = createCremaTexture();
    const cremaGeometry = new THREE.CircleGeometry(0.0334, 64);
    const cremaMaterial = new THREE.MeshPhysicalMaterial({
      map: cremaTexture,
      roughness: 0.38,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    });
    const crema = new THREE.Mesh(cremaGeometry, cremaMaterial);
    crema.rotation.x = -Math.PI / 2;
    crema.position.y = 0.0499;
    copy.add(crema);
    created.push(cremaTexture, cremaGeometry, cremaMaterial);

    return { model: copy, ceramic: ceramicMaterial, disposables: created };
  }, [scene]);

  useEffect(() => () => disposables.forEach((item) => item.dispose()), [disposables]);

  // Плавний перехід кольору замість різкої заміни
  const targetColor = useMemo(() => new THREE.Color(), []);
  useFrame((_, delta) => {
    targetColor.set(cupColor);
    ceramic.color.lerp(targetColor, 1 - Math.exp(-delta * 6));
  });

  return <primitive object={model} scale={CUP_SCALE} />;
}

useGLTF.preload("/models/coffeecup.glb");

export default CoffeeCup;
