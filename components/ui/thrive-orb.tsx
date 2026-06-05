"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The Thrive elephant mark, isolated from any background — fills with
 * `currentColor` so consumers control its color via Tailwind text utilities.
 */
export function ThriveLogoMark({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Thrive Club"
      {...props}
    >
      <path
        d="M6.00722 21.4089C6.04093 20.2358 5.94502 18.8105 6.05337 17.3886C6.33848 13.6464 9.34477 10.4853 12.9759 10.0705C13.7481 9.98235 14.518 10.0073 15.2893 10.0002C15.8382 9.99514 16.2074 10.2698 16.4673 10.7721C18.709 15.1074 20.9611 19.4366 23.2099 23.7676C23.4429 24.2166 23.6898 24.6589 23.9055 25.1167C24.1425 25.619 23.9215 25.9866 23.3804 25.9886C21.4851 25.996 19.5898 25.9862 17.6945 25.9983C17.4395 26 17.3364 25.8994 17.2618 25.6701C16.9993 24.8619 16.7128 24.0621 16.4506 23.2535C15.9285 21.6452 14.1992 21.1224 13.0375 22.2285C12.8421 22.4147 12.697 22.6311 12.6067 22.894C12.2964 23.7968 11.9599 24.6906 11.6676 25.5994C11.5658 25.9159 11.4126 26.0017 11.1042 25.999C9.54444 25.9842 7.98435 25.9829 6.42457 26C6.09789 26.0037 5.99674 25.9071 6.00067 25.5722C6.01605 24.2678 6.00722 22.9634 6.00722 21.4089Z"
        fill="currentColor"
      />
      <path
        d="M29.9913 20.4345C29.9913 22.1259 29.9799 23.8173 29.9999 25.5084C30.0044 25.8924 29.8679 25.9653 29.4995 25.9905C28.721 26.044 28.2182 25.8907 27.8057 25.1049C26.0533 21.7667 24.2014 18.4784 22.3845 15.1722C21.646 13.8282 20.9099 12.4829 20.1628 11.1436C19.7965 10.4871 20.0611 10.0053 20.8283 10.0177C22.1926 10.0395 23.5607 9.92193 24.9213 10.1034C27.5765 10.4578 30.0468 12.9012 29.9916 15.8996C29.9637 17.4109 29.9868 18.9229 29.9868 20.4345C29.9878 20.4345 29.9896 20.4345 29.9913 20.4345Z"
        fill="currentColor"
      />
    </svg>
  )
}

export interface ThriveOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Outer diameter in pixels. Default 40. */
  size?: number
  /** Animation period in seconds. Default 6. Set 0 to pause. */
  speed?: number
}

/**
 * An animated, gradient-swirling "AI orb" with the Thrive elephant mark inside.
 * Inspired by the modern AI assistant pattern (ChatGPT thinking, Apple Intelligence).
 *
 * - Outer golden halo (ambient warmth)
 * - Rotating conic gradient (teal → gold → purple) for the sweep effect
 * - Inset white highlight for spherical depth
 * - The Thrive logo mark stays still in the center while the gradient rotates around it
 */
export function ThriveOrb({
  size = 40,
  speed = 6,
  className,
  style,
  ...props
}: ThriveOrbProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {/* Outer golden halo — warm ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-full opacity-70 blur-md"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(212, 207, 180, 0.65) 0%, rgba(167, 152, 104, 0.35) 40%, rgba(105, 87, 63, 0.18) 65%, transparent 80%)",
        }}
      />

      {/* Orb body — overflow-hidden so the rotating gradient stays circular */}
      <div
        className="relative size-full overflow-hidden rounded-full"
        style={{
          boxShadow:
            "0 2px 4px 0 rgba(105,87,63,0.25), 0 4px 6px 0 rgba(105,87,63,0.18)",
        }}
      >
        {/* Rotating conic gradient — brand-only luminosity sweep */}
        <div
          aria-hidden="true"
          data-thrive-orb-spinner=""
          className="absolute inset-0"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, " +
              "#fffef9 0%, " /* brand-25  */ +
              "#d4cfb4 12%, " /* brand-200 */ +
              "#a79868 28%, " /* brand-400 */ +
              "#69573f 48%, " /* brand-700 */ +
              "#2c231c 60%, " /* brand-950 */ +
              "#69573f 72%, " +
              "#a79868 86%, " +
              "#fffef9 100%)",
            animation:
              speed > 0 ? `thrive-orb-spin ${speed}s linear infinite` : undefined,
          }}
        />

        {/* === LIQUID-GLASS OVERLAYS — stationary, give it the "glass orb" feel === */}

        {/* 1. Top specular highlight — a soft white smear in the upper-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 65% 45% at 32% 22%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 35%, rgba(255,255,255,0) 70%)",
          }}
        />

        {/* 2. Top edge rim — hairline highlight where glass meets light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 18% at 50% 8%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        {/* 3. Bottom rim shadow — subtle darkening where the sphere "rolls under" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 75% 30% at 50% 100%, rgba(44,35,28,0.45) 0%, rgba(44,35,28,0.2) 35%, rgba(44,35,28,0) 70%)",
          }}
        />

        {/* 4. Inner border ring — gives the sphere a defined edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 1px 1px 0 rgba(255,255,255,0.35), inset 0 -1px 2px 0 rgba(44,35,28,0.25), inset 0 0 0 0.5px rgba(255,255,255,0.1)",
          }}
        />

        {/* Centered Thrive mark — stationary while the gradient sweeps around it.
            Color: brand-950 (deep brown) for legibility on the cream/gold sweeps;
            paired with a white-glow drop-shadow so it stays readable when the
            dark stop rotates underneath. Dual-shadow = embossed/coin-like feel. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ThriveLogoMark
            className="text-brand-950"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              // Stacked drop-shadows: tight halo + soft glow → readable on both
              // light and dark gradient stops as it rotates.
              filter:
                "drop-shadow(0 0 2px rgba(255,255,255,0.85)) drop-shadow(0 0 5px rgba(255,255,255,0.45))",
            }}
          />
        </div>
      </div>

      {/* Inline keyframes — keeps the animation self-contained without
          touching globals.css (so the component is portable). */}
      <style>{`
        @keyframes thrive-orb-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-thrive-orb-spinner] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
