// URL scheme for the Thrive AI demo. Each top-level tab and sub-tab gets its own
// path so it can be shared, e.g. /thrive-ai/tax-planning/advance-payments/.
// The first section of each tab is its default and is left out of the URL.

export const THRIVE_TABS = {
  planning: { slug: "tax-planning", sections: ["tax-plan", "w4-estimator", "advance-payments"] },
  filing: { slug: "tax-filing", sections: ["2026", "2025", "2024"] },
  documents: { slug: "documents", sections: ["2026", "2025", "2024"] },
} as const

export type ThriveTab = "home" | keyof typeof THRIVE_TABS
export type ThriveRoute = { tab: ThriveTab; section: string }

const ROOT = "/thrive-ai"

const tabEntries = Object.entries(THRIVE_TABS) as [keyof typeof THRIVE_TABS, (typeof THRIVE_TABS)[keyof typeof THRIVE_TABS]][]

export function defaultSection(tab: ThriveTab): string {
  return tab === "home" ? "" : THRIVE_TABS[tab].sections[0]
}

// Pathname comes from usePathname(), so it never includes the GitHub Pages basePath.
export function parseThrivePath(pathname: string): ThriveRoute {
  const parts = pathname.split("/").filter(Boolean)
  const [tabSlug, sectionSlug] = parts[0] === ROOT.slice(1) ? parts.slice(1) : parts
  const match = tabEntries.find(([, t]) => t.slug === tabSlug)
  if (!match) return { tab: "home", section: "" }
  const [tab, def] = match
  const section = (def.sections as readonly string[]).includes(sectionSlug) ? sectionSlug : def.sections[0]
  return { tab, section }
}

export function thrivePath(tab: ThriveTab, section?: string): string {
  if (tab === "home") return `${ROOT}/`
  const def = THRIVE_TABS[tab]
  return !section || section === def.sections[0] ? `${ROOT}/${def.slug}/` : `${ROOT}/${def.slug}/${section}/`
}

// Every non-home path, for generateStaticParams in app/thrive-ai/[...slug].
export function thriveStaticParams(): { slug: string[] }[] {
  return tabEntries.flatMap(([, t]) => [
    { slug: [t.slug] },
    ...t.sections.map(s => ({ slug: [t.slug, s] })),
  ])
}
