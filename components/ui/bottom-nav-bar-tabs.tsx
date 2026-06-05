"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

/**
 * Mobile-first bottom tab bar built on Radix Tabs. Same API shape as
 * `MainNavBarTabs` so navigation items are interchangeable between the
 * desktop top-bar and the mobile bottom-bar pattern.
 */
function BottomNavBarTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="bottom-nav-bar-tabs"
      className={cn(
        "group/bottom-nav-bar-tabs flex h-full flex-col",
        className
      )}
      {...props}
    />
  )
}

function BottomNavBarTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="bottom-nav-bar-tabs-list"
      className={cn(
        // Bottom-bar shell — fixed 328px width, 8px padding all sides,
        // 12px rounded corners, full border (it floats, not edge-to-edge),
        // 5 fixed-width items spread via justify-between.
        "relative flex w-[328px] items-stretch justify-between rounded-[12px] border border-border bg-card p-2",
        "dark:border-gray-dark-700 dark:bg-gray-dark-900",
        // Subtle inset shadow for depth (stronger in dark mode)
        "shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.04)]",
        "dark:shadow-[inset_0.5px_0_2px_#09090b,inset_0_0.5px_2px_#09090b]",
        className
      )}
      {...props}
    />
  )
}

function BottomNavBarTabsTrigger({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  icon?: IconSvgElement
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="bottom-nav-bar-tabs-trigger"
      className={cn(
        // Stack icon over label, centered. Fixed 60px width per item.
        "relative flex w-[60px] shrink-0 flex-col items-center justify-center gap-1 px-1 py-0.5 text-[10px] leading-3 font-normal whitespace-nowrap outline-none transition-colors",
        // Default colors
        "text-muted-foreground dark:text-gray-dark-500",
        // Active — golden in dark, foreground in light, slightly bolder
        "data-[state=active]:font-medium data-[state=active]:text-foreground",
        "dark:data-[state=active]:text-brand-300",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // Bottom indicator (the small accent line at the bar's bottom edge,
        // visible only when active). Reuses the same gold gradient as the
        // top-nav underline so the two patterns feel like a system.
        "after:pointer-events-none after:absolute after:bottom-[-8px] after:left-1/2 after:h-0.5 after:w-9 after:-translate-x-1/2 after:rounded-full after:bg-foreground after:opacity-0",
        "data-[state=active]:after:opacity-100",
        "dark:data-[state=active]:after:bg-transparent dark:data-[state=active]:after:bg-[image:var(--gradient-tab-underline-active)]",
        // Icon defaults
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {icon && <HugeiconsIcon icon={icon} strokeWidth={2} />}
      {children}
    </TabsPrimitive.Trigger>
  )
}

function BottomNavBarTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="bottom-nav-bar-tabs-content"
      className={cn("flex-1 overflow-y-auto outline-none", className)}
      {...props}
    />
  )
}

export {
  BottomNavBarTabs,
  BottomNavBarTabsList,
  BottomNavBarTabsTrigger,
  BottomNavBarTabsContent,
}
