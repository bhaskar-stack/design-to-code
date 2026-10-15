"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

function SideNavBarTabs({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="side-nav-bar-tabs"
      orientation={orientation}
      className={cn(
        "group/side-nav-bar-tabs flex gap-4",
        className
      )}
      {...props}
    />
  )
}

// True once the list's sliding indicator has measured and is drawing the selected pill
const SlideReadyContext = React.createContext(false)

function SideNavBarTabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "secondary"
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [animate, setAnimate] = React.useState(false)

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-slot="side-nav-bar-tabs-trigger"][data-state="active"]')
      // Skip while hidden (e.g. an inactive main tab) so it doesn't slide in from 0 when shown
      if (!active || !active.offsetParent) return
      setBox({ x: active.offsetLeft, y: active.offsetTop, w: active.offsetWidth, h: active.offsetHeight })
    }
    measure()
    // Place it without animating, then slide on every later change
    const frame = requestAnimationFrame(() => setAnimate(true))
    const mutations = new MutationObserver(measure)
    mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"] })
    const resize = new ResizeObserver(measure)
    resize.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      resize.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="side-nav-bar-tabs-list"
      data-variant={variant}
      className={cn(
        "group/side-nav-bar-tabs-list relative flex w-[280px] flex-col py-3",
        className
      )}
      {...props}
    >
      {box && (
        <div
          aria-hidden
          data-slot="side-nav-bar-tabs-indicator"
          className={cn(
            "pointer-events-none absolute left-0 top-0 rounded-lg border",
            // default variant (golden bar) — light mode uses the Gray Light · Neutral Linear 01 gradient
            "group-data-[variant=default]/side-nav-bar-tabs-list:bg-[image:var(--gradient-gray-neutral-01)]",
            "group-data-[variant=default]/side-nav-bar-tabs-list:border-border",
            "dark:group-data-[variant=default]/side-nav-bar-tabs-list:bg-none",
            "dark:group-data-[variant=default]/side-nav-bar-tabs-list:bg-gray-dark-900",
            "dark:group-data-[variant=default]/side-nav-bar-tabs-list:border-gray-dark-700",
            "dark:group-data-[variant=default]/side-nav-bar-tabs-list:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),inset_0_2px_2px_0_rgba(255,255,255,0.2)]",
            // secondary variant (white bar) — softer pill
            "group-data-[variant=secondary]/side-nav-bar-tabs-list:border-transparent",
            "group-data-[variant=secondary]/side-nav-bar-tabs-list:bg-muted",
            "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:bg-gray-dark-700",
            // left edge bar (2×24, rounded-r-lg, at the column edge)
            "before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:rounded-r-lg",
            "group-data-[variant=default]/side-nav-bar-tabs-list:before:bg-brand-400",
            "dark:group-data-[variant=default]/side-nav-bar-tabs-list:before:shadow-[0_0_8px_var(--brand-400)]",
            "group-data-[variant=secondary]/side-nav-bar-tabs-list:before:bg-foreground",
            "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:before:bg-white",
            "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:before:shadow-[0_0_8px_white]",
            animate && "transition-[transform,width,height] duration-200 ease-out"
          )}
          style={{ transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h }}
        />
      )}
      <SlideReadyContext.Provider value={box !== null}>{children}</SlideReadyContext.Provider>
    </TabsPrimitive.List>
  )
}

function SideNavBarTabsTrigger({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  icon?: IconSvgElement
}) {
  const slideReady = React.useContext(SlideReadyContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="side-nav-bar-tabs-trigger"
      className={cn(
        // base layout — 36px rows, 12px apart, with 12px horizontal margin (= 280px column)
        "relative z-[1] mx-3 my-1.5 flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm whitespace-nowrap outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "[&_svg]:size-5 [&_svg]:shrink-0",
        // default state — muted text/icon
        "text-muted-foreground dark:text-gray-dark-400",
        // hover — soft pill background
        "hover:bg-muted/60 dark:hover:bg-gray-dark-800",
        // active — common typographic emphasis
        "data-[state=active]:font-medium",
        // once the list's sliding indicator draws the pill, the active trigger is just text on top of it
        slideReady && "data-[state=active]:bg-transparent! data-[state=active]:bg-none! data-[state=active]:border-transparent! data-[state=active]:shadow-none! data-[state=active]:before:bg-transparent! data-[state=active]:before:shadow-none!",
        // active for default variant (golden indicator) — primary-active pill
        // light mode uses the Gray Light · Neutral Linear 01 gradient; dark mode override below clears it
        "group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:bg-[image:var(--gradient-gray-neutral-01)]",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:bg-none",
        "group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:border-border",
        "group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:text-foreground",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:bg-gray-dark-900",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:border-gray-dark-700",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:text-white",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),inset_0_2px_2px_0_rgba(255,255,255,0.2)]",
        // active for secondary variant (white indicator) — softer pill
        "group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:bg-muted",
        "group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:text-foreground",
        "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:bg-gray-dark-700",
        "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:text-white",
        // left edge indicator (4×24, rounded-r-lg, positioned at the column edge)
        "before:pointer-events-none before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:rounded-r-lg before:bg-transparent before:transition-colors",
        // active default — golden bar (glow only in dark mode)
        "group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:before:bg-brand-400",
        "dark:group-data-[variant=default]/side-nav-bar-tabs-list:data-[state=active]:before:shadow-[0_0_8px_var(--brand-400)]",
        // active secondary — white/foreground bar (glow only in dark mode)
        "group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:before:bg-foreground",
        "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:before:bg-white",
        "dark:group-data-[variant=secondary]/side-nav-bar-tabs-list:data-[state=active]:before:shadow-[0_0_8px_white]",
        className
      )}
      {...props}
    >
      {icon && <HugeiconsIcon icon={icon} strokeWidth={1.5} />}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function SideNavBarTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="side-nav-bar-tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export {
  SideNavBarTabs,
  SideNavBarTabsList,
  SideNavBarTabsTrigger,
  SideNavBarTabsContent,
}
