"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Check, Plus } from "@/components/icons"

type ChipsType = "single" | "multiple"

const ChipsContext = React.createContext<{ type?: ChipsType }>({})

type ChipsProps = React.ComponentProps<typeof ToggleGroup>

/**
 * Pill-shaped chip group built on top of `ToggleGroup`. Use `type="single"`
 * for radio-style single-select, `type="multiple"` for tag-style multi-select.
 *
 * In multi-select mode, selected chips automatically render a `Check` icon
 * to signal checkbox-like semantics (so users know they can pick more).
 */
function Chips({ className, spacing, ...props }: ChipsProps) {
  // `type` is part of ToggleGroup's discriminated union — passing through {...props}
  // (instead of destructuring) preserves the narrowing for value/onValueChange.
  return (
    <ChipsContext.Provider value={{ type: props.type as ChipsType }}>
      <ToggleGroup
        data-slot="chips"
        data-type={props.type}
        // 6px gap between chips so each one renders as its own pill
        spacing={spacing ?? 1.5}
        className={cn("flex-wrap rounded-none", className)}
        {...props}
      />
    </ChipsContext.Provider>
  )
}

type ChipsItemProps = React.ComponentProps<typeof ToggleGroupItem>

function ChipsItem({ className, children, ...props }: ChipsItemProps) {
  const { type } = React.useContext(ChipsContext)
  const isMultiple = type === "multiple"

  return (
    <ToggleGroupItem
      data-slot="chips-item"
      className={cn(
        // pill shape, soft border, comfortable hit target
        "group/chips-item h-8 rounded-full border border-border bg-transparent px-3 text-sm font-medium transition-colors",
        // hover & focus
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        // selected (data-state=on)
        "data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
        // dark-mode selected uses brand
        "dark:data-[state=on]:border-brand-300 dark:data-[state=on]:bg-brand-300/15 dark:data-[state=on]:text-brand-200",
        // multi-select chips: icon lives on the right; tighten right padding
        isMultiple && "pr-2",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {isMultiple && (
        // Stationary 14px slot on the right; Plus and Check cross-fade
        // with opposing rotations for a smooth state transition.
        <span
          aria-hidden="true"
          className="relative ml-1 inline-flex size-3.5 shrink-0 items-center justify-center"
        >
          <Plus
            className={cn(
              "absolute size-full transition-all duration-200",
              "rotate-0 opacity-100",
              "group-data-[state=on]/chips-item:rotate-90 group-data-[state=on]/chips-item:opacity-0"
            )}
          />
          <Check
            className={cn(
              "absolute size-full transition-all duration-200",
              "-rotate-90 opacity-0",
              "group-data-[state=on]/chips-item:rotate-0 group-data-[state=on]/chips-item:opacity-100"
            )}
          />
        </span>
      )}
    </ToggleGroupItem>
  )
}

export { Chips, ChipsItem }
