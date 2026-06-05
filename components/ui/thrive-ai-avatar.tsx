import * as React from "react"

import { cn } from "@/lib/utils"
import { ThriveLogoMark } from "@/components/ui/thrive-orb"

export interface ThriveAIAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter in pixels. Default 24. */
  size?: number
}

/**
 * Static avatar shown next to AI-generated answers.
 *
 * - No animation (no rotation, no shimmer) so it doesn't pull attention from
 *   the answer text users are reading.
 * - Uses our brand-primary 700→500 gold gradient (45deg) — same gradient
 *   already in our design tokens, so the avatar reads as on-brand in both
 *   light and dark modes without special-casing the theme.
 * - Subtle inner highlight + outer ring give a "polished coin" feel.
 * - Elephant mark inside, brand-950 with a soft white halo for legibility.
 */
export function ThriveAIAvatar({
  size = 24,
  className,
  style,
  ...props
}: ThriveAIAvatarProps) {
  return (
    <div
      role="img"
      aria-label="Thrive AI"
      data-slot="thrive-ai-avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        className
      )}
      style={{
        width: size,
        height: size,
        // Brand-primary 700→500 (45deg) — picked from our gradient library
        backgroundImage: "var(--gradient-brand-primary-700-500-45)",
        // Polished-coin treatment: outer hairline + inner top highlight +
        // inner bottom shadow for spherical depth. Same in both modes.
        boxShadow: [
          // outer hairline ring
          "0 0 0 1px rgba(44,35,28,0.2)",
          // soft top highlight (light catching the surface)
          "inset 0 1px 1px 0 rgba(255,255,255,0.35)",
          // soft bottom rim shadow
          "inset 0 -1px 2px 0 rgba(44,35,28,0.25)",
        ].join(", "),
        ...style,
      }}
      {...props}
    >
      <ThriveLogoMark
        className="text-white"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          // Subtle dark drop-shadow lifts the white mark off the gold so it
          // doesn't look pasted-on at small sizes.
          filter: "drop-shadow(0 0.5px 1px rgba(44,35,28,0.45))",
        }}
      />
    </div>
  )
}
