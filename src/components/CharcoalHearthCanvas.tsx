import React, { useEffect, useRef } from 'react';

interface CharcoalHearthCanvasProps {
  enabled: boolean;
  intensity?: number;
}

interface EmberParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftPeriod: number;
  driftPhase: number;
  driftAmplitude: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

const EMBER_COLORS = [
  'rgba(251, 146, 60, ',  // orange-400
  'rgba(249, 115, 22, ',  // orange-500
  'rgba(234, 88, 12, ',   // orange-600
  'rgba(253, 186, 116, ', // orange-300
  'rgba(254, 240, 138, ', // yellow-200 (warm spark)
];

/**
 * 全屏画布碳火光晕背景 (Full-screen Canvas-based Charcoal Hearth Ambient System)
 * 采用 HTML5 Canvas 渲染红泥炭火慢火烹泉的柔和漫反射光晕、热浪呼吸脉冲与上升榄炭星火微粒
 * 优雅融合宋代茶室深墨底色，极低 CPU 负载，未开启时自动暂停渲染循环。
 */
export const CharcoalHearthCanvas: React.FC<CharcoalHearthCanvasProps> = ({
  enabled,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Current global transition alpha for smooth fade-in / fade-out
    let globalAlpha = enabled ? 1 : 0;
    const targetAlpha = enabled ? 1 : 0;

    // Initialize 28 delicate rising ember sparks
    const emberCount = Math.min(32, Math.max(16, Math.floor(width / 45)));
    const embers: EmberParticle[] = [];

    const createEmber = (initialSpread = false): EmberParticle => {
      const colorPrefix = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
      return {
        x: Math.random() * width,
        y: initialSpread ? Math.random() * height : height * 0.65 + Math.random() * (height * 0.35),
        radius: 0.8 + Math.random() * 1.6,
        speedY: 0.25 + Math.random() * 0.65,
        driftPeriod: 2.5 + Math.random() * 3.5,
        driftPhase: Math.random() * Math.PI * 2,
        driftAmplitude: 0.4 + Math.random() * 0.9,
        alpha: 0.1,
        maxAlpha: 0.25 + Math.random() * 0.45,
        color: colorPrefix,
      };
    };

    for (let i = 0; i < emberCount; i++) {
      embers.push(createEmber(true));
    }

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;

      // Smoothly approach target alpha
      if (enabled && globalAlpha < 1) {
        globalAlpha = Math.min(1, globalAlpha + 0.03);
      } else if (!enabled && globalAlpha > 0) {
        globalAlpha = Math.max(0, globalAlpha - 0.04);
      }

      ctx.clearRect(0, 0, width, height);

      if (globalAlpha > 0.005) {
        // --- 1. 炭火红泥炉热浪呼吸脉冲 (Hearth Breath Pulse) ---
        // 4.6秒呼吸周期，模拟微风轻拂橄榄炭火的温润起伏
        const breathSine = (Math.sin(elapsed * 1.36) + 1) * 0.5; // 0.0 ~ 1.0
        const pulseRatio = 0.82 + breathSine * 0.36; // 0.82 ~ 1.18

        // Focus 1: Top-Right Hearth Aura (右上角红泥炉温润红光)
        const focus1X = width * 0.82;
        const focus1Y = height * 0.16;
        const focus1Radius = Math.max(260, Math.min(width, height) * 0.65) * pulseRatio;

        const grad1 = ctx.createRadialGradient(focus1X, focus1Y, 0, focus1X, focus1Y, focus1Radius);
        grad1.addColorStop(0, `rgba(234, 88, 12, ${0.16 * globalAlpha * intensity})`);
        grad1.addColorStop(0.38, `rgba(194, 65, 12, ${0.08 * globalAlpha * intensity})`);
        grad1.addColorStop(0.72, `rgba(124, 45, 18, ${0.03 * globalAlpha * intensity})`);
        grad1.addColorStop(1, 'rgba(124, 45, 18, 0)');

        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Focus 2: Left Mid Hearth Ambient (左侧慢火温汤琥珀金光)
        const breathSine2 = (Math.cos(elapsed * 1.12) + 1) * 0.5;
        const pulseRatio2 = 0.85 + breathSine2 * 0.3;
        const focus2X = width * 0.12;
        const focus2Y = height * 0.45;
        const focus2Radius = Math.max(220, Math.min(width, height) * 0.55) * pulseRatio2;

        const grad2 = ctx.createRadialGradient(focus2X, focus2Y, 0, focus2X, focus2Y, focus2Radius);
        grad2.addColorStop(0, `rgba(249, 115, 22, ${0.12 * globalAlpha * intensity})`);
        grad2.addColorStop(0.45, `rgba(217, 119, 6, ${0.06 * globalAlpha * intensity})`);
        grad2.addColorStop(1, 'rgba(217, 119, 6, 0)');

        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);

        // Focus 3: Bottom subtle hearth heat base (席底围炉暖意微染)
        const grad3 = ctx.createLinearGradient(0, height * 0.6, 0, height);
        grad3.addColorStop(0, 'rgba(234, 88, 12, 0)');
        grad3.addColorStop(1, `rgba(234, 88, 12, ${0.045 * globalAlpha * intensity})`);
        ctx.fillStyle = grad3;
        ctx.fillRect(0, height * 0.6, width, height * 0.4);

        // --- 2. 漂浮的橄榄炭星火微粒 (Gentle Rising Embers) ---
        for (let i = 0; i < embers.length; i++) {
          const p = embers[i];
          p.y -= p.speedY;
          p.x += Math.sin(elapsed / p.driftPeriod + p.driftPhase) * p.driftAmplitude;

          // Fade in when born, fade out as it approaches ceiling
          const heightRatio = p.y / height; // 1.0 (bottom) -> 0.0 (top)
          if (heightRatio < 0.25) {
            p.alpha = Math.max(0, p.alpha - 0.012);
          } else if (p.alpha < p.maxAlpha) {
            p.alpha = Math.min(p.maxAlpha, p.alpha + 0.015);
          }

          // Draw ember circle with soft blur
          const finalEmberAlpha = p.alpha * globalAlpha * intensity;
          if (finalEmberAlpha > 0.01) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${finalEmberAlpha})`;
            ctx.fill();
          }

          // Respawn at bottom if out of view
          if (p.y < -10 || p.alpha <= 0.005) {
            embers[i] = createEmber(false);
          }
        }
      }

      // Keep running if enabled or still fading out
      if (enabled || globalAlpha > 0.005) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 select-none transition-opacity duration-700"
      style={{
        opacity: enabled ? 1 : 0,
      }}
    />
  );
};
