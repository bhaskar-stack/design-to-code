"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import cosmosRaw from "@/lib/cosmos.json"

// Lottie pulls in canvas/DOM APIs; render client-side only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// ---------------------------------------------------------------------------
// Recolor the cosmos animation to use our brand-golden palette.
//   brand-400 = #a79868  → 0.654, 0.596, 0.408 (normalized 0-1 RGB)
// We replace every solid-fill ("ty: 'fl'") color in the JSON with brand-400
// so the rotating dots/circles render as warm gold in both light and dark
// modes. The radial-gradient halo behind the orb provides additional warmth.
// ---------------------------------------------------------------------------
const BRAND_400_RGBA = [167 / 255, 152 / 255, 104 / 255, 1] as const

type Json = unknown
function recolorFills(node: Json): Json {
  if (Array.isArray(node)) return node.map(recolorFills)
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>
    // Solid fill: { ty: "fl", c: { a: 0, k: [r,g,b,a], ix: 4 } }
    if (
      obj.ty === "fl" &&
      obj.c &&
      typeof obj.c === "object" &&
      Array.isArray((obj.c as Record<string, unknown>).k)
    ) {
      const c = obj.c as Record<string, unknown>
      return { ...obj, c: { ...c, k: [...BRAND_400_RGBA] } }
    }
    const next: Record<string, unknown> = {}
    for (const k of Object.keys(obj)) next[k] = recolorFills(obj[k])
    return next
  }
  return node
}

// Compute once per module load — Lottie data is static, only fills change.
const goldenCosmos = recolorFills(cosmosRaw)

export interface CosmosOrbProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Bounding-box size in pixels. Default 28. */
  size?: number
  /** Loop the animation. Default true. */
  loop?: boolean
}

/**
 * Brand-gold rotating cosmos animation — just the moving dots, no orb halo.
 * Used by the Thinking Loader to indicate generation in progress.
 *
 * Note: name retained for import stability; visually it's not an orb.
 */
export function CosmosOrb({
  size = 28,
  loop = true,
  className,
  style,
  ...props
}: CosmosOrbProps) {
  return (
    <div
      role="img"
      aria-label="Loading"
      data-slot="cosmos-orb"
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <Lottie
        animationData={goldenCosmos as object}
        loop={loop}
        autoplay
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        className="size-full"
      />
    </div>
  )
}
