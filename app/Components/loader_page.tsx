'use client';

import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

interface CanvasComponentProps {
  onComplete?: () => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const DURATION = 10000;

    let animationId = 0;
    let startTime: number | null = null;
    let completed = false;

    function drawBlobPath(
      centerX: number,
      centerY: number,
      radius: number,
      time: number
    ) {
      const points = 220;
      const blobPoints: { x: number; y: number }[] = [];

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;

        const x = Math.cos(angle);
        const y = Math.sin(angle);

        const n1 = noise2D(
          x * 1.2 + time * 0.12,
          y * 1.2 + time * 0.12
        );

        const n2 = noise2D(
          x * 2.5 + time * 0.2,
          y * 2.5 + time * 0.2
        );

        const n3 = noise2D(
          x * 5.0 + time * 0.35,
          y * 5.0 + time * 0.35
        );

        const distortion =
          n1 * 32 +
          n2 * 14 +
          n3 * 6;

        const r = radius + distortion;

        blobPoints.push({
          x: centerX + x * r,
          y: centerY + y * r,
        });
      }

      ctx.beginPath();

      const first = blobPoints[0];
      const last = blobPoints[blobPoints.length - 1];

      ctx.moveTo(
        (first.x + last.x) / 2,
        (first.y + last.y) / 2
      );

      for (let i = 0; i < blobPoints.length; i++) {
        const current = blobPoints[i];
        const next = blobPoints[(i + 1) % blobPoints.length];

        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;

        ctx.quadraticCurveTo(
          current.x,
          current.y,
          midX,
          midY
        );
      }

      ctx.closePath();
    }

    function animate(timestamp: number) {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      const eased = 1 - Math.pow(1 - progress, 4);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const maxRadius = Math.hypot(canvas.width, canvas.height);
      const radius = eased * maxRadius;

      const t = elapsed * 0.00035;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cut out blob
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      drawBlobPath(centerX, centerY, radius, t);
      ctx.fill();

      ctx.restore();

      // Glow
      ctx.save();

      ctx.shadowColor = '#60A5FA';
      ctx.shadowBlur = 80;
      ctx.strokeStyle = '#3B82F6';

      for (let i = 18; i >= 4; i -= 4) {
        ctx.globalAlpha = 0.08;
        ctx.lineWidth = i;
        drawBlobPath(centerX, centerY, radius, t);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.lineWidth = 3;

      drawBlobPath(centerX, centerY, radius, t);
      ctx.stroke();

      ctx.restore();

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else if (!completed) {
        completed = true;
        onComplete?.();
      }
    }

    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
};

export default CanvasComponent;