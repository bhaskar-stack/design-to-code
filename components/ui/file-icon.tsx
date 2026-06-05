import * as React from "react"

import { cn } from "@/lib/utils"

export type FileIconType =
  | "pdf"
  | "png"
  | "jpg"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "zip"
  | "mp4"
  | "audio"

type FileTypeConfig = {
  /** Main file body color */
  body: string
  /** Folded-corner accent (slightly darker than body) */
  fold: string
  /** Label-pill background (deepest shade) */
  pill: string
  /** Text label shown inside the pill */
  label: string
}

const FILE_TYPE_CONFIG: Record<FileIconType, FileTypeConfig> = {
  pdf: { body: "#DC2626", fold: "#991B1B", pill: "#7F1D1D", label: "PDF" },
  png: { body: "#8B5CF6", fold: "#6D28D9", pill: "#5B21B6", label: "PNG" },
  jpg: { body: "#F59E0B", fold: "#D97706", pill: "#B45309", label: "JPG" },
  doc: { body: "#3B82F6", fold: "#2563EB", pill: "#1D4ED8", label: "DOC" },
  docx: { body: "#1D4ED8", fold: "#1E40AF", pill: "#1E3A8A", label: "DOCX" },
  xls: { body: "#22C55E", fold: "#16A34A", pill: "#15803D", label: "XLS" },
  xlsx: { body: "#16A34A", fold: "#15803D", pill: "#166534", label: "XLSX" },
  zip: { body: "#64748B", fold: "#475569", pill: "#334155", label: "ZIP" },
  mp4: { body: "#06B6D4", fold: "#0891B2", pill: "#0E7490", label: "MP4" },
  audio: { body: "#EC4899", fold: "#DB2777", pill: "#9D174D", label: "AUDIO" },
}

export interface FileIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "type"> {
  type: FileIconType
  size?: number | string
  /** Hide the label pill (useful at very small sizes). Default: true. */
  showLabel?: boolean
}

export function FileIcon({
  type,
  size = 32,
  showLabel = true,
  className,
  ...props
}: FileIconProps) {
  const config = FILE_TYPE_CONFIG[type]

  // Pill width grows slightly with longer labels
  const pillWidth = 9 + config.label.length * 2.2
  const pillX = 2
  const pillY = 17
  const pillH = 7

  // Font size shrinks slightly for longer labels so they fit
  const fontSize =
    config.label.length <= 3 ? 4.6 : config.label.length === 4 ? 4 : 3.5

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${config.label} file`}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* File body — rounded rectangle with folded top-right corner */}
      <path
        d="M7 2 H20 L27 9 V26 Q27 28 25 28 H7 Q5 28 5 26 V4 Q5 2 7 2 Z"
        fill={config.body}
      />

      {/* Folded corner triangle (slightly darker than body) */}
      <path
        d="M20 2 L27 9 H22 Q20 9 20 7 Z"
        fill={config.fold}
      />

      {/* Subtle top-left highlight strip for dimension */}
      <path
        d="M7 2 Q5 2 5 4 V8 H6 V4 Q6 3 7 3 H10 V2 H7 Z"
        fill="white"
        fillOpacity="0.18"
      />

      {/* Label pill */}
      {showLabel && (
        <>
          <rect
            x={pillX}
            y={pillY}
            width={pillWidth}
            height={pillH}
            rx={pillH / 2}
            fill={config.pill}
          />
          <text
            x={pillX + pillWidth / 2}
            y={pillY + pillH / 2}
            fontSize={fontSize}
            fontWeight="700"
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Manrope, Inter, ui-sans-serif, system-ui, sans-serif"
            letterSpacing="0.2"
          >
            {config.label}
          </text>
        </>
      )}
    </svg>
  )
}

export const FILE_ICON_TYPES = Object.keys(FILE_TYPE_CONFIG) as FileIconType[]
