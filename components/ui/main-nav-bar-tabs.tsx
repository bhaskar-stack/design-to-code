"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function MainNavBarTabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="main-nav-bar-tabs"
      data-orientation={orientation}
      className={cn(
        "group/main-nav-bar-tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const mainNavBarTabsListVariants = cva(
  "group/main-nav-bar-tabs-list inline-flex w-fit items-center justify-center rounded-lg text-muted-foreground group-data-vertical/main-nav-bar-tabs:flex-col",
  {
    variants: {
      variant: {
        default:
          "group-data-horizontal/main-nav-bar-tabs:h-8 group-data-vertical/main-nav-bar-tabs:h-fit gap-1 bg-muted p-[3px] [--tab-underline-offset:-5px] [--tab-underline-thickness:2px]",
        line:
          "gap-5 border border-border bg-card px-3 py-2.5 shadow-[inset_0.5px_0_2px_rgba(15,15,15,0.04),inset_0_0.5px_2px_rgba(15,15,15,0.04)] dark:border-gray-dark-700 dark:bg-gray-dark-900 dark:shadow-[inset_0.5px_0_2px_#09090b,inset_0_0.5px_2px_#09090b] [--tab-underline-offset:-11px] [--tab-underline-thickness:1px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function MainNavBarTabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof mainNavBarTabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="main-nav-bar-tabs-list"
      data-variant={variant}
      className={cn(mainNavBarTabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function MainNavBarTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="main-nav-bar-tabs-trigger"
      className={cn(
        // base layout
        "relative inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none",
        // vertical orientation
        "group-data-vertical/main-nav-bar-tabs:w-full group-data-vertical/main-nav-bar-tabs:justify-start",
        // hover, focus, disabled
        "hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        // icon padding tweaks
        "has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1",
        // dark-mode default & hover colors
        "dark:text-muted-foreground dark:hover:text-brand-400",
        // svg defaults
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // default variant — fills the list pill, equal-width, internal padding
        "group-data-[variant=default]/main-nav-bar-tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/main-nav-bar-tabs-list:flex-1 group-data-[variant=default]/main-nav-bar-tabs-list:px-1.5 group-data-[variant=default]/main-nav-bar-tabs-list:py-0.5",
        "group-data-[variant=default]/main-nav-bar-tabs-list:data-active:shadow-sm",
        // line variant — content-sized, no internal padding (the list provides spacing)
        "group-data-[variant=line]/main-nav-bar-tabs-list:flex-none group-data-[variant=line]/main-nav-bar-tabs-list:bg-transparent group-data-[variant=line]/main-nav-bar-tabs-list:data-active:bg-transparent group-data-[variant=line]/main-nav-bar-tabs-list:data-active:shadow-none",
        "dark:group-data-[variant=line]/main-nav-bar-tabs-list:data-active:border-transparent dark:group-data-[variant=line]/main-nav-bar-tabs-list:data-active:bg-transparent",
        // active text + bg
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-brand-300",
        // active underline indicator (uses --tab-underline-offset set by the list variant)
        // no opacity transition — prevents double-underline flicker when switching tabs
        "after:absolute after:bg-foreground after:opacity-0",
        "group-data-horizontal/main-nav-bar-tabs:after:inset-x-0 group-data-horizontal/main-nav-bar-tabs:after:bottom-[var(--tab-underline-offset,-5px)] group-data-horizontal/main-nav-bar-tabs:after:h-[var(--tab-underline-thickness,2px)]",
        "group-data-vertical/main-nav-bar-tabs:after:inset-y-0 group-data-vertical/main-nav-bar-tabs:after:-right-1 group-data-vertical/main-nav-bar-tabs:after:w-0.5",
        "group-data-[variant=line]/main-nav-bar-tabs-list:data-active:after:opacity-100",
        "dark:data-active:after:bg-transparent dark:data-active:after:bg-[image:var(--gradient-tab-underline-active)]",
        className
      )}
      {...props}
    />
  )
}

function MainNavBarTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="main-nav-bar-tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  MainNavBarTabs,
  MainNavBarTabsList,
  MainNavBarTabsTrigger,
  MainNavBarTabsContent,
  mainNavBarTabsListVariants,
}
