"use client";

import { useCallback } from "react";
import { Particles, useParticlesProvider } from "@tsparticles/react";
import { useTheme } from "next-themes";

// Inner component: must be rendered inside <ParticlesProvider>
function ParticleCanvas() {
  const { loaded } = useParticlesProvider();
  const { resolvedTheme } = useTheme();

  if (!loaded) return null;

  const isDark = resolvedTheme === "dark";
  const color = isDark ? "#ffffff" : "#0f172a";

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-50 h-full w-full"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: { enable: true },
          },
          modes: {
            repulse: { distance: 50, duration: 0.1 },
          },
        },
        particles: {
          color: { value: color },
          links: {
            color: color,
            distance: 250,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.4,
            straight: false,
          },
          number: {
            density: { enable: true, width: 900, height: 900 },
            value: 80,
          },
          opacity: { value: 0.25 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}

export { ParticleCanvas };
