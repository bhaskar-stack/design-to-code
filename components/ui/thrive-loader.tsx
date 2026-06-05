"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CosmosOrb } from "@/components/ui/cosmos-orb"

const DEFAULT_MESSAGES = [
  "Analyzing your tax situation",
  "Reviewing prior returns",
  "Calculating deductions",
  "Cross-referencing IRS data",
  "Drafting your tax strategy",
]

export interface ThriveLoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Single static message. Overrides `messages` if both are provided. */
  message?: string
  /** Messages to rotate through. Default: tax-planner verbs. */
  messages?: readonly string[]
  /** Period (ms) between message rotations. Default 2400. */
  cycleMs?: number
  /** Orb size in pixels. Default 20. */
  orbSize?: number
  /** Show an elapsed-time counter like Claude Code (e.g. "3s"). Default false. */
  showElapsed?: boolean
}

function formatElapsed(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

/**
 * Branded "thinking" loader for the Tax Planner. Inspired by Claude Code's
 * inline loader: animated brand orb on the left, shimmer-cycling label,
 * optional elapsed-time counter on the right.
 */
export function ThriveLoader({
  message,
  messages = DEFAULT_MESSAGES,
  cycleMs = 2400,
  orbSize = 20,
  showElapsed = false,
  className,
  ...props
}: ThriveLoaderProps) {
  const list = message ? [message] : messages
  const [idx, setIdx] = React.useState(0)
  const [elapsed, setElapsed] = React.useState(0)

  // Rotate messages
  React.useEffect(() => {
    if (list.length <= 1) return
    const id = setInterval(
      () => setIdx((prev) => (prev + 1) % list.length),
      cycleMs
    )
    return () => clearInterval(id)
  }, [list.length, cycleMs])

  // Tick elapsed seconds
  React.useEffect(() => {
    if (!showElapsed) return
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [showElapsed])

  const current = list[idx % list.length]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 text-xs",
        className
      )}
      {...props}
    >
      <CosmosOrb size={orbSize} />

      {/* Shimmer-clipped text — uses a moving gradient as the foreground. */}
      <span
        key={current /* re-mount so the shimmer restarts on each cycle */}
        className="thrive-loader-shimmer font-medium"
        aria-label={current}
      >
        {current}
        <span aria-hidden="true">…</span>
      </span>

      {showElapsed && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          ({formatElapsed(elapsed)})
        </span>
      )}

      {/* Inline animation styles — keeps the component self-contained. */}
      <style>{`
        .thrive-loader-shimmer {
          background-image: linear-gradient(
            90deg,
            var(--muted-foreground) 0%,
            var(--muted-foreground) 30%,
            var(--brand-400) 50%,
            var(--muted-foreground) 70%,
            var(--muted-foreground) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: thrive-loader-shimmer 1.8s linear infinite;
        }
        @keyframes thrive-loader-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .thrive-loader-shimmer { animation: none; color: var(--muted-foreground); background-image: none; }
        }
      `}</style>
    </div>
  )
}
