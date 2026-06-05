"use client"

import React, { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ThriveLoader } from "@/components/ui/thrive-loader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { FileIcon, type FileIconType } from "@/components/ui/file-icon"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { PromptInput } from "@/components/ui/prompt-input"
import {
  MainNavBarTabs,
  MainNavBarTabsList,
  MainNavBarTabsTrigger,
  MainNavBarTabsContent,
} from "@/components/ui/main-nav-bar-tabs"
import {
  SideNavBarTabs,
  SideNavBarTabsList,
  SideNavBarTabsTrigger,
  SideNavBarTabsContent,
} from "@/components/ui/side-nav-bar-tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  AiBrowserIcon,
  AiFileIcon,
  ArtificialIntelligence08Icon,
} from "@hugeicons/core-free-icons"
import {
  Bell,
  Info,
  FileText,
  User,
  LogOut,
  ArrowUp,
  ArrowRight,
  Check,
  CheckmarkCircle,
  Download,
  ImageUpload,
  User03,
  Upload,
  Plus,
  X,
  Pencil,
  Paperclip,
  Trash,
  ChevronRight,
  MessageQuestion,
  UnfoldMore,
  HelpSquare,
  UserAccount,
  UserCircle,
  Clock,
  CoinsDollar,
  PanelLeftOpen,
  SecurityLock,
  Calendar,
  Tick01,
} from "@/components/icons"

// ── tiny primitives ─────────────────────────────────────────────────────────
function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] uppercase tracking-[1.4px] text-muted-foreground font-medium", className)}>
      {children}
    </div>
  )
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-card text-foreground/80 border-border",
    gold: "bg-brand-500/15 text-brand-400 border-transparent",
    good: "bg-emerald-50 text-emerald-700 border-transparent",
    warn: "bg-amber-50 text-amber-700 border-transparent",
    lock: "bg-muted text-muted-foreground border-border",
  }
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.8px] px-2 py-1 rounded font-medium",
      toneClasses[tone] || toneClasses.neutral
    )}>
      {children}
    </span>
  )
}

function Chip({ children, onClick, primary, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={primary ? "default" : "outline"}
      size="sm"
      className="rounded-full"
    >
      {children}
    </Button>
  )
}

function getFileIconType(filename: string): FileIconType {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, FileIconType> = { pdf: "pdf", png: "png", jpg: "jpg", jpeg: "jpg", doc: "doc", docx: "docx", xls: "xls", xlsx: "xlsx", zip: "zip", mp4: "mp4" }
  return map[ext] ?? "pdf"
}

function SlidingTabsList({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector('[data-state="active"]') as HTMLElement | null
    if (!active) return
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
  }, [value])

  return (
    <TabsList ref={listRef} className={cn("relative gap-1", className)}>
      <div
        className="absolute top-[2px] bottom-[2px] rounded-md bg-background transition-all duration-200 ease-out shadow-sm dark:bg-gray-dark-950"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {children}
    </TabsList>
  )
}

// ── data ────────────────────────────────────────────────────────────────────
const STRATEGIES = [
  {
    id: "s1", title: "Maximize 401(k) Contributions", cat: "Retirement",
    desc: "Increase pre-tax contributions to lower taxable income.",
    savings: 3200, tier: "self-serve", complexity: "Low",
    personalized: true,
    tags: ["Annual recurring", "Easy to implement"],
  },
  {
    id: "s2", title: "HSA Contributions", cat: "Health",
    desc: "Triple tax-advantaged account for medical expenses.",
    savings: 1100, tier: "self-serve", complexity: "Low",
    personalized: true,
    tags: ["Annual recurring", "Easy to implement"],
  },
  {
    id: "s3", title: "Charitable Bunching (DAF)", cat: "Giving",
    desc: "Bunch donations into a Donor-Advised Fund to clear the standard deduction.",
    savings: 600, tier: "self-serve", complexity: "Low",
    personalized: true,
    tags: ["One-time setup", "Long-term benefits"],
  },
  {
    id: "s4", title: "RSU Sell Timing & 83(b)", cat: "Equity",
    desc: "Time vesting and sales across calendar years to manage AMT and brackets.",
    savings: null, tier: "complex", complexity: "High",
    complexReason: "Sensitive to your Tech Corp vest schedule and CA marginal rate. I'll model scenarios, but you'll review and decide.",
    personalized: true,
    tags: ["Time-sensitive", "Long-term benefits"],
  },
  {
    id: "s5", title: "PFIC review on Indian mutual funds", cat: "Cross-border",
    desc: "Foreign mutual funds trigger PFIC; election choice has multi-year consequences.",
    savings: null, tier: "complex", complexity: "High",
    complexReason: "Election decisions (QEF / mark-to-market) are irreversible. I'll surface tradeoffs before you commit to one.",
    personalized: true,
    tags: ["Cross-border", "Requires documents"],
  },
  {
    id: "s6", title: "California PTE Election", cat: "State",
    desc: "Pass-through entity election to deduct state tax above the SALT cap.",
    savings: 4200, tier: "self-serve", complexity: "Medium",
    personalized: true,
    tags: ["Time-sensitive", "High savings potential"],
  },
  {
    id: "lib1", title: "Solo 401(k)", cat: "Retirement",
    desc: "Higher contribution limits for self-employed and 1099 income.",
    savings: null, tier: "self-serve", complexity: "Medium",
    personalized: false,
    notApplicableReason: "You don't have 1099 / self-employment income on your 2026 return.",
    tags: ["Annual recurring", "High savings potential"],
  },
  {
    id: "lib2", title: "Real Estate Professional Status", cat: "Real Estate",
    desc: "Treat rental losses as non-passive to offset ordinary income (750-hour rule).",
    savings: null, tier: "complex", complexity: "High",
    personalized: false,
    notApplicableReason: "Requires material participation in real estate (750+ hrs/yr).",
    tags: ["Long-term benefits", "Requires documents"],
  },
  {
    id: "lib3", title: "Qualified Small Business Stock (QSBS §1202)", cat: "Equity",
    desc: "Exclude up to $10M in gains on qualifying startup stock held 5+ years.",
    savings: null, tier: "complex", complexity: "High",
    personalized: false,
    notApplicableReason: "Your equity is Tech Corp RSUs, not QSBS-eligible founder stock.",
    tags: ["Long-term benefits", "High savings potential"],
  },
  {
    id: "lib4", title: "Defined Benefit Pension Plan", cat: "Retirement",
    desc: "Cash-balance plan for high-income business owners — six-figure deductions.",
    savings: null, tier: "self-serve", complexity: "High",
    personalized: false,
    notApplicableReason: "Requires self-employment income or owning a small business.",
    tags: ["Annual recurring", "High savings potential"],
  },
  {
    id: "lib5", title: "Opportunity Zone Investing", cat: "Investments",
    desc: "Defer capital gains by reinvesting in qualified opportunity funds.",
    savings: null, tier: "complex", complexity: "Medium",
    personalized: false,
    notApplicableReason: "No realized capital gains on your current return.",
    tags: ["Long-term benefits", "Time-sensitive"],
  },
  {
    id: "lib6", title: "S-Corp Election", cat: "Business",
    desc: "Pay yourself a reasonable salary, take rest as distributions to save SE tax.",
    savings: null, tier: "self-serve", complexity: "Medium",
    personalized: false,
    notApplicableReason: "You don't have a business entity that would benefit from S-Corp status.",
    tags: ["One-time setup", "Annual recurring"],
  },
  {
    id: "lib7", title: "Backdoor Mega Roth", cat: "Retirement",
    desc: "After-tax 401(k) contributions converted to Roth for tax-free growth.",
    savings: null, tier: "self-serve", complexity: "Medium",
    personalized: false,
    notApplicableReason: "Your employer's 401(k) plan doesn't allow after-tax contributions.",
    tags: ["Annual recurring", "Easy to implement"],
  },
] as const

type Strategy = (typeof STRATEGIES)[number]

const initialStates: Record<string, string> = {
  s1: "NOT_STARTED", s2: "NOT_STARTED", s3: "NOT_STARTED",
  s4: "NOT_STARTED", s5: "NOT_STARTED", s6: "NOT_STARTED",
  lib1: "NOT_STARTED", lib2: "NOT_STARTED", lib3: "NOT_STARTED",
  lib4: "NOT_STARTED", lib5: "NOT_STARTED", lib6: "NOT_STARTED",
  lib7: "NOT_STARTED",
}

type ActionItem = { id: string; title: string; category: string; meta: string; urgent?: boolean; time: string }

const ACTION_ITEMS: ActionItem[] = [
  { id: "a1", title: "Upload your 2026 W-2", category: "Filing", meta: "Required to file", urgent: true, time: "5 min" },
  { id: "a2", title: "Confirm dependents information", category: "Filing", meta: "Quick check", time: "2 min" },
  { id: "a3", title: "Review 401(k) contribution strategy", category: "Planning", meta: "High impact", time: "10 min" },
  { id: "a4", title: "Sign Form 8879 e-file authorization", category: "Filing", meta: "Final step", time: "1 min" },
]

const FILING_STEPS = [
  { id: "f1", label: "Personal", state: "done" },
  { id: "f2", label: "Income", state: "current" },
  { id: "f3", label: "Deductions", state: "todo" },
  { id: "f4", label: "Review", state: "todo" },
  { id: "f5", label: "E-file", state: "todo" },
]

const PRIOR_CHATS = [
  { id: "c1", title: "Backdoor Roth IRA", when: "Today" },
  { id: "c2", title: "401(k) catch-up limits", when: "Yesterday" },
  { id: "c3", title: "HSA vs FSA tradeoffs", when: "2d ago" },
  { id: "c4", title: "DAF for 2026 giving", when: "Last week" },
]

type MultiSelectOption = { id: string; label: string }
type ChatMessage = { role: string; body: string; attachment?: string; chainingPrompt?: boolean; typing?: boolean; form?: string; showUpload?: boolean; runExtraction?: boolean; showExtractionTable?: boolean; showMultiSelect?: boolean; multiSelectOptions?: MultiSelectOption[] }


function TypewriterText({ text, speed = 2, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("")
  const indexRef = useRef(0)
  const completedRef = useRef(false)

  useEffect(() => {
    indexRef.current = 0
    completedRef.current = false
    setDisplayed("")
    const interval = setInterval(() => {
      indexRef.current += 1
      if (indexRef.current >= text.length) {
        setDisplayed(text)
        clearInterval(interval)
        if (!completedRef.current) { completedRef.current = true; onComplete?.() }
      } else {
        setDisplayed(text.slice(0, indexRef.current))
      }
    }, speed)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{displayed}</>
}
type ChipAction = { id?: string; label: string; primary?: boolean }
type ChatStore = Record<string, { id: string; title: string; messages: ChatMessage[]; createdAt: number; updatedAt: number }>

// ── shell ───────────────────────────────────────────────────────────────────
function HeaderProfileMenu({ setTab }: { setTab: (t: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const hasHighlightRef = useRef(false)

  const onItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const el = highlightRef.current
    if (!container || !el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = container.getBoundingClientRect()
    const top = rect.top - parentRect.top - 6
    const height = rect.height + 12
    if (!hasHighlightRef.current) {
      hasHighlightRef.current = true
      el.style.transition = "none"
      el.style.top = `${top}px`
      el.style.height = `${height}px`
      el.style.opacity = "1"
    } else {
      el.style.transition = "all 150ms ease-out"
      el.style.top = `${top}px`
      el.style.height = `${height}px`
      el.style.opacity = "1"
    }
  }

  const clearHighlight = () => {
    const el = highlightRef.current
    if (el) {
      el.style.transition = "none"
      el.style.opacity = "0"
    }
    hasHighlightRef.current = false
  }

  const itemClass = "relative z-10 flex items-center gap-1.5 text-sm text-gray-dark-50 p-0 bg-transparent! hover:bg-transparent! focus:bg-transparent! data-highlighted:bg-transparent! cursor-default"

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) clearHighlight() }}>
      <DropdownMenuTrigger asChild>
        <div className="group relative inline-flex">
          <Button
            variant="embossed"
            size="icon-lg"
            aria-label="Profile"
          >
            <UserCircle className="size-5" />
          </Button>
          <span className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1B1B1E] px-2 py-1 text-xs font-medium leading-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">Profile</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={containerRef}
        side="bottom"
        sideOffset={8}
        align="end"
        className="bg-gray-dark-900 border-[0.5px] border-gray-dark-700 rounded-xl p-3 shadow-[0px_0px_2px_0px_rgba(134,140,152,0.2)] w-[280px] flex flex-col gap-3 overflow-visible [&_[data-slot$=-item]]:focus:bg-transparent! [&_[data-slot$=-item]]:data-highlighted:bg-transparent!"
        onMouseLeave={clearHighlight}
      >
        <div
          ref={highlightRef}
          className="absolute left-[4px] right-[4px] rounded-lg bg-gray-dark-700 cursor-default opacity-0"
        />
        <DropdownMenuItem onClick={() => setTab("profile")} className={itemClass} onMouseEnter={onItemHover} onFocus={onItemHover as unknown as React.FocusEventHandler<HTMLDivElement>}>
          <User03 className="size-4 shrink-0" />
          Profile
        </DropdownMenuItem>
        <Separator className="bg-gray-dark-700 relative z-10" />
        <DropdownMenuItem className={itemClass} onMouseEnter={onItemHover} onFocus={onItemHover as unknown as React.FocusEventHandler<HTMLDivElement>}>
          <LogOut className="size-4 shrink-0" />
          Signout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TopNav({ tab, setTab, onGoHome, activeChatId, onClickHomeTab, hasNotification = true, onNotifOpen }: {
  tab: string; setTab: (t: string) => void; onGoHome: () => void
  activeChatId: string | null; onClickHomeTab: () => void; hasNotification?: boolean; onNotifOpen?: () => void
}) {
  const inHomeChat = tab === "home" && activeChatId !== null
  const displayTab = inHomeChat ? "__none__" : tab

  return (
    <div className="relative flex items-center justify-between h-16 px-4 shrink-0 z-10">
      <div className="flex items-center gap-2.5 p-0">
        <img src="/logos/thrive-logo.svg" alt="Thrive Club" width={102} height={36} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MainNavBarTabs
          value={displayTab}
          onValueChange={(v) => {
            if (v === "home" && inHomeChat) onClickHomeTab()
            else setTab(v)
          }}
          className="pointer-events-auto"
        >
          <MainNavBarTabsList variant="line" className="relative h-9 py-1.5 [--tab-underline-offset:-7px] [&_[data-slot=main-nav-bar-tabs-trigger]]:after:hidden">
            <MainNavBarTabsTrigger value="home">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
              Home
            </MainNavBarTabsTrigger>
            <MainNavBarTabsTrigger value="planning">
              <HugeiconsIcon icon={AiBrowserIcon} strokeWidth={2} />
              Tax Planning
            </MainNavBarTabsTrigger>
            <MainNavBarTabsTrigger value="filing">
              <HugeiconsIcon icon={AiFileIcon} strokeWidth={2} />
              Tax Filing
            </MainNavBarTabsTrigger>
            <MainNavBarTabsTrigger value="documents">
              <FileText className="size-4" />
              Documents
            </MainNavBarTabsTrigger>
            <NavBarUnderline activeValue={displayTab} />
          </MainNavBarTabsList>
        </MainNavBarTabs>
      </div>

      <div className="flex gap-3 items-center">
        <div className="group relative inline-flex">
          <Button
            variant="embossed"
            size="icon-lg"
            aria-label="Notifications"
            onClick={onNotifOpen}
          >
            <Bell className="size-5" />
          </Button>
          {hasNotification && (
            <span className="pointer-events-none absolute -right-[4.5px] -top-[4.5px] size-3 rounded-full border-[1.5px] border-background bg-red-600 shadow-[0_0_4px_1px_rgba(239,68,68,0.5)] dark:border-gray-dark-950" />
          )}
          <span className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1B1B1E] px-2 py-1 text-xs font-medium leading-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">Notifications</span>
        </div>
        <div className="group relative inline-flex">
          <Button
            variant="embossed"
            size="icon-lg"
            aria-label="Get help"
          >
            <HelpSquare className="size-5" />
          </Button>
          <span className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1B1B1E] px-2 py-1 text-xs font-medium leading-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">Get help</span>
        </div>
        <HeaderProfileMenu setTab={setTab} />
      </div>
    </div>
  )
}

function NavBarUnderline({ activeValue }: { activeValue: string }) {
  const barRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const list = bar.parentElement
    if (!list) return
    const trigger = list.querySelector(`[data-slot="main-nav-bar-tabs-trigger"][data-state="active"]`) as HTMLElement | null
    if (!trigger) { bar.style.opacity = "0"; return }
    const listRect = list.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    const left = triggerRect.left - listRect.left
    const width = triggerRect.width
    if (firstRender.current) {
      firstRender.current = false
      bar.style.transition = "none"
    } else {
      bar.style.transition = "left 200ms ease-out, width 200ms ease-out"
    }
    bar.style.left = `${left}px`
    bar.style.width = `${width}px`
    bar.style.opacity = "1"
  }, [activeValue])

  return (
    <div
      ref={barRef}
      className="absolute bottom-0 h-px opacity-0 bg-foreground dark:bg-transparent dark:bg-[image:var(--gradient-tab-underline-active)]"
    />
  )
}

function SidebarUserCard({ setTab, className }: { setTab: (t: string) => void; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const hasHighlightRef = useRef(false)

  const onItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const el = highlightRef.current
    if (!container || !el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = container.getBoundingClientRect()
    const top = rect.top - parentRect.top - 6
    const height = rect.height + 12
    if (!hasHighlightRef.current) {
      hasHighlightRef.current = true
      el.style.transition = "none"
      el.style.top = `${top}px`
      el.style.height = `${height}px`
      el.style.opacity = "1"
    } else {
      el.style.transition = "all 150ms ease-out"
      el.style.top = `${top}px`
      el.style.height = `${height}px`
      el.style.opacity = "1"
    }
  }

  const clearHighlight = () => {
    const el = highlightRef.current
    if (el) {
      el.style.transition = "none"
      el.style.opacity = "0"
    }
    hasHighlightRef.current = false
  }

  const itemClass = "relative z-10 flex items-center gap-1.5 text-sm text-gray-dark-50 p-0 bg-transparent! hover:bg-transparent! focus:bg-transparent! data-highlighted:bg-transparent! cursor-default"

  return (
    <div className={cn("mt-auto", className)}>
      <DropdownMenu onOpenChange={(open) => { if (!open) clearHighlight() }}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-full flex items-center gap-1.5 rounded-lg border border-gray-dark-600 bg-gray-dark-950 p-2 cursor-pointer shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_rgba(134,140,152,0.2)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_2px_4px_3px_0px_rgba(255,255,255,0.08)]">
            <Avatar className="size-5 shrink-0">
              <AvatarFallback className="bg-brand-500/15 text-brand-400 text-[10px] font-semibold">
                KA
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm text-white text-left min-w-0 truncate">Kunal Ahuja</span>
            <UnfoldMore className="size-4 text-muted-foreground shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={containerRef}
          side="top"
          sideOffset={8}
          align="start"
          className="bg-gray-dark-900 border-[0.5px] border-gray-dark-700 rounded-xl p-3 shadow-[0px_0px_2px_0px_rgba(134,140,152,0.2)] w-[280px] flex flex-col gap-3 overflow-visible [&_[data-slot$=-item]]:focus:bg-transparent! [&_[data-slot$=-item]]:data-highlighted:bg-transparent!"
          onMouseLeave={clearHighlight}
        >
          <div
            ref={highlightRef}
            className="absolute left-[4px] right-[4px] rounded-lg bg-gray-dark-700 cursor-default opacity-0"
          />
          <DropdownMenuItem onClick={() => setTab("profile")} className={itemClass} onMouseEnter={onItemHover} onFocus={onItemHover as unknown as React.FocusEventHandler<HTMLDivElement>}>
            <User03 className="size-4 shrink-0" />
            Profile
          </DropdownMenuItem>
          <Separator className="bg-gray-dark-700 relative z-10" />
          <DropdownMenuItem className={itemClass} onMouseEnter={onItemHover} onFocus={onItemHover as unknown as React.FocusEventHandler<HTMLDivElement>}>
            <LogOut className="size-4 shrink-0" />
            Signout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── chat (one component, three contexts) ────────────────────────────────────
// ── upload / extraction components ──────────────────────────────────────────

function UploadCard({ onUpload }: { onUpload: () => void }) {
  return (
    <button
      onClick={onUpload}
      className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-dark-700 bg-gray-dark-900 px-3 outline-none transition-colors hover:border-gray-dark-500 animate-[upload-slide-in_0.4s_cubic-bezier(0.2,0.8,0.2,1)_backwards]"
    >
      <Upload className="h-4 w-4 text-gray-dark-400" />
      <span className="text-xs font-medium text-gray-dark-400">
        Click to upload Fidelity year-end statement
      </span>
    </button>
  )
}

const EXTRACTION_STAGES = [
  "Reading PDF structure",
  "Identifying account holdings",
  "Extracting dividend records",
  "Extracting transaction history",
  "Reconciling against your holdings",
  "Preparing summary",
]

function InChatExtraction() {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => {
        if (prev >= EXTRACTION_STAGES.length - 1) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-2 flex flex-col gap-[6px]">
      {EXTRACTION_STAGES.map((stage, i) => {
        const isDone = i < activeStage
        const isActive = i === activeStage
        if (i > activeStage) return null
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs animate-[upload-slide-in_0.3s_cubic-bezier(0.2,0.8,0.2,1)_backwards]",
              isDone ? "text-gray-dark-400" : "text-gray-dark-200"
            )}
          >
            {isDone ? (
              <Tick01 className="size-3.5 shrink-0 text-brand-400" />
            ) : (
              <ThriveLoader />
            )}
            <span>{stage}</span>
          </div>
        )
      })}
    </div>
  )
}

function MultiSelectCard({ options, onSubmit }: { options: MultiSelectOption[]; onSubmit: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmed, setConfirmed] = useState(false)

  const toggle = (id: string) => {
    if (confirmed) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleSubmit = (items: string[]) => {
    setConfirmed(true)
    onSubmit(items)
  }

  const letterFor = (i: number) => String.fromCharCode(65 + i)

  return (
    <div className="mt-3 rounded-lg border border-gray-dark-700 bg-gray-dark-950 overflow-hidden animate-[upload-slide-in_0.5s_cubic-bezier(0.2,0.8,0.2,1)_backwards]">
      <div className="flex items-center justify-between px-3.5 py-3">
        <span className="text-[11px] uppercase tracking-[0.06em] font-semibold text-brand-300">Select all that apply</span>
        <span className="text-[11px] text-gray-dark-400 tabular-nums">{selected.size > 0 ? `${selected.size} selected` : "none selected"}</span>
      </div>
      <div className="flex flex-col gap-1.5 px-2.5 pb-2.5">
        {options.map((opt, i) => {
          const isSel = selected.has(opt.id)
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-all duration-200 animate-[filing-item-slide-in_0.4s_ease_backwards]",
                confirmed ? "pointer-events-none" : "cursor-pointer",
                isSel ? "bg-brand-400/[0.08] border-brand-400" : "bg-gray-dark-900 border-gray-dark-700",
                !confirmed && !isSel && "hover:border-gray-dark-500"
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={cn(
                "size-6 rounded flex items-center justify-center text-[11px] font-bold tracking-[0.02em] shrink-0 transition-all duration-200",
                isSel ? "bg-brand-300 text-gray-dark-950" : "bg-gray-dark-700 text-gray-dark-100"
              )}>
                {letterFor(i)}
              </div>
              <span className={cn(
                "flex-1 text-[13.5px] leading-[1.4] transition-colors duration-200",
                isSel ? "text-white font-medium" : "text-gray-dark-100"
              )}>
                {opt.label}
              </span>
              <div className={cn(
                "size-[18px] rounded border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-200",
                isSel ? "border-brand-300 bg-brand-300" : "border-gray-dark-500 bg-transparent"
              )}>
                {isSel && (
                  <svg viewBox="0 0 16 16" width="12" height="12">
                    <path d="M3.5 8.5 L7 11.5 L12.5 5" fill="none" stroke="var(--gray-dark-950)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-end gap-2 px-3.5 py-2.5 border-t border-gray-dark-700 bg-gray-dark-900">
        {confirmed ? (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
            <Check className="size-3.5" /> Confirmed
          </span>
        ) : (
          <>
            <button
              onClick={() => handleSubmit([])}
              className="bg-transparent border-none px-3 py-2 text-[12px] font-semibold text-gray-dark-200 uppercase tracking-[0.06em] cursor-pointer hover:text-white transition-colors"
            >
              {selected.size > 0 ? "Skip" : "None Apply"}
            </button>
            <Button
              onClick={() => handleSubmit(selected.size > 0 ? options.filter(o => selected.has(o.id)).map(o => o.label) : [])}
              className="bg-brand-600 hover:bg-brand-500 text-white gap-1.5"
            >
              {selected.size > 0 ? `Done · ${selected.size}` : "Confirm"} <ArrowRight className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

const EXTRACTION_ROWS = [
  { label: "Account holder", value: "Kunal Ahuja" },
  { label: "Account number", value: "••••3847", mono: true },
  { label: "Tax year", value: "2024", mono: true },
  { label: "Ordinary dividends", value: "$8,240.00", mono: true },
  { label: "Qualified dividends", value: "$6,180.00", mono: true },
  { label: "Short-term gains", value: "$1,240.00", mono: true },
  { label: "Long-term gains", value: "$0.00", mono: true },
  { label: "Total proceeds (sales)", value: "$284,160.00", mono: true },
  { label: "Total cost basis (broker)", value: "$240,817.00", mono: true, flagged: "needs adjustment" },
]

function ExtractionTable({ onConfirm }: { onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false)
  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm()
  }
  return (
    <div className="w-full mt-3 animate-[upload-slide-in_0.4s_cubic-bezier(0.2,0.8,0.2,1)_backwards]">
      <div className="rounded-xl border border-gray-dark-700 bg-gray-dark-900 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-brand-300">
            <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] uppercase tracking-[1.2px] font-medium text-brand-300">Extracted from Fidelity_YE_2024.pdf</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {EXTRACTION_ROWS.map((row, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 animate-[extraction-row-in_0.35s_cubic-bezier(0.2,0.8,0.2,1)_backwards]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-[13px] text-muted-foreground">{row.label}</span>
              <span className={cn("h-10 w-full rounded-lg border border-gray-dark-700 bg-gray-dark-800 px-2.5 flex items-center text-sm text-white font-[Manrope]", row.mono && "font-mono")}>{row.value}</span>
              {row.flagged && (
                <span className="text-[11px] font-medium text-orange-600">{row.flagged}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          {confirmed ? (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
              <Check className="size-3.5" /> Confirmed
            </span>
          ) : (
            <Button onClick={handleConfirm} className="bg-brand-600 hover:bg-brand-500 text-white gap-1.5">
              Confirm <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatSurface({ context, messages, chips, onChip, header, sub, onClose, placeholder, flush, backLink, smallHeader, onFormConfirm, onTypingComplete, onUpload, onConfirmExtraction, onMultiSelect }: {
  context?: string; messages: ChatMessage[]; chips?: ChipAction[]
  onChip?: (c: ChipAction) => void; header?: string; sub?: string
  onClose?: (() => void) | null; placeholder?: string; flush?: boolean
  backLink?: { label: string; onClick: () => void } | null
  smallHeader?: boolean; onFormConfirm?: () => void; onTypingComplete?: () => void
  onUpload?: () => void; onConfirmExtraction?: () => void
  onMultiSelect?: (selected: string[]) => void
}) {
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialMsgKeys = useRef<Set<string>>(new Set(messages.map((m, i) => `${i}:${m.body.slice(0, 40)}`)))
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])
  useEffect(() => {
    if (!scrollRef.current) return
    const observer = new MutationObserver(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
    observer.observe(scrollRef.current, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn(
      "flex flex-col h-full bg-card",
      flush ? "border-none rounded-none" : "border border-border rounded-[10px]"
    )}>
      <div className={cn(
        "border-b border-border flex justify-between items-start",
        flush ? "px-4 pt-4 pb-4" : "px-4 py-4"
      )}>
        <div className="min-w-0 flex-1">
          {backLink ? (
            <button
              onClick={backLink.onClick}
              className="bg-transparent border-none p-0 cursor-pointer text-[11px] text-muted-foreground uppercase tracking-[1px] font-medium flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <span className="text-[13px] leading-none tracking-normal">←</span>
              {backLink.label}
            </button>
          ) : context ? (
            <Eyebrow>{context}</Eyebrow>
          ) : null}
          <div className={cn("font-medium text-foreground", smallHeader ? "text-[16px] leading-6" : "text-[18px] leading-7", context || backLink ? "mt-1" : "")}>{header}</div>
          {sub && <div className="text-[13px] text-muted-foreground mt-1">{sub}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded-md bg-gray-dark-700 p-1 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors"
          >
            <X className="size-4 text-white" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className={cn(
        "flex-1 overflow-y-auto min-h-0 flex flex-col gap-8",
        flush ? "px-4 pt-4 pb-12" : "pt-4 px-4 pb-12"
      )}>
        {messages.map((m, i) => {
          if (m.role === "thinking") {
            return (
              <div key={i} className="self-start">
                <ThriveLoader />
              </div>
            )
          }
          const msgKey = `${i}:${m.body.slice(0, 40)}`
          const shouldType = m.typing && !initialMsgKeys.current.has(msgKey)
          if (m.role === "user" && m.attachment) {
            return (
              <div key={i} className="max-w-[85%] self-end flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-gray-dark-800 border border-gray-dark-700 pl-2 pr-3 py-1.5">
                  <FileIcon type={getFileIconType(m.attachment)} size={24} />
                  <span className="text-sm font-medium leading-5 text-white">{m.attachment}</span>
                </div>
                <div className="bg-gray-dark-700 px-2 py-1.5 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm text-sm leading-[22px] text-white whitespace-pre-wrap">
                  {shouldType ? <TypewriterText text={m.body} /> : m.body}
                </div>
              </div>
            )
          }
          if (m.form === "profile-confirmation") {
            const renderBold = (text: string) => {
              const parts = text.split(/(\*\*.*?\*\*)/g)
              return parts.map((p, j) =>
                p.startsWith("**") && p.endsWith("**")
                  ? <span key={j} className="font-semibold">{p.slice(2, -2)}</span>
                  : p
              )
            }
            return (
              <div key={i} className="self-start max-w-[80%] text-sm leading-[22px] text-white whitespace-pre-wrap">
                {shouldType ? <TypewriterText text={m.body} /> : renderBold(m.body)}
                <ProfileConfirmationForm onConfirm={onFormConfirm} />
              </div>
            )
          }
          const isLastMsg = i === messages.length - 1
          return (
            <div key={i} className={cn(
              "text-sm leading-[22px] text-white whitespace-pre-wrap",
              m.role === "user"
                ? "max-w-[85%] self-end bg-gray-dark-700 px-2 py-1.5 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm"
                : "max-w-[80%] self-start"
            )}>
              {shouldType ? <TypewriterText text={m.body} onComplete={isLastMsg ? onTypingComplete : undefined} /> : m.body}
              {m.showUpload && isLastMsg && onUpload && <UploadCard onUpload={onUpload} />}
              {m.runExtraction && <InChatExtraction />}
              {m.showExtractionTable && <ExtractionTable onConfirm={onConfirmExtraction!} />}
              {m.showMultiSelect && m.multiSelectOptions && (
                <MultiSelectCard options={m.multiSelectOptions} onSubmit={onMultiSelect!} />
              )}
            </div>
          )
        })}
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-2 -mt-4">
            {chips.map((c, i) => (
              <Chip key={i} onClick={() => onChip?.(c)}>
                {c.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className={cn(
        "border-t border-border",
        flush ? "px-4 py-3.5" : "px-4 py-3"
      )}>
        <PromptInput
          variant="inline"
          value={draft}
          onValueChange={setDraft}
          onSubmit={() => setDraft("")}
          placeholder={placeholder || "Reply or ask a question…"}
        >
          <Button variant="ghost" size="icon-sm">
            <Paperclip />
          </Button>
        </PromptInput>
      </div>
    </div>
  )
}

// ── HOME tab ────────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: string
}) {
  return (
    <Card>
      <CardContent>
        <Eyebrow>{label}</Eyebrow>
        <div className={cn(
          "text-[28px] font-medium mt-2 tracking-tight",
          accent ? "text-brand-600" : "text-foreground"
        )}>
          {value}
        </div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  )
}

function TaxPlanCard({
  total, count, onGoToPlanning, hideCTA,
}: {
  total: number; count: number; onGoToPlanning?: () => void
  hideCTA?: boolean
}) {
  return (
    <div className="bg-gray-dark-800 rounded-xl p-[2px]">
    <div
      className="rounded-[10px] overflow-clip"
      style={{
        background: `
          radial-gradient(300px 200px at calc(100% + 20px) -40px, rgba(193,168,117,0.12) 0%, rgba(193,168,117,0.04) 60%, transparent 100%),
          radial-gradient(250px 180px at -30px calc(100% + 20px), rgba(193,168,117,0.06) 0%, rgba(193,168,117,0.02) 60%, transparent 100%),
          var(--color-gray-dark-900)
        `
      }}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="text-[18px] leading-[26px] font-medium text-foreground">2026 tax plan</div>
        {!hideCTA && (
          <Button variant="outline" size="default" onClick={onGoToPlanning}>
            Customize your plan <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
      <div className="px-3"><Separator className="bg-gray-dark-700" /></div>

      <div className="grid grid-cols-[1fr_1px_1fr] items-stretch px-4 py-4">
        <StatColumn label="Savings in your plan:" value={`$${total.toLocaleString()}`} />
        <div className="bg-gray-dark-700" />
        <StatColumn
          label="Strategies for you:"
          value={String(count)}
          paddingLeft
        />
      </div>
    </div>
    </div>
  )
}

function PlanningTaxPlanCard({
  total, count, active, onClick,
}: {
  total: number; count: number; active?: boolean; onClick?: () => void
}) {
  const isClickable = !!onClick && !active
  const goldenTextGradient = "linear-gradient(21deg, #8B7A4A 13%, #C9B97A 27%, #B5A468 32%, #8B7A4A 54%, #8B7A4A 78%, #A89860 87%, #8B7A4A 96%)"
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "rounded-xl overflow-clip border transition-colors",
        active ? "border-brand-400" : "border-gray-dark-700",
        isClickable && "cursor-pointer hover:border-gray-dark-600"
      )}
    >
    <div
      className="rounded-[10px] overflow-clip relative"
      style={{
        background: `
          radial-gradient(300px 200px at calc(100% + 20px) -40px, rgba(193,168,117,0.12) 0%, rgba(193,168,117,0.04) 60%, transparent 100%),
          radial-gradient(250px 180px at -30px calc(100% + 20px), rgba(193,168,117,0.06) 0%, rgba(193,168,117,0.02) 60%, transparent 100%),
          var(--color-gray-dark-950)
        `
      }}
    >
      <div className="relative z-[1] flex items-center gap-5 p-4">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="text-[14px] font-medium leading-[22px] text-white">Savings in your plan:</div>
          <div
            className="text-[32px] font-bold leading-9 tracking-tight tabular-nums bg-clip-text text-transparent"
            style={{ backgroundImage: goldenTextGradient }}
          >
            ${total.toLocaleString()}
          </div>
        </div>
        <div className="w-px h-[38px] shrink-0 bg-gray-dark-700" />
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="text-[14px] font-medium leading-[22px] text-white">Strategies for you:</div>
          <div
            className="text-[32px] font-bold leading-9 tracking-tight tabular-nums bg-clip-text text-transparent"
            style={{ backgroundImage: goldenTextGradient }}
          >
            {count}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

function StatColumn({ label, value, paddingLeft }: {
  label: string; value: string; paddingLeft?: boolean
}) {
  return (
    <div className={cn(paddingLeft && "pl-5")}>
      <div className="text-[14px] leading-[22px] text-muted-foreground mb-2">{label}</div>
      <div className="text-[28px] font-semibold text-foreground tracking-tight tabular-nums">
        {value}
      </div>
    </div>
  )
}

function daysUntilApr15() { return 12 }

function statusFor({ daysLeft, filingPercent, openItemCount }: {
  daysLeft: number; filingPercent: number; openItemCount: number
}) {
  if (openItemCount === 0) return { tone: "rest", label: "Up to date", color: "text-emerald-600" }
  if (daysLeft <= 7 && filingPercent < 80) return { tone: "urgent", label: "Time to move", color: "text-amber-600" }
  if (daysLeft <= 14 && filingPercent < 50) return { tone: "attention", label: "Stay on pace", color: "text-amber-600" }
  return { tone: "ok", label: "On track", color: "text-emerald-600" }
}

function DeadlineChip({ days }: { days: number }) {
  const isWarn = days <= 21
  return (
    <Badge variant="outline" className={cn(
      "rounded-full px-3 py-1.5 text-xs font-medium gap-2",
      isWarn && "bg-amber-50 text-amber-700 border-transparent"
    )}>
      <span className={cn(
        "size-1.5 rounded-full",
        isWarn ? "bg-amber-600" : "bg-muted-foreground"
      )} />
      {days} days to file · Apr 15
    </Badge>
  )
}

function StatusLine({ status, filingPercent }: {
  status: { tone: string; label: string; color: string }
  filingPercent: number
}) {
  const isRest = status.tone === "rest"
  return (
    <div className="flex items-center gap-3 mt-3.5">
      <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", status.color)}>
        <span className={cn("size-[7px] rounded-full", status.color.replace("text-", "bg-"))} />
        {status.label}
      </span>
      <span className="text-border">·</span>
      <span className="text-[13px] text-muted-foreground">
        {isRest
          ? "We'll let you know when something needs you"
          : `${filingPercent}% of your 2026 return is done`}
      </span>
    </div>
  )
}

function AllCaughtUp() {
  return (
    <div className="flex items-start gap-2 rounded-xl border-[0.5px] border-gray-dark-700 bg-gray-dark-900 p-3 shadow-[0px_1px_1px_rgba(8,116,67,0.08)]">
      <div className="relative size-8 shrink-0 rounded-lg bg-emerald-800 shadow-[0px_0.75px_0.75px_rgba(8,8,8,0.2),0px_3px_1.5px_rgba(8,8,8,0.08)] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0px_0.75px_0.75px_rgba(255,255,255,0.2),inset_0px_4.5px_9px_rgba(255,255,255,0.12)] after:pointer-events-none grid place-items-center">
        <Check className="size-5 text-white" />
      </div>
      <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
        <span className="text-base font-medium leading-6 text-white">
          You're all caught up for now
        </span>
        <span className="text-xs font-normal leading-4 text-gray-dark-50">
          No action needed at the moment. We will let you know if anything else is required.
        </span>
      </div>
    </div>
  )
}

function OpenActionItems({ items, onNavigate }: { items: ActionItem[]; onNavigate: (a: ActionItem) => void }) {
  const empty = items.length === 0
  return (
    <div className="bg-gray-dark-800 rounded-xl p-[2px]">
    <div
      className="rounded-[10px] overflow-clip"
      style={{
        background: `
          radial-gradient(600px 200px at 0px -42px, rgba(187,177,137,0.07) 0%, rgba(187,177,137,0.04) 50%, transparent 100%),
          radial-gradient(600px 200px at 100% 100%, rgba(187,177,137,0.05) 0%, rgba(187,177,137,0.02) 50%, transparent 100%),
          var(--color-gray-dark-900)
        `,
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[18px] leading-[26px] font-medium text-white">Action items</span>
        {!empty && (
          <span className="bg-[#57130a] text-[#fee4e2] text-xs px-1.5 py-0.5 rounded-full">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      <div className="px-3"><Separator className="bg-gray-dark-700" /></div>
      {empty ? (
        <div className="flex items-start gap-4 px-4 py-4">
          <div className="relative size-8 shrink-0 rounded-lg bg-emerald-800 shadow-[0px_0.75px_0.75px_rgba(8,8,8,0.2),0px_3px_1.5px_rgba(8,8,8,0.08)] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0px_0.75px_0.75px_rgba(255,255,255,0.2),inset_0px_4.5px_9px_rgba(255,255,255,0.12)] after:pointer-events-none grid place-items-center">
            <Check className="size-5 text-white" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <span className="text-[16px] leading-[24px] font-medium text-white">You're all caught up</span>
            <span className="text-[14px] leading-[22px] text-gray-dark-50">No action needed right now. We'll notify you when something comes up.</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {items.map((a, i) => (
            <div
              key={a.id}
              onClick={() => onNavigate(a)}
              className={cn(
                "relative flex items-center gap-8 pl-6 pr-4 py-4 cursor-pointer transition-colors hover:bg-white/[0.03]",
                i > 0 && "border-t border-gray-dark-700/50"
              )}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded bg-gray-dark-100" />
              <div className="flex-1 min-w-0 text-sm text-white truncate">
                {a.title}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-white">{a.time}</span>
                <span className="text-sm text-foreground/60">›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

function AskChip({ onClick }: { onClick: () => void }) {
  return (
    <>
      <style>{`
        @property --ask-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes ask-chip-rotate {
          to { --ask-angle: 360deg; }
        }
        .ask-chip-border {
          --ask-angle: 0deg;
          animation: ask-chip-rotate 4s linear infinite;
          background: conic-gradient(
            from var(--ask-angle),
            transparent 0%,
            transparent 35%,
            rgba(167,152,104,0.15) 40%,
            rgba(167,152,104,0.7) 50%,
            rgba(167,152,104,0.15) 60%,
            transparent 65%,
            transparent 100%
          );
        }
      `}</style>
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-dark-900 border border-gray-dark-700 hover:border-gray-dark-600 text-white text-sm font-medium cursor-pointer overflow-hidden transition-colors duration-300"
      >
        <span className="ask-chip-border absolute inset-0 rounded-full pointer-events-none" />
        <span className="absolute inset-[1px] rounded-full bg-gray-dark-900 pointer-events-none" />
        <HugeiconsIcon icon={ArtificialIntelligence08Icon} className="relative z-10 size-5" />
        <span className="relative z-10">Ask me anything</span>
      </button>
    </>
  )
}

function HomeTab({
  openAction, action, setAction, savings, completedIds, onAdvance, onComplete,
  chats, setChats, activeChatId, setActiveChatId, onGoToPlanning, onGoToFiling, setTab,
}: {
  openAction: (a: ActionItem) => void; action: ActionItem | null; setAction: (a: ActionItem | null) => void
  savings: { total: number; count: number }; completedIds: string[]
  onAdvance: (a: ActionItem) => void; onComplete: (id: string) => void
  chats: ChatStore; setChats: React.Dispatch<React.SetStateAction<ChatStore>>
  activeChatId: string | null; setActiveChatId: (id: string | null) => void
  onGoToPlanning: () => void; onGoToFiling: () => void
  setTab: (t: string) => void
}) {
  const daysLeft = daysUntilApr15()
  const filingPercent = 40
  const openItems = ACTION_ITEMS.filter(a => !completedIds.includes(a.id))
  const heroAction = openItems.find(a => a.urgent) || openItems[0]
  const restActions = openItems.filter(a => a.id !== heroAction?.id)
  const status = statusFor({ daysLeft, filingPercent, openItemCount: openItems.length })

  const [draft, setDraft] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const activeChat = activeChatId ? chats[activeChatId] : null
  const chatMsgs = activeChat?.messages || []
  const inChat = !!activeChat

  const titleFrom = (text: string) => {
    const t = text.trim().replace(/[.!?]+$/, "")
    return t.length > 50 ? t.slice(0, 50) + "…" : t
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { role: "user", body: text.trim() }
    const thinkingMsg: ChatMessage = { role: "thinking", body: "" }
    const aiResponse = "I can help with that. Let me pull up the relevant details from your 2026 return and walk you through it."

    const appendMsgs = (msgs: ChatMessage[], chatId: string | null) => {
      if (chatId && chats[chatId]) {
        setChats(prev => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            messages: [...prev[chatId].messages, ...msgs],
            updatedAt: Date.now(),
          },
        }))
      } else {
        const newId = `chat_${Date.now()}`
        const newChat = {
          id: newId,
          title: titleFrom(text),
          messages: msgs,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        setChats(prev => ({ ...prev, [newId]: newChat }))
        setActiveChatId(newId)
        return newId
      }
      return chatId
    }

    const cId = appendMsgs([userMsg, thinkingMsg], activeChatId)
    setDraft("")

    setTimeout(() => {
      setChats(prev => {
        const id = cId || Object.keys(prev).pop()!
        const chat = prev[id]
        if (!chat) return prev
        const msgs = chat.messages.filter(m => m.role !== "thinking")
        return {
          ...prev,
          [id]: { ...chat, messages: [...msgs, { role: "assistant", body: aiResponse, typing: true }], updatedAt: Date.now() },
        }
      })
    }, 1500)
  }

  const startNewChat = () => {
    setActiveChatId(null)
    setChatOpen(true)
    setDraft("")
  }

  const openChat = (chatId: string) => {
    setActiveChatId(chatId)
    setChatOpen(true)
    setDraft("")
  }

  const confirmDelete = (chatId: string) => setConfirmDeleteId(chatId)
  const cancelDelete = () => setConfirmDeleteId(null)
  const deleteChat = (chatId: string) => {
    const next = { ...chats }
    delete next[chatId]
    setChats(next)
    if (activeChatId === chatId) {
      setActiveChatId(null)
      setChatOpen(false)
    }
    setConfirmDeleteId(null)
  }

  const chatList = Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt)

  const dashboardContent = (
    <>
      <div>
        <h1 className="text-[28px] leading-10 font-medium m-0 mt-6 tracking-tight text-foreground">
          Welcome back, Kunal.
        </h1>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <OpenActionItems items={openItems} onNavigate={(a) => {
          if (a.category === "Planning") onGoToPlanning()
          else onGoToFiling()
        }} />
        <FilingProgressCard percent={filingPercent} daysLeft={daysLeft} onGoToFiling={onGoToFiling} />
        <TaxPlanCard total={savings.total} count={savings.count} onGoToPlanning={onGoToPlanning} />
      </div>
    </>
  )

  const closeChat = () => {
    setChatOpen(false)
    setActiveChatId(null)
    setDraft("")
    setHistoryOpen(false)
  }

  const [chatVisible, setChatVisible] = useState(false)
  const [chatMounted, setChatMounted] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyVisible, setHistoryVisible] = useState(false)
  const [historyMounted, setHistoryMounted] = useState(false)
  const hasHistory = chatList.length > 0

  useEffect(() => {
    if (historyOpen) {
      setHistoryMounted(true)
      const timer = setTimeout(() => setHistoryVisible(true), 20)
      return () => clearTimeout(timer)
    } else {
      setHistoryVisible(false)
      const timer = setTimeout(() => setHistoryMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [historyOpen])

  useEffect(() => {
    if (chatOpen) {
      setChatMounted(true)
      const timer = setTimeout(() => setChatVisible(true), 20)
      return () => clearTimeout(timer)
    } else {
      setChatVisible(false)
      const timer = setTimeout(() => setChatMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [chatOpen])

  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-1 overflow-y-auto pb-6 min-h-0">
          <div className="max-w-[720px] mx-auto px-6">
            {dashboardContent}
          </div>
        </div>

        {!chatOpen && (
          <div className="absolute bottom-6 right-6 z-10">
            <AskChip onClick={startNewChat} />
          </div>
        )}
      </div>

      {chatMounted && (
        <div className="fixed inset-0 z-50">
          <div
            className={cn(
              "absolute inset-0 bg-black/20 backdrop-blur-[8px] transition-opacity duration-300",
              chatVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={closeChat}
          />
          <div className={cn(
            "absolute right-4 top-4 bottom-4 w-[640px] bg-gray-dark-900 border border-gray-dark-700 rounded-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out",
            chatVisible ? "translate-x-0" : "translate-x-[calc(100%+16px)]"
          )}>
            <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
              <HomeChatStream
                messages={inChat ? chatMsgs : []}
                title={inChat ? activeChat?.title : undefined}
                onClose={closeChat}
                hasHistory={hasHistory}
                onToggleHistory={() => setHistoryOpen(o => !o)}
              />
            </div>
            <div className="px-4 pb-4 pt-3 border-t border-border">
              <PromptInput
                variant="inline"
                value={draft}
                onValueChange={setDraft}
                onSubmit={() => sendMessage(draft)}
                placeholder={inChat ? "Ask a follow-up…" : "Ask Thrive anything about your taxes…"}
              >
                <Button variant="ghost" size="icon-sm">
                  <Paperclip />
                </Button>
              </PromptInput>
            </div>

            {/* Chat history sidebar */}
            {historyMounted && (
              <>
                <div
                  className={cn(
                    "absolute inset-0 z-20 bg-black/20 backdrop-blur-[8px] rounded-2xl transition-opacity duration-300",
                    historyVisible ? "opacity-100" : "opacity-0"
                  )}
                  onClick={() => setHistoryOpen(false)}
                />
                <div className={cn(
                  "absolute left-[7px] top-[7px] bottom-[7px] w-[240px] z-30 bg-[#171717] rounded-[9px] shadow-[0_0_1.5px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-transform duration-300 ease-out",
                  historyVisible ? "translate-x-0" : "-translate-x-[calc(100%+7px)]"
                )}>
                  <div className="flex items-center justify-between px-3 pt-3 pb-2">
                    <span className="text-[13px] font-medium text-gray-dark-200">Chat history</span>
                    <button
                      onClick={() => setHistoryOpen(false)}
                      className="size-6 rounded-md bg-gray-dark-700 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors grid place-items-center"
                    >
                      <PanelLeftOpen className="size-4 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 pb-3">
                    <div className="flex flex-col gap-1">
                      {chatList.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveChatId(c.id)
                            setHistoryOpen(false)
                          }}
                          className={cn(
                            "text-left w-full px-2 py-1.5 rounded-md text-[13px] truncate cursor-pointer border-none transition-colors",
                            c.id === activeChatId
                              ? "bg-gray-dark-700 text-white"
                              : "bg-transparent text-gray-dark-200 hover:bg-gray-dark-800"
                          )}
                        >
                          {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-3 pb-3 pt-1">
                    <button
                      onClick={() => { startNewChat(); setHistoryOpen(false) }}
                      className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-md text-[13px] font-medium text-gray-dark-200 cursor-pointer border-none bg-transparent hover:bg-gray-dark-700 transition-colors"
                    >
                      <Plus className="size-4" />
                      <span>New chat</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && cancelDelete()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete this chat?</DialogTitle>
            <DialogDescription>
              "{confirmDeleteId && chats[confirmDeleteId]?.title || "this chat"}" will be removed from your history. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>Keep chat</Button>
            <Button variant="destructive" onClick={() => confirmDeleteId && deleteChat(confirmDeleteId)}>
              Delete chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HomeSidebar({ chatList, activeChatId, onOpenChat, onRequestDelete }: {
  chatList: ChatStore[keyof ChatStore][]
  activeChatId: string | null; onOpenChat: (id: string) => void; onRequestDelete: (id: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-full">
    <div className="p-3 overflow-y-auto flex flex-col gap-2 flex-1 min-h-0">
      {chatList.length === 0 ? (
        <div className="px-2.5 py-2 text-[11px] text-muted-foreground/60 leading-relaxed">
          Your chat history will appear here.
        </div>
      ) : (
        <div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 mb-2 pl-2 bg-transparent border-none cursor-pointer"
          >
            <Eyebrow>Recent</Eyebrow>
            <ChevronRight className={cn("size-3.5 text-muted-foreground transition-transform", collapsed ? "" : "rotate-90")} />
          </button>
          {!collapsed && (
            <div className="flex flex-col gap-0.5">
              {chatList.map((c) => {
                const isActive = c.id === activeChatId
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "group relative flex h-9 items-center px-2 pr-8 cursor-pointer rounded-lg transition-colors",
                      isActive
                        ? "bg-gray-dark-700 text-white font-medium before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:rounded-r-lg before:bg-white before:shadow-[0_0_8px_white]"
                        : "text-muted-foreground hover:bg-gray-dark-800"
                    )}
                    onClick={() => onOpenChat(c.id)}
                  >
                    <span className="text-sm leading-snug truncate">
                      {c.title}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRequestDelete(c.id) }}
                      title="Delete chat"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 size-[22px] rounded bg-transparent border-none text-muted-foreground cursor-pointer grid place-items-center text-sm opacity-0 group-hover:opacity-100 hover:bg-border hover:text-amber-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  )
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return "Last week"
}

function HomeChatStream({ messages, title, onClose, hasHistory, onToggleHistory }: {
  messages: ChatMessage[]; title?: string; onClose: () => void
  hasHistory?: boolean; onToggleHistory?: () => void
}) {
  const initialMsgKeys = useRef<Set<string>>(new Set(messages.map((m, i) => `${i}:${m.body.slice(0, 40)}`)))
  const prevTitle = useRef(title)
  useEffect(() => {
    if (prevTitle.current !== title) {
      initialMsgKeys.current = new Set(messages.map((m, i) => `${i}:${m.body.slice(0, 40)}`))
      prevTitle.current = title
    }
  }, [title, messages])
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-col gap-3 mb-5 pt-4 pb-3.5 border-b border-border bg-gray-dark-900">
        <div className="flex justify-between items-center">
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1 cursor-pointer border-none bg-transparent p-0"
          >
            <Clock className="size-4 text-gray-dark-200" />
            <span className="text-[14px] text-gray-dark-200">Chat history</span>
          </button>
          <button onClick={onClose} className="shrink-0 size-6 rounded-md bg-gray-dark-700 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors grid place-items-center" aria-label="Close chat">
            <X className="size-4 text-white" />
          </button>
        </div>
        <div className="text-[16px] font-medium text-white">
          {title || "New chat"}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {messages.map((m, i) => {
          if (m.role === "thinking") {
            return (
              <div key={i} className="self-start">
                <ThriveLoader />
              </div>
            )
          }
          const msgKey = `${i}:${m.body.slice(0, 40)}`
          const shouldType = m.typing && !initialMsgKeys.current.has(msgKey)
          return (
            <div key={i} className={cn(
              "text-sm leading-[22px] text-white whitespace-pre-wrap",
              m.role === "user"
                ? "max-w-[85%] self-end bg-gray-dark-700 px-2 py-1.5 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm"
                : "max-w-[80%] self-start"
            )}>
              {shouldType ? <TypewriterText text={m.body} /> : m.body}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function FilingProgressCard({ percent, daysLeft, onGoToFiling }: {
  percent: number; daysLeft?: number; onGoToFiling: () => void
}) {
  const currentIdx = FILING_STEPS.findIndex(s => s.state === "current")
  const currentStep = FILING_STEPS[currentIdx]
  const doneCount = FILING_STEPS.filter(s => s.state === "done").length

  return (
    <div className="bg-gray-dark-800 rounded-xl p-[2px]">
    <div
      className="rounded-[10px] overflow-clip"
      style={{
        background: `
          radial-gradient(300px 200px at calc(100% + 20px) -40px, rgba(193,168,117,0.12) 0%, rgba(193,168,117,0.04) 60%, transparent 100%),
          radial-gradient(250px 180px at -30px calc(100% + 20px), rgba(193,168,117,0.06) 0%, rgba(193,168,117,0.02) 60%, transparent 100%),
          var(--color-gray-dark-900)
        `
      }}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[18px] leading-[26px] font-medium text-foreground">Filing progress</span>
          {daysLeft != null && (
            <span className="bg-[#57130a] text-[#fee4e2] text-xs px-1.5 py-0.5 rounded-full">
              {daysLeft} days to file · Apr 15
            </span>
          )}
        </div>
        <Button variant="outline" size="default" onClick={onGoToFiling}>
          Continue filing <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="px-3"><Separator className="bg-gray-dark-700" /></div>
      <div className="px-4 py-4">
        <div className="flex items-baseline gap-4">
          <div className="text-[32px] font-medium text-foreground tracking-tight">{percent}%</div>
          <div className="text-[13px] text-muted-foreground">
            {doneCount} of {FILING_STEPS.length} sections complete
            {currentStep && <> · on <span className="text-brand-400 font-medium">{currentStep.label}</span></>}
          </div>
        </div>
        <Progress value={percent} className="mt-4.5 h-1.5 bg-border [&_[data-slot=progress-indicator]]:bg-brand-600" />
      </div>
    </div>
    </div>
  )
}

function ActionWorkspace({ action, queue, onAdvance, onComplete, onClose, completedIds }: {
  action: ActionItem; queue: ActionItem[]; onAdvance: (a: ActionItem) => void
  onComplete: (id: string) => void; onClose: () => void; completedIds: string[]
}) {
  const [convos, setConvos] = useState<Record<string, ChatMessage[]>>({})
  const [phase, setPhase] = useState<"working" | "completed">("working")

  const aid = action.id
  const initialMsgs: ChatMessage[] = [
    { role: "assistant", body: `Let's take care of "${action.title}". I'll guide you through it.` },
    { role: "user", body: "Sure, what do you need from me?" },
    {
      role: "assistant",
      body: action.title.includes("W-2")
        ? "Upload your W-2 PDF (or a clear photo). I'll parse it and confirm wages, withholding, and state details before we continue."
        : "I'll walk you through this. Confirm when ready and I'll handle the rest.",
    },
  ]
  const msgs = convos[aid] || initialMsgs

  useEffect(() => { setPhase("working") }, [aid])

  const pushMsgs = (arr: ChatMessage[]) => setConvos(c => ({ ...c, [aid]: [...(c[aid] || initialMsgs), ...arr] }))

  const remaining = queue.filter(a => a.id !== aid && !completedIds.includes(a.id))
  const nextAction = remaining[0]

  useEffect(() => {
    if (phase !== "completed") return
    onComplete(aid)
    const current = convos[aid] || initialMsgs
    const last = current[current.length - 1]
    if (last?.chainingPrompt) return
    const prompt: ChatMessage = nextAction
      ? { role: "assistant", body: `Done. Want to keep going? Next up is "${nextAction.title}" — about ${nextAction.time}.`, chainingPrompt: true }
      : { role: "assistant", body: "That was the last open item. You're all caught up.", chainingPrompt: true }
    setConvos(c => ({ ...c, [aid]: [...current, prompt] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const onChip = (c: ChipAction) => {
    if (phase === "working") {
      if (c.id === "upload") {
        pushMsgs([
          { role: "user", body: "Uploading.", attachment: "W2_2026.pdf" },
          { role: "thinking", body: "" },
        ])
        setTimeout(() => {
          setConvos(co => {
            const current = co[aid] || initialMsgs
            return { ...co, [aid]: [...current.filter(m => m.role !== "thinking"), { role: "assistant", body: "Got it — parsing now. Wages, withholding, and state details all confirmed.", typing: true }, { role: "assistant", body: "Marking this complete.", typing: true }] }
          })
          setPhase("completed")
        }, 1500)
      } else if (c.id === "confirm") {
        pushMsgs([
          { role: "user", body: "Confirmed." },
          { role: "thinking", body: "" },
        ])
        setTimeout(() => {
          setConvos(co => {
            const current = co[aid] || initialMsgs
            return { ...co, [aid]: [...current.filter(m => m.role !== "thinking"), { role: "assistant", body: "Recorded. Marking this complete.", typing: true }] }
          })
          setPhase("completed")
        }, 1500)
      } else if (c.id === "skip") {
        pushMsgs([{ role: "user", body: "Skip for now." }])
      } else if (c.id === "ask") {
        pushMsgs([
          { role: "user", body: "What if I don't have it?" },
          { role: "thinking", body: "" },
        ])
        setTimeout(() => {
          setConvos(co => {
            const current = co[aid] || initialMsgs
            return { ...co, [aid]: [...current.filter(m => m.role !== "thinking"), { role: "assistant", body: "No problem — I can request a transcript from the IRS or you can come back to this when your employer sends it. Want me to do either?", typing: true }] }
          })
        }, 1500)
      }
    } else if (phase === "completed") {
      if (c.id === "next" && nextAction) onAdvance(nextAction)
      else if (c.id === "later" || c.id === "finish") onClose()
    }
  }

  const totalCount = queue.length
  const completedSoFar = completedIds.length + (phase === "completed" ? 1 : 0)
  const positionLabel = `${completedSoFar} of ${totalCount} complete`

  const chips: ChipAction[] = phase === "working"
    ? [
        { id: action.title.includes("W-2") ? "upload" : "confirm", label: action.title.includes("W-2") ? "Upload W-2" : "Confirm and continue", primary: true },
        { id: "skip", label: "Skip for now" },
        { id: "ask", label: "I have a question" },
      ]
    : nextAction
    ? [
        { id: "next", label: `Yes — ${nextAction.title}`, primary: true },
        { id: "later", label: "I'll come back later" },
      ]
    : [{ id: "finish", label: "Close workspace", primary: true }]

  return (
    <ChatSurface
      header={action.title}
      sub={action.meta}
      messages={msgs}
      chips={chips}
      onChip={onChip}
      onClose={onClose}
    />
  )
}

// ── PLANNING tab ────────────────────────────────────────────────────────────
function StrategyRow({ s, state, selected, onClick }: {
  s: Strategy; state: string; selected: boolean; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-5 py-4 border-b border-border cursor-pointer transition-colors flex items-center gap-4",
        selected ? "bg-gray-dark-950" : "hover:bg-muted/50"
      )}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-foreground truncate">{s.title}</span>
        {(s.tags || []).map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-full text-[11px] font-normal">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="text-right shrink-0">
        {s.tier === "complex" ? (
          <div className="text-[13px] text-brand-400 font-medium">
            {s.personalized ? "Modeled in chat" : "Not for you"}
          </div>
        ) : s.savings != null ? (
          <div className="text-base font-medium text-foreground tabular-nums">
            ${s.savings.toLocaleString()}
          </div>
        ) : (
          <div className="text-[13px] text-muted-foreground">Not for you</div>
        )}
      </div>
    </div>
  )
}

function impactBucket(s: Strategy) {
  if (s.savings == null) return "none"
  if (s.savings >= 3000) return "high"
  if (s.savings >= 1000) return "medium"
  if (s.savings > 0) return "low"
  return "none"
}

function PlanningTab({ states, setStates, setTab }: {
  states: Record<string, string>; setStates: (s: Record<string, string>) => void
  setTab: (t: string) => void
}) {
  const [section, setSection] = useState("plan")

  return (
    <SideNavBarTabs
      value={section}
      onValueChange={setSection}
      className="h-full overflow-hidden gap-0"
    >
      <SideNavBarTabsList variant="default" className="w-[220px] [&_svg]:hidden">
        <SideNavBarTabsTrigger value="plan">2026 Tax Plan</SideNavBarTabsTrigger>
        <SideNavBarTabsTrigger value="w4">W-4 Estimator</SideNavBarTabsTrigger>
      </SideNavBarTabsList>
      <SideNavBarTabsContent value="plan" className="flex min-h-0 overflow-hidden rounded-tl-xl border-t border-l border-gray-dark-700 bg-gray-dark-900">
        <TaxPlanView states={states} setStates={setStates} />
      </SideNavBarTabsContent>
      <SideNavBarTabsContent value="w4" className="flex min-h-0 overflow-hidden rounded-tl-xl border-t border-l border-gray-dark-700 bg-gray-dark-900">
        <W4EstimatorView />
      </SideNavBarTabsContent>
    </SideNavBarTabs>
  )
}

function StrategyFilter({ filters, setFilters }: {
  filters: { impact: string[]; effort: string[] }
  setFilters: (f: { impact: string[]; effort: string[] }) => void
}) {
  const activeCount = filters.impact.length + filters.effort.length
  const isActive = activeCount > 0

  const toggle = (group: "impact" | "effort", value: string) => {
    const current = filters[group]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setFilters({ ...filters, [group]: next })
  }

  const clear = () => setFilters({ impact: [], effort: [] })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={isActive ? "secondary" : "outline"} size="sm" className="gap-2">
          Filter
          {isActive && (
            <Badge className="bg-brand-600 text-white px-1.5 min-w-[18px] text-center">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[220px] p-4">
        <FilterGroup
          label="Impact"
          options={[
            { id: "high", label: "High" },
            { id: "medium", label: "Medium" },
            { id: "low", label: "Low" },
          ]}
          selected={filters.impact}
          onToggle={(v) => toggle("impact", v)}
        />
        <Separator className="my-3.5" />
        <FilterGroup
          label="Effort"
          options={[
            { id: "high", label: "High" },
            { id: "medium", label: "Medium" },
            { id: "low", label: "Low" },
          ]}
          selected={filters.effort}
          onToggle={(v) => toggle("effort", v)}
        />
        {isActive && (
          <Button variant="outline" size="sm" className="mt-3.5 w-full" onClick={clear}>
            Clear filters
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

function FilterGroup({ label, options, selected, onToggle }: {
  label: string; options: { id: string; label: string }[]
  selected: string[]; onToggle: (v: string) => void
}) {
  return (
    <div>
      <Eyebrow className="mb-2">{label}</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer rounded text-[13px] text-foreground/80 select-none hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              checked={selected.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  )
}

function StrategyFilteredEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-10 px-6 text-center">
      <div className="text-sm font-medium text-foreground mb-1.5">
        No strategies match your filters
      </div>
      <div className="text-[13px] text-muted-foreground leading-relaxed max-w-[360px] mx-auto mb-4">
        Try widening the impact or effort levels you've selected.
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  )
}

function StrategyEmptyState({ view }: { view: string }) {
  const copy: Record<string, { title: string; body: string }> = {
    personalized: {
      title: "No personalized strategies yet",
      body: "Once we analyze your return, we'll surface strategies that apply to your situation here.",
    },
    archived: {
      title: "No archived strategies",
      body: "Strategies you skip will move here. You can bring them back any time.",
    },
    others: {
      title: "Library is empty",
      body: "Browse strategies that don't currently apply to your situation but might be useful to know.",
    },
  }
  const c = copy[view] || { title: "", body: "" }

  return (
    <div className="py-10 px-6 text-center">
      <div className="text-sm font-medium text-foreground mb-1.5">{c.title}</div>
      <div className="text-[13px] text-muted-foreground leading-relaxed max-w-[360px] mx-auto">{c.body}</div>
    </div>
  )
}

function TaxPlanView({ states, setStates }: {
  states: Record<string, string>; setStates: (s: Record<string, string>) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState("personalized")
  const [filters, setFilters] = useState({ impact: [] as string[], effort: [] as string[] })
  const selected = STRATEGIES.find((s) => s.id === selectedId) || null

  const [chatMsgs, setChatMsgs] = useState<Record<string, ChatMessage[]>>({})

  const getDefaultMsgs = (s: Strategy | null): ChatMessage[] => {
    if (!s) return [{ role: "assistant", body: "Ask me anything about your tax planning, or click a strategy on the left to dive deeper." }]
    if (!s.personalized) {
      return [
        { role: "assistant", body: `${s.title} isn't personalized for you right now.\n\n${"notApplicableReason" in s ? s.notApplicableReason : "It doesn't match your current tax situation."}` },
        { role: "assistant", body: "Want me to explain how it works in general, or check what would need to change for it to apply?" },
      ]
    }
    if (s.tier === "complex") {
      return [
        { role: "assistant", body: `${s.title} doesn't have a clean single-number answer.\n\n${"complexReason" in s ? s.complexReason : ""}` },
        { role: "assistant", body: "Want me to walk through the scenarios for your situation, or surface the key tradeoffs first?" },
      ]
    }
    return [
      { role: "assistant", body: `Based on your 2026 return, ${s.title} could save you about $${(s.savings || 0).toLocaleString()} this year.\n\nThis is a ${s.complexity.toLowerCase()}-effort move — most people complete it in under 30 minutes.` },
      { role: "assistant", body: "Want me to walk you through how to set this up, or talk through the tradeoffs first?" },
    ]
  }

  const currentMsgs = chatMsgs[selectedId || "_general"] || getDefaultMsgs(selected)

  const transition = (id: string, next: string) => setStates({ ...states, [id]: next })

  const buildChips = (s: Strategy | null): ChipAction[] => {
    if (!s) return [
      { label: "How can I lower my taxable income this year?" },
      { label: "Which strategies apply to my situation?" },
      { label: "What's the deadline for 401(k) contributions?" },
    ]
    if (!s.personalized) return [
      { id: "explain", label: "Explain how it works", primary: true },
      { id: "what-changes", label: "What would need to change?" },
    ]
    if (states[s.id] === "SKIPPED") {
      return [{ id: "reopen", label: "Bring back into my plan", primary: true }]
    }
    if (s.tier === "complex") return [
      { id: "model", label: "Model scenarios for me", primary: true },
      { id: "tradeoffs", label: "Show me tradeoffs" },
      { id: "skip", label: "Not for me" },
    ]
    return [
      { id: "setup", label: "Walk me through setup", primary: true },
      { id: "tradeoffs", label: "Tradeoffs to consider" },
      { id: "skip", label: "Not for me" },
    ]
  }

  const onChip = (c: ChipAction) => {
    if (!selected) return
    const key = selected.id
    const base = chatMsgs[key] || getDefaultMsgs(selected)
    if (c.id === "skip") {
      transition(selected.id, "SKIPPED")
    } else if (c.id === "reopen") {
      transition(selected.id, "NOT_STARTED")
    } else if (c.id === "setup") {
      setChatMsgs(prev => ({ ...prev, [key]: [...base, { role: "user", body: "Walk me through setup." }, { role: "thinking", body: "" }] }))
      setTimeout(() => setChatMsgs(prev => ({ ...prev, [key]: [...(prev[key] || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `Here's how to set up ${selected.title}:\n\n1. Log into your brokerage account\n2. Navigate to the relevant section\n3. Follow the prompts — I'll confirm once it's reflected in your return.\n\nWant me to go step by step, or is this enough to get started?`, typing: true }] })), 1500)
    } else if (c.id === "tradeoffs") {
      setChatMsgs(prev => ({ ...prev, [key]: [...base, { role: "user", body: "What are the tradeoffs?" }, { role: "thinking", body: "" }] }))
      setTimeout(() => setChatMsgs(prev => ({ ...prev, [key]: [...(prev[key] || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `Key tradeoffs for ${selected.title}:\n\n• Upside: ~$${(selected.savings || 0).toLocaleString()} in tax savings this year\n• Downside: Locks up funds or adds complexity to your filing\n• Effort: ${selected.complexity}\n\nFor your situation, the savings likely outweigh the hassle. Want to proceed?`, typing: true }] })), 1500)
    } else if (c.id === "model") {
      setChatMsgs(prev => ({ ...prev, [key]: [...base, { role: "user", body: "Model scenarios for me." }, { role: "thinking", body: "" }] }))
      setTimeout(() => setChatMsgs(prev => ({ ...prev, [key]: [...(prev[key] || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `I've modeled three scenarios for ${selected.title}:\n\n• Conservative: Save ~$${Math.round((selected.savings || 0) * 0.6).toLocaleString()}\n• Moderate: Save ~$${(selected.savings || 0).toLocaleString()}\n• Aggressive: Save ~$${Math.round((selected.savings || 0) * 1.4).toLocaleString()}\n\nThe moderate approach fits your risk profile best. Want me to dig into any of these?`, typing: true }] })), 1500)
    } else if (c.id === "explain") {
      setChatMsgs(prev => ({ ...prev, [key]: [...base, { role: "user", body: "Explain how it works." }, { role: "thinking", body: "" }] }))
      setTimeout(() => setChatMsgs(prev => ({ ...prev, [key]: [...(prev[key] || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `${selected.title} works by reducing your taxable income through a specific IRS provision. While it doesn't apply to your current situation, here's the general mechanism:\n\nYou would need to meet certain eligibility criteria, then file the appropriate form with your return. The savings depend on your marginal rate.`, typing: true }] })), 1500)
    } else if (c.id === "what-changes") {
      setChatMsgs(prev => ({ ...prev, [key]: [...base, { role: "user", body: "What would need to change for this to apply?" }, { role: "thinking", body: "" }] }))
      setTimeout(() => setChatMsgs(prev => ({ ...prev, [key]: [...(prev[key] || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `For ${selected.title} to become relevant, you'd need a change in your income structure or filing status. Specifically, if your situation changes mid-year I'll flag it and re-run the numbers.`, typing: true }] })), 1500)
    }
  }

  const inPlanStrategies = STRATEGIES.filter(s => s.personalized && states[s.id] !== "SKIPPED")
  const inPlanTotal = inPlanStrategies.reduce((a, s) => a + (s.savings || 0), 0)
  const inPlanCount = inPlanStrategies.length

  const visibleList = STRATEGIES.filter(s => {
    if (view === "personalized" && !(s.personalized && states[s.id] !== "SKIPPED")) return false
    if (view === "archived" && !(s.personalized && states[s.id] === "SKIPPED")) return false
    if (view === "others" && s.personalized) return false
    if (filters.impact.length > 0 && !filters.impact.includes(impactBucket(s))) return false
    if (filters.effort.length > 0 && !filters.effort.includes(s.complexity.toLowerCase())) return false
    return true
  })

  return (
    <div className="grid grid-cols-[1fr_1fr] h-full overflow-hidden flex-1 min-w-0">
      <div className="flex flex-col h-full overflow-hidden min-w-0">
        <div className="pl-4 pr-3 pt-4 shrink-0">
          <div className="mb-8">
            <div className="text-[18px] leading-7 font-medium text-foreground mb-5">2026 tax plan</div>
            <PlanningTaxPlanCard
              total={inPlanTotal}
              count={inPlanCount}
              active={selectedId === null}
              onClick={() => setSelectedId(null)}
            />
          </div>

          <Tabs value={view} onValueChange={setView} className="mb-4">
            <div className="flex items-center justify-between">
              <SlidingTabsList value={view}>
                <TabsTrigger value="personalized" className="gap-1.5 z-[1] data-active:bg-transparent data-active:shadow-none">
                  Personalized
                  <span className="inline-flex items-center justify-center rounded-[4px] bg-gray-dark-700 px-1 py-0.5 text-[10px] leading-3 font-normal text-[#fffef9] min-w-4 text-center">
                    {STRATEGIES.filter(s => s.personalized && states[s.id] !== "SKIPPED").length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="gap-1.5 z-[1] data-active:bg-transparent data-active:shadow-none">
                  Archived
                  <span className="inline-flex items-center justify-center rounded-[4px] bg-gray-dark-700 px-1 py-0.5 text-[10px] leading-3 font-normal text-[#fffef9] min-w-4 text-center">
                    {STRATEGIES.filter(s => s.personalized && states[s.id] === "SKIPPED").length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="others" className="gap-1.5 z-[1] data-active:bg-transparent data-active:shadow-none">
                  Others
                  <span className="inline-flex items-center justify-center rounded-[4px] bg-gray-dark-700 px-1 py-0.5 text-[10px] leading-3 font-normal text-[#fffef9] min-w-4 text-center">
                    {STRATEGIES.filter(s => !s.personalized).length}
                  </span>
                </TabsTrigger>
              </SlidingTabsList>
              <StrategyFilter filters={filters} setFilters={setFilters} />
            </div>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto pl-4 pr-3 pb-4">
          <div className="bg-card border border-border rounded-[10px] overflow-hidden">
            {visibleList.length === 0 ? (
              filters.impact.length + filters.effort.length > 0
                ? <StrategyFilteredEmpty onClear={() => setFilters({ impact: [], effort: [] })} />
                : <StrategyEmptyState view={view} />
            ) : (
              visibleList.map((s) => (
                <StrategyRow
                  key={s.id} s={s} state={states[s.id]}
                  selected={selectedId === s.id}
                  onClick={() => setSelectedId(s.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pl-3 pr-4 py-4 overflow-hidden min-w-0">
        <ChatSurface
          context={undefined}
          header={selected ? selected.title : "Ask anything about tax planning"}
          messages={currentMsgs}
          chips={buildChips(selected)}
          onChip={onChip}
          onClose={selected ? () => setSelectedId(null) : null}
          placeholder={selected ? "Ask about this strategy…" : "Ask about tax planning…"}
          smallHeader
        />
      </div>
    </div>
  )
}

// ── W-4 Estimator view ───────────────────────────────────────────────────
function W4EstimatorView() {
  const [baseSalary, setBaseSalary] = useState(435000)
  const [rsuIncome, setRsuIncome] = useState(280000)
  const [spouseIncome, setSpouseIncome] = useState(280000)
  const [extraWithholding, setExtraWithholding] = useState(11000)
  const [estimatedPayment, setEstimatedPayment] = useState(0)
  const [w4Msgs, setW4Msgs] = useState<ChatMessage[] | null>(null)

  const baseWithheld = Math.round(baseSalary * 0.24)
  const rsuWithheld = Math.round(rsuIncome * 0.22)
  const spouseWithheld = Math.round(spouseIncome * 0.24)
  const totalWithheld = baseWithheld + rsuWithheld + spouseWithheld + extraWithholding + estimatedPayment

  const householdIncome = baseSalary + rsuIncome + spouseIncome
  const taxOwed = (() => {
    let owed = 0
    if (householdIncome <= 400000) owed = householdIncome * 0.24
    else if (householdIncome <= 800000) owed = 400000 * 0.24 + (householdIncome - 400000) * 0.32
    else owed = 400000 * 0.24 + 400000 * 0.32 + (householdIncome - 800000) * 0.37
    return Math.round(owed)
  })()

  const gap = Math.max(0, taxOwed - totalWithheld)
  const pctWithheld = taxOwed > 0 ? Math.min(100, (totalWithheld / taxOwed) * 100) : 100
  const hasPenaltyRisk = gap > 5000

  return (
    <div className="grid grid-cols-[1fr_1fr] h-full overflow-hidden flex-1 min-w-0">
      <div className="flex flex-col h-full overflow-hidden min-w-0">
        <div className="pl-4 pr-3 pt-4 shrink-0">
          <div className="mb-6">
            <div className="text-[18px] leading-7 font-medium text-foreground mb-1">Withholding simulator</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Your RSU vests withhold at a flat 22%. Your real marginal rate is closer
              to 37%. The IRS expects the difference in April — simulate it now.
            </p>
          </div>

          <Card className="mb-4">
            <CardContent>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="text-[13px] text-foreground/80">{gap > 0 ? "You'll owe" : "You're covered"}</div>
                  <div className={cn(
                    "text-[30px] font-medium tracking-tight mt-1",
                    gap > 0 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    ${gap.toLocaleString()}
                  </div>
                </div>
                {hasPenaltyRisk && (
                  <Badge className="bg-red-500/15 text-red-400 border-transparent rounded-full">
                    Penalty risk
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {hasPenaltyRisk
                  ? "Along with possible underpayment penalty (~8% APR on the shortfall)"
                  : "You're within safe-harbor — no penalty expected"}
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground mt-4 mb-1.5 uppercase tracking-wider">
                <span>Withheld so far: ${totalWithheld.toLocaleString()}</span>
                <span>Federal tax owed: ${taxOwed.toLocaleString()}</span>
              </div>
              <Progress
                value={pctWithheld}
                className={cn(
                  "h-1.5 bg-border",
                  gap > 5000
                    ? "[&_[data-slot=progress-indicator]]:bg-red-600"
                    : gap > 0
                      ? "[&_[data-slot=progress-indicator]]:bg-amber-600"
                      : "[&_[data-slot=progress-indicator]]:bg-emerald-600"
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto pl-4 pr-3 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <SimulatorPanel title="Your situation">
              <SimulatorSlider label="Base salary (W-2)" value={baseSalary} onChange={setBaseSalary} min={50000} max={800000} step={5000} hint="Withheld using normal W-4 tables" />
              <SimulatorSlider label="RSU / bonus income" value={rsuIncome} onChange={setRsuIncome} min={0} max={600000} step={5000} hint="Withheld at flat 22%" />
              <SimulatorSlider label="Spouse income" value={spouseIncome} onChange={setSpouseIncome} min={0} max={500000} step={5000} hint="Pushes household into higher bracket" />
            </SimulatorPanel>

            <SimulatorPanel title="Levers to close the gap">
              <SimulatorSlider label="Extra W-4 withholding" value={extraWithholding} onChange={setExtraWithholding} min={0} max={50000} step={500} hint="Line 4c on your W-4" accent />
              <SimulatorSlider label="Q-4 estimated payment" value={estimatedPayment} onChange={setEstimatedPayment} min={0} max={80000} step={1000} hint="Form 1040-ES, due Jan 15" accent />
            </SimulatorPanel>
          </div>
        </div>
      </div>

      <div className="pl-3 pr-4 py-4 overflow-hidden">
        <ChatSurface
          header="Ask anything about your withholding"
          messages={w4Msgs || [
            {
              role: "assistant",
              body: gap > 5000
                ? `Right now you're under-withheld by about $${gap.toLocaleString()}. I'd raise your Q-4 estimated payment or add to line 4c on your W-4 to close it.`
                : gap > 0
                  ? `You're close — about $${gap.toLocaleString()} short. Easy to clean up before year-end.`
                  : "You're covered. Withholding lines up with your projected liability.",
            },
            { role: "assistant", body: "Try the sliders on the left, or ask me anything specific about your withholding." },
          ]}
          chips={[
            { id: "focus", label: "What should I focus on?" },
            { id: "explain", label: "Explain the numbers to me" },
            { id: "simulate", label: "Simulate next month for me" },
          ]}
          onChip={(c) => {
            const base = w4Msgs || [
              { role: "assistant", body: gap > 5000 ? `Right now you're under-withheld by about $${gap.toLocaleString()}.` : gap > 0 ? `You're close — about $${gap.toLocaleString()} short.` : "You're covered." },
              { role: "assistant", body: "Try the sliders on the left, or ask me anything specific about your withholding." },
            ]
            if (c.id === "focus") {
              setW4Msgs([...base, { role: "user", body: "What should I focus on?" }, { role: "thinking", body: "" }])
              setTimeout(() => setW4Msgs(prev => [...(prev || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `Focus on closing the $${gap.toLocaleString()} gap. Your best lever is the extra W-4 withholding on line 4c — raising it by $${Math.round(gap / 12).toLocaleString()}/month would close it by year-end without a lump-sum estimated payment.`, typing: true }]), 1500)
            } else if (c.id === "explain") {
              setW4Msgs([...base, { role: "user", body: "Explain the numbers to me." }, { role: "thinking", body: "" }])
              setTimeout(() => setW4Msgs(prev => [...(prev || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `Here's the breakdown:\n\n• Base salary withheld: $${baseWithheld.toLocaleString()} (24% rate)\n• RSU withheld: $${rsuWithheld.toLocaleString()} (flat 22%)\n• Spouse withheld: $${spouseWithheld.toLocaleString()} (24% rate)\n• Extra withholding: $${extraWithholding.toLocaleString()}\n\nTotal withheld: $${totalWithheld.toLocaleString()}\nActual tax owed: $${taxOwed.toLocaleString()}\n\nThe gap exists because RSUs are withheld at 22% but your real marginal rate is higher.`, typing: true }]), 1500)
            } else if (c.id === "simulate") {
              setW4Msgs([...base, { role: "user", body: "Simulate next month for me." }, { role: "thinking", body: "" }])
              setTimeout(() => setW4Msgs(prev => [...(prev || base).filter(m => m.role !== "thinking"), { role: "assistant", body: `Next month projection:\n\nIf nothing changes, your gap grows by ~$${Math.round(gap / 12).toLocaleString()} (one month of under-withholding on RSU vests).\n\nIf you bump W-4 line 4c to $${(extraWithholding + Math.round(gap / 6)).toLocaleString()}, you'd be on track to close the gap by December with no estimated payment needed.`, typing: true }]), 1500)
            }
          }}
          placeholder="Ask me anything about your tax situation…"
        />
      </div>
    </div>
  )
}

function SimulatorPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4.5">
        <Eyebrow>{title}</Eyebrow>
        {children}
      </CardContent>
    </Card>
  )
}

function SimulatorSlider({ label, value, onChange, min, max, step, hint, accent }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step: number; hint?: string; accent?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <Label className="text-[13px] font-medium">{label}</Label>
        <span className="text-[13px] text-foreground font-medium tabular-nums">
          ${value.toLocaleString()}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className={cn(accent && "[&_[data-slot=slider-thumb]]:border-brand-600 [&_[data-slot=slider-range]]:bg-brand-600")}
      />
      {hint && (
        <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{hint}</div>
      )}
    </div>
  )
}

// ── RETURN FILING: Canvas sections & script ────────────────────────────────

type FilingItem = { id: string; label: string; tags: string[]; confirmed: boolean; extracting?: boolean }
type FilingSection = {
  id: string; label: string; type: "items" | "progress"
  items?: FilingItem[]; state?: string; progress?: number
}

const INITIAL_FILING_SECTIONS: FilingSection[] = [
  {
    id: "profile", label: "Your profile information", type: "items",
    items: [
      { id: "filing_status", label: "Filing status", tags: [], confirmed: false },
      { id: "residency", label: "Residency", tags: [], confirmed: false },
      { id: "dependents", label: "Dependents", tags: [], confirmed: false },
    ],
  },
  {
    id: "income", label: "Income sources", type: "items",
    items: [
      { id: "employment", label: "Employment", tags: [], confirmed: false },
      { id: "self_employment", label: "Self-employment", tags: [], confirmed: false },
      { id: "stocks", label: "Stocks & brokerage", tags: [], confirmed: false },
      { id: "crypto", label: "Crypto", tags: [], confirmed: false },
      { id: "rental", label: "Rental & real estate", tags: [], confirmed: false },
    ],
  },
  {
    id: "documents", label: "Documents collection", type: "items",
    items: [
      { id: "w2", label: "W-2 · Tech Corp", tags: [], confirmed: false },
      { id: "1099nec", label: "1099-NEC · Freelance (×2)", tags: [], confirmed: false },
      { id: "1099div", label: "1099-DIV · Fidelity", tags: [], confirmed: false },
      { id: "1099b", label: "1099-B · Fidelity", tags: [], confirmed: false },
      { id: "coinbase", label: "Coinbase transactions", tags: [], confirmed: false },
      { id: "rental_docs", label: "Rental records", tags: [], confirmed: false },
    ],
  },
  {
    id: "foreign", label: "Foreign accounts", type: "items",
    items: [
      { id: "hdfc", label: "HDFC Bank", tags: [], confirmed: false },
      { id: "icici", label: "ICICI Bank", tags: [], confirmed: false },
      { id: "other_foreign", label: "Other accounts", tags: [], confirmed: false },
    ],
  },
  {
    id: "deductions", label: "Deductions & credits", type: "items",
    items: [
      { id: "standard_vs_itemized", label: "Standard vs itemized", tags: [], confirmed: false },
      { id: "retirement", label: "Retirement contributions", tags: [], confirmed: false },
      { id: "charitable", label: "Charitable giving", tags: [], confirmed: false },
    ],
  },
  {
    id: "planning", label: "Tax planning checks", type: "items",
    items: [
      { id: "rsu_basis", label: "RSU cost basis", tags: [], confirmed: false },
      { id: "iso_amt", label: "ISO & AMT exposure", tags: [], confirmed: false },
      { id: "state_tax", label: "State tax (California)", tags: [], confirmed: false },
    ],
  },
  { id: "draft", label: "Draft return", type: "progress", progress: 0 },
]

type FilingScriptStep = {
  role: "assistant" | "user"
  text: string
  chips?: { id: string; label: string; primary?: boolean }[]
  confirm?: { sectionId: string; itemId: string; tags: string[] }
  confirmDocs?: string[]
  confirmDocsTag?: string
  advance?: { activeSection?: string; activeItem?: string; openSection?: string; completeSection?: string }
  duration?: number
  runProgress?: boolean
  showUpload?: boolean
  triggerExtraction?: boolean
  runExtraction?: boolean
  showExtractionTable?: boolean
  multiSelect?: { options: MultiSelectOption[] }
  isMultiSelectResponse?: boolean
}

const FILING_SCRIPT: FilingScriptStep[] = [
  { role: "assistant", text: "Welcome back, Kunal. I'll prepare your 2026 return. We'll walk through your profile, income, documents, foreign accounts, deductions, and planning checks — then I'll prepare the draft.\n\nYou can edit anything we confirm at any point.", chips: [{ id: "begin", label: "Let's begin", primary: true }] },
  { role: "user", text: "Let's begin", advance: { activeSection: "profile", activeItem: "filing_status", openSection: "profile" } },

  { role: "assistant", text: "I have you filing jointly with your spouse, same as last year. Still MFJ for 2026?", chips: [{ id: "mfj", label: "Yes, married filing jointly", primary: true }, { id: "changed", label: "Something changed" }] },
  { role: "user", text: "Yes, married filing jointly", confirm: { sectionId: "profile", itemId: "filing_status", tags: ["Married Filing Jointly"] }, advance: { activeItem: "residency" } },

  { role: "assistant", text: "California resident the full year, correct?", chips: [{ id: "ca", label: "Yes, full year CA resident", primary: true }, { id: "changed", label: "Something changed" }] },
  { role: "user", text: "Yes, full year CA resident", confirm: { sectionId: "profile", itemId: "residency", tags: ["California", "full year"] }, advance: { activeItem: "dependents" } },

  { role: "assistant", text: "Two dependents from last year — same for 2026?", chips: [{ id: "deps", label: "Yes, same two dependents", primary: true }, { id: "changed", label: "Something changed" }] },
  { role: "user", text: "Yes, same two dependents", confirm: { sectionId: "profile", itemId: "dependents", tags: ["2 dependents"] }, advance: { completeSection: "profile", activeSection: "income", activeItem: "employment", openSection: "income" } },

  { role: "assistant", text: "Pulling your W-2 from Tech Corp. Full year there?", chips: [{ id: "emp", label: "Yes, full year at Tech Corp", primary: true }, { id: "changed", label: "Something changed" }] },
  { role: "user", text: "Yes, full year at Tech Corp", confirm: { sectionId: "income", itemId: "employment", tags: ["W-2 · Tech Corp"] }, advance: { activeItem: "self_employment" } },

  { role: "assistant", text: "I see two 1099-NEC forms — freelance work for two clients. Include them?", chips: [{ id: "se", label: "Yes, include both", primary: true }, { id: "skip", label: "Skip self-employment" }] },
  { role: "user", text: "Yes, include both", confirm: { sectionId: "income", itemId: "self_employment", tags: ["freelance", "2 clients"] }, advance: { activeItem: "stocks" } },

  { role: "assistant", text: "Your Fidelity 1099-DIV and 1099-B are loaded. I'll handle cost basis adjustment in the planning section.", chips: [{ id: "stocks", label: "Yes, proceed", primary: true }, { id: "more", label: "Tell me more" }] },
  { role: "user", text: "Yes, proceed", confirm: { sectionId: "income", itemId: "stocks", tags: ["Fidelity"] }, advance: { activeItem: "crypto" } },

  { role: "assistant", text: "Found Coinbase activity from last year. Pull this year's transactions the same way?", chips: [{ id: "crypto", label: "Yes, pull from Coinbase", primary: true }, { id: "other", label: "I have other exchanges" }] },
  { role: "user", text: "Yes, pull from Coinbase", confirm: { sectionId: "income", itemId: "crypto", tags: ["Coinbase"] }, advance: { activeItem: "rental" } },

  { role: "assistant", text: "Rental property in Austin, TX — same as last year?", chips: [{ id: "rental", label: "Yes, same property", primary: true }, { id: "none", label: "No rental income" }] },
  { role: "user", text: "Yes, same property", confirm: { sectionId: "income", itemId: "rental", tags: ["Austin, TX"] }, advance: { completeSection: "income", activeSection: "documents", activeItem: "1099div", openSection: "documents" }, confirmDocs: ["w2", "1099nec", "coinbase", "rental_docs"], confirmDocsTag: "Auto-imported" },

  { role: "assistant", text: "Income looks good. I need one more document — your year-end brokerage statement from Fidelity. Upload it when you're ready and I'll extract the details.", showUpload: true },
  { role: "user", text: "\u{1F4C4} Fidelity_YE_2024.pdf uploaded", triggerExtraction: true },
  { role: "assistant", text: "Reading the statement…", runExtraction: true, duration: 12000 },
  { role: "assistant", text: "Got it. Here's what I pulled from the statement. Confirm everything looks right and I'll move on.", showExtractionTable: true },
  { role: "user", text: "Confirm extracted data", confirmDocs: ["1099div", "1099b"], confirmDocsTag: "Extracted", advance: { completeSection: "documents", activeSection: "foreign", activeItem: "hdfc", openSection: "foreign" } },

  { role: "assistant", text: "Your HDFC Bank year-end balance was $8,420. Confirm?", chips: [{ id: "hdfc", label: "Yes, that's right", primary: true }, { id: "diff", label: "Different balance" }] },
  { role: "user", text: "Yes, that's right", confirm: { sectionId: "foreign", itemId: "hdfc", tags: ["$8,420 year-end"] }, advance: { activeItem: "icici" } },

  { role: "assistant", text: "ICICI Bank year-end balance was $5,860. Confirm?", chips: [{ id: "icici", label: "Yes, that's right", primary: true }, { id: "diff", label: "Different balance" }] },
  { role: "user", text: "Yes, that's right", confirm: { sectionId: "foreign", itemId: "icici", tags: ["$5,860 year-end"] }, advance: { activeItem: "other_foreign" } },

  { role: "assistant", text: "Aggregate is $14,280 — over $10K threshold, so FBAR and Form 8938 are required. Any other foreign accounts?", chips: [{ id: "none", label: "No, just those two", primary: true }, { id: "add", label: "Yes, add another" }] },
  { role: "user", text: "No, just those two", confirm: { sectionId: "foreign", itemId: "other_foreign", tags: ["none · FBAR + 8938"] }, advance: { completeSection: "foreign", activeSection: "deductions", activeItem: "standard_vs_itemized", openSection: "deductions" } },

  { role: "assistant", text: "Before we settle your deductions, let me ask broadly — did you spend money on any of these this year? Tap each one that applies.", multiSelect: { options: [
    { id: "mortgage", label: "Paid mortgage interest on a home you own" },
    { id: "property_tax", label: "Paid property tax" },
    { id: "charity_cash", label: "Donated cash to a charity" },
    { id: "charity_goods", label: "Donated goods or property to a charity (clothes, furniture, stock, etc.)" },
    { id: "student_loan", label: "Paid interest on student loans" },
    { id: "medical", label: "Had big out-of-pocket medical or dental bills" },
    { id: "childcare", label: "Paid for childcare so you (or your spouse) could work" },
  ] } },
  { role: "user", text: "Selected: mortgage interest, property tax, charitable donations", isMultiSelectResponse: true },

  { role: "assistant", text: "Running standard ($29,200 MFJ) against your itemized — mortgage interest, SALT capped at $10K, charitable. Itemized comes out higher at $38,420.", chips: [{ id: "itemized", label: "Use itemized", primary: true }, { id: "standard", label: "Use standard" }] },
  { role: "user", text: "Use itemized", confirm: { sectionId: "deductions", itemId: "standard_vs_itemized", tags: ["itemized · $38,420"] }, advance: { activeItem: "retirement" } },

  { role: "assistant", text: "W-2 shows $23,000 to 401(k) — maxed. Plus Roth IRA contributions. Include both?", chips: [{ id: "both", label: "Yes, include both", primary: true }, { id: "just401k", label: "Just the 401(k)" }] },
  { role: "user", text: "Yes, include both", confirm: { sectionId: "deductions", itemId: "retirement", tags: ["401(k) maxed", "Roth IRA"] }, advance: { activeItem: "charitable" } },

  { role: "assistant", text: "$4,800 in charitable contributions reported. Match your records?", chips: [{ id: "charity", label: "Yes, that's right", primary: true }, { id: "check", label: "Let me check" }] },
  { role: "user", text: "Yes, that's right", confirm: { sectionId: "deductions", itemId: "charitable", tags: ["$4,800 contributed"] }, advance: { completeSection: "deductions", activeSection: "planning", activeItem: "rsu_basis", openSection: "planning" } },

  { role: "assistant", text: "Your 1099-B under-reports cost basis on 847 RSU shares by $42,103. Adjusting up using your supplemental statement so you're not double-taxed.", chips: [{ id: "rsu", label: "Apply the adjustment", primary: true }, { id: "more", label: "Tell me more" }] },
  { role: "user", text: "Apply the adjustment", confirm: { sectionId: "planning", itemId: "rsu_basis", tags: ["basis +$42,103"] }, advance: { activeItem: "iso_amt" } },

  { role: "assistant", text: "You exercised 1,200 ISOs in Q3 at $52 strike with $89 FMV — $44,400 AMT preference. You're $11,840 into AMT territory. Capturing as carryforward credit.", chips: [{ id: "iso", label: "Apply", primary: true }, { id: "more", label: "Tell me more" }] },
  { role: "user", text: "Apply", confirm: { sectionId: "planning", itemId: "iso_amt", tags: ["$11,840 AMT", "carryforward"] }, advance: { activeItem: "state_tax" } },

  { role: "assistant", text: "Running your California state return alongside the federal. Standard CA conformity rules apply.", chips: [{ id: "state", label: "Proceed", primary: true }] },
  { role: "user", text: "Proceed", confirm: { sectionId: "planning", itemId: "state_tax", tags: ["CA · standard conformity"] }, advance: { completeSection: "planning", activeSection: "draft" } },

  { role: "assistant", text: "Got everything I need. Preparing your draft return now — you'll see the progress on the right.", duration: 5000, runProgress: true },
  { role: "assistant", text: "Your return is ready.\n\n**Federal refund: $4,820**\n**California refund: $1,210**\n\nReview the summary or edit anything above before filing.", chips: [{ id: "review", label: "Review and file", primary: true }, { id: "summary", label: "See the summary" }] },
]

const SUMMARY_SECTIONS = [
  {
    label: "Your income breakdown", color: "bg-blue-900", items: [
      { label: "W-2 wages (Tech Corp)", value: "$185,000" },
      { label: "Self-employment (freelance)", value: "$42,600" },
      { label: "Qualified dividends", value: "$6,180" },
      { label: "Ordinary dividends", value: "$8,240" },
      { label: "Short-term capital gains", value: "$1,240" },
      { label: "Rental income (net)", value: "$18,400" },
      { label: "Crypto gains", value: "$3,820" },
    ],
  },
  {
    label: "Deductions to reduce your taxable income", color: "bg-orange-900", items: [
      { label: "Standard deduction (MFJ)", value: "$29,200" },
      { label: "401(k) contributions", value: "$23,000" },
      { label: "Student loan interest", value: "$2,500" },
      { label: "Self-employment tax (½)", value: "$3,012" },
      { label: "Home office deduction", value: "$1,800" },
    ],
  },
  {
    label: "Your tax calculation", color: "bg-gray-800", items: [
      { label: "Taxable income", value: "$206,768" },
      { label: "Federal tax", value: "$38,420" },
      { label: "California state tax", value: "$14,860" },
      { label: "Self-employment tax", value: "$6,024" },
      { label: "Net investment income tax", value: "$0" },
    ],
  },
  {
    label: "Amount you owe", color: "bg-amber-900", items: [
      { label: "Total tax liability", value: "$59,304" },
      { label: "Federal withholding (W-2)", value: "$42,500" },
      { label: "CA withholding (W-2)", value: "$11,200" },
      { label: "Estimated payments made", value: "$10,424" },
      { label: "Federal refund", value: "$4,820", highlight: true },
      { label: "California refund", value: "$1,210", highlight: true },
    ],
  },
  {
    label: "Carryovers to future years", color: "bg-purple-900", items: [
      { label: "Capital loss carryover", value: "$0" },
      { label: "Charitable contribution carryover", value: "$0" },
      { label: "Net operating loss", value: "$0" },
    ],
  },
]

function SummaryBreakdown() {
  const [openSection, setOpenSection] = useState<number | null>(null)
  return (
    <div className="max-w-[580px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-[14px] leading-[20px] text-white font-[Manrope]">You&apos;re getting back</span>
        <span className="text-[24px] leading-[28px] font-semibold text-white font-[Manrope]">$6,030</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-dark-900 border border-gray-dark-700 rounded-lg px-3 py-2.5">
          <div className="text-[12px] leading-[16px] text-gray-dark-100 font-[Manrope]">Income</div>
          <div className="text-[18px] leading-[24px] font-semibold text-white font-[Manrope] mt-1">$265,480</div>
        </div>
        <div className="bg-gray-dark-900 border border-gray-dark-700 rounded-lg px-3 py-2.5">
          <div className="text-[12px] leading-[16px] text-gray-dark-100 font-[Manrope]">Deductions</div>
          <div className="text-[18px] leading-[24px] font-semibold text-white font-[Manrope] mt-1">$59,512</div>
        </div>
        <div className="bg-gray-dark-900 border border-gray-dark-700 rounded-lg px-3 py-2.5">
          <div className="text-[12px] leading-[16px] text-gray-dark-100 font-[Manrope]">Credits</div>
          <div className="text-[18px] leading-[24px] font-semibold text-white font-[Manrope] mt-1">$2,000</div>
        </div>
      </div>
      <div className="flex flex-col">
        {SUMMARY_SECTIONS.map((sec, i) => (
          <div key={i}>
            {i > 0 && <div className="h-px bg-gray-dark-700" />}
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              className="w-full flex items-center gap-2 px-2 py-3 bg-transparent border-none cursor-pointer text-left"
            >
              <div className="relative size-5 shrink-0">
                <div className={cn("absolute left-0 top-0 size-[12.5px] rounded-[2.5px] backdrop-blur-sm", sec.color)} />
                <CoinsDollar className="absolute inset-0 size-5 text-white" />
              </div>
              <span className="flex-1 text-[14px] leading-[20px] text-white font-[Manrope] tracking-[-0.28px]">{sec.label}</span>
              <ChevronRight className={cn("size-5 text-muted-foreground transition-transform duration-200", openSection === i && "rotate-90")} />
            </button>
            {openSection === i && (
              <div className="flex flex-col gap-2 px-2 pb-3 animate-[filing-accordion-open_0.3s_cubic-bezier(0.2,0.8,0.2,1)]">
                {sec.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between text-[13px] font-[Manrope]">
                    <span className="text-gray-dark-200">{item.label}</span>
                    <span className={cn("font-mono tabular-nums", item.highlight ? "text-emerald-400 font-medium" : "text-white")}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FilingCanvasSection({ section, isOpen, isActive, activeItem, onToggle }: {
  section: FilingSection; isOpen: boolean; isActive: boolean; activeItem: string | null; onToggle: () => void
}) {
  const isComplete = section.state === "complete"
  const isExtracting = section.state === "extracting"

  if (section.type === "progress") {
    const done = (section.progress ?? 0) >= 100
    return (
      <div>
        <div className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500",
          isActive ? "border-brand-400 shadow-[0_0_0_1px_rgba(167,152,104,0.13),0_8px_24px_-8px_rgba(0,0,0,0.6)]" : "border-gray-dark-700",
          "bg-gray-dark-950"
        )}>
          <div className={cn("size-2 rounded-full transition-colors", isActive || done ? "bg-brand-400 shadow-[0_0_8px_var(--brand-400)]" : "bg-gray-dark-500")} />
          <span className="text-[14px] leading-[22px] text-gray-dark-200 font-medium flex-1">{section.label}</span>
          <div className={cn(
            "relative rounded-full px-2 py-0.5 text-xs font-medium tabular-nums transition-colors overflow-hidden",
            done ? "bg-brand-400 text-gray-dark-950" : isActive ? "bg-brand-600 text-white" : "bg-gray-dark-700 text-gray-dark-200"
          )}>
            {isActive && !done && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[filing-shimmer_2s_ease-in-out_infinite]" />}
            <span className="relative">{section.progress ?? 0}%</span>
          </div>
        </div>
      </div>
    )
  }

  const borderColor = isActive ? "border-brand-400" : "border-gray-dark-700"

  return (
    <div>
      <div className={cn("rounded-lg border overflow-hidden transition-all duration-500 bg-gray-dark-900", borderColor, isActive && "shadow-[0_0_0_1px_rgba(167,152,104,0.13),0_8px_24px_-8px_rgba(0,0,0,0.6)]")}>
        <button onClick={onToggle} className="w-full flex items-center gap-2.5 px-3.5 py-3 bg-transparent border-none cursor-pointer text-left">
          {isComplete ? (
            <CheckmarkCircle className="size-[18px] text-brand-400 shrink-0 animate-[filing-confirmed-in_0.5s_cubic-bezier(0.2,0.8,0.2,1)]" />
          ) : isActive ? (
            <div className="size-[18px] grid place-items-center shrink-0">
              <div className={cn("size-2 rounded-full bg-brand-400 shadow-[0_0_10px_var(--brand-400)] animate-[filing-active-pulse_2s_ease-in-out_infinite]", isExtracting && "animate-pulse")} />
            </div>
          ) : (
            <div className="size-[18px] rounded-full border border-gray-dark-700 shrink-0" />
          )}
          <span className={cn("flex-1 text-[13px] uppercase tracking-[0.04em] font-medium transition-colors duration-300", isActive ? "text-white font-semibold" : isComplete ? "text-white" : "text-gray-dark-200")}>
            {section.label}
          </span>
          {isExtracting && (
            <span className="text-[11px] uppercase tracking-[0.04em] font-medium text-brand-400 animate-pulse">
              Extracting…
            </span>
          )}
          <ChevronRight className={cn("size-4 text-muted-foreground transition-transform duration-300", isOpen ? "rotate-90" : "")} />
        </button>

        {isOpen && section.type === "items" && section.items && (() => {
          const confirmed = section.items.filter(it => it.confirmed)
          const pending = section.items.filter(it => !it.confirmed)
          return (
            <div className="border-t border-gray-dark-700 px-3.5 py-3 flex flex-col gap-3 animate-[filing-accordion-open_0.45s_cubic-bezier(0.2,0.8,0.2,1)]">
              {confirmed.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 animate-[filing-item-slide-in_0.4s_cubic-bezier(0.2,0.8,0.2,1)_backwards]" style={{ animationDelay: `${idx * 60}ms` }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="var(--brand-400)" strokeWidth="1" />
                    <path d="M4.5 8.5 L7 11 L11.5 5.5" fill="none" stroke="var(--brand-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <div className="flex gap-1.5 flex-1 min-w-0 flex-wrap">
                    {item.tags.map((tag, i) => (
                      <span key={tag} className="bg-gray-dark-700 text-gray-dark-100 text-xs font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap animate-[filing-tag-in_0.4s_cubic-bezier(0.2,0.8,0.2,1)_backwards]" style={{ animationDelay: `${idx * 60 + 100 + i * 60}ms` }}>{tag}</span>
                    ))}
                  </div>
                  <button className="bg-gray-dark-950 border border-gray-dark-700/50 text-gray-dark-25 text-xs px-1.5 py-0.5 rounded-md shrink-0 cursor-pointer hover:border-brand-400 transition-colors">
                    edit
                  </button>
                </div>
              ))}
              {pending.map((item, idx) => {
                const isCurrent = item.id === activeItem && isActive
                const isExtracting = item.extracting
                const delay = (confirmed.length + idx) * 60
                return (
                  <div key={item.id} className={cn("flex items-center gap-2 rounded-md transition-all duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] animate-[filing-item-slide-in_0.4s_cubic-bezier(0.2,0.8,0.2,1)_backwards]", isCurrent && "bg-brand-400/[0.06] -mx-2 px-2 py-1.5")} style={{ animationDelay: `${delay}ms` }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
                      <circle cx="8" cy="8" r="7" fill="none" stroke={isExtracting ? "var(--brand-400)" : isCurrent ? "var(--brand-400)" : "#999"} strokeWidth="1" strokeDasharray={isExtracting ? "3 2" : "none"}>
                        {isExtracting && <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="2s" repeatCount="indefinite" />}
                      </circle>
                      {isCurrent && !isExtracting && <circle cx="8" cy="8" r="2" fill="var(--brand-400)"><animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" /></circle>}
                    </svg>
                    <span className={cn("text-sm transition-colors duration-300", isCurrent || isExtracting ? "text-white font-medium" : "text-gray-dark-200")}>{item.label}</span>
                    {isExtracting && <span className="ml-auto text-[11px] uppercase tracking-[0.04em] font-medium text-brand-400 animate-pulse">Extracting…</span>}
                    {isCurrent && !isExtracting && <span className="ml-auto text-[11px] uppercase tracking-[0.04em] font-medium text-brand-400">Your turn</span>}
                  </div>
                )
              })}
            </div>
          )
        })()}

      </div>
    </div>
  )
}

function FilingTimelineDot({ active, complete }: { active: boolean; complete: boolean }) {
  return (
    <div className="absolute -left-[23px] top-[18px] size-4 flex items-center justify-center z-[2]">
      <div className={cn(
        "rounded-full transition-all duration-400",
        complete ? "size-2.5 bg-brand-400" : active ? "size-2 bg-brand-400 border border-brand-300 shadow-[0_0_10px_var(--brand-400)] animate-[filing-timeline-dot-pulse_2s_ease-in-out_infinite]" : "size-2 bg-gray-dark-700"
      )} />
    </div>
  )
}

function FilingCanvas({ sections, isSectionOpen, activeSection, activeItem, onToggle, canvasTab, setCanvasTab }: {
  sections: FilingSection[]; isSectionOpen: (id: string) => boolean; activeSection: string | null; activeItem: string | null
  onToggle: (id: string) => void; canvasTab: string; setCanvasTab: (tab: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!scrollRef.current || !activeSection) return
    const el = scrollRef.current.querySelector(`[data-filing-section="${activeSection}"]`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeSection])

  const draftSection = sections.find(s => s.id === "draft")
  const mainSections = sections.filter(s => s.id !== "draft")
  const isComplete = (draftSection?.progress ?? 0) >= 100
  const refundVisible = isComplete

  return (
    <div className="flex-[0_1_560px] border-l border-border bg-gray-dark-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes filing-confirmed-in {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes filing-tag-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes filing-accordion-open {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 800px; }
        }
        @keyframes filing-active-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 8px rgba(167,152,104,0.6); }
          50% { transform: scale(1.2); box-shadow: 0 0 14px rgba(167,152,104,1); }
        }
        @keyframes filing-timeline-dot-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(167,152,104,0.6); }
          50% { box-shadow: 0 0 18px rgba(167,152,104,1); }
        }
        @keyframes filing-item-slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes filing-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes filing-text-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes upload-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes extraction-dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes extraction-row-in {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 shrink-0">
        <span className="text-[18px] leading-[26px] font-medium text-white shrink-0">{isComplete ? "Overview" : "Building your return"}</span>
        {isComplete && (
          <Tabs value={canvasTab} onValueChange={setCanvasTab}>
            <SlidingTabsList value={canvasTab} className="gap-0.5">
              <TabsTrigger value="profile" className="z-[1] data-active:bg-transparent data-active:shadow-none">Profile</TabsTrigger>
              <TabsTrigger value="summary" className="z-[1] data-active:bg-transparent data-active:shadow-none">Summary</TabsTrigger>
              <TabsTrigger value="draft" className="z-[1] data-active:bg-transparent data-active:shadow-none">Draft PDF</TabsTrigger>
            </SlidingTabsList>
          </Tabs>
        )}
        <div className="flex-1" />
        {!isComplete && (
          <div className="flex items-center gap-1.5">
            <div className="relative size-3 flex items-center justify-center">
              <div className="absolute size-3 rounded-full bg-brand-400 opacity-25 animate-ping" />
              <div className="size-[5px] rounded-full bg-brand-400" />
            </div>
            <span className="text-xs text-brand-400">Live</span>
          </div>
        )}
        {isComplete && canvasTab === "draft" && (
          <Button variant="outline" size="sm" className="shrink-0 gap-1 text-[14px] leading-4 h-7 pl-2 pr-1.5">
            Download
            <Download className="size-4" />
          </Button>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4">
        {(!isComplete || canvasTab === "profile") && (
          <div className="relative max-w-[580px] mx-auto">
            <div className="absolute left-[23.5px] top-3.5 bottom-3.5 w-px bg-gray-dark-700 pointer-events-none z-0" />
            <div className="flex flex-col gap-3">
              {mainSections.map(section => (
                <div key={section.id} data-filing-section={section.id} className="relative z-[1]">
                  <FilingCanvasSection
                    section={section}
                    isOpen={isSectionOpen(section.id)}
                    isActive={activeSection === section.id}
                    activeItem={activeItem}
                    onToggle={() => onToggle(section.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {isComplete && canvasTab === "summary" && (
          <SummaryBreakdown />
        )}

        {isComplete && canvasTab === "draft" && (
          <div className="max-w-[580px] mx-auto flex flex-col gap-4">
            <div className="flex-1 min-h-[480px] bg-background border border-border rounded-lg shadow-sm px-6 py-7 flex flex-col relative">
              <div className="pb-3.5 border-b-[1.5px] border-border mb-4">
                <div className="text-[9px] uppercase tracking-[1.2px] text-muted-foreground/60 font-semibold">
                  Department of the Treasury — Internal Revenue Service
                </div>
                <div className="text-base font-semibold text-foreground/80 mt-1">Form 1040 · 2026</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">U.S. Individual Income Tax Return</div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Filing status</span><span className="text-foreground">Married Filing Jointly</span></div>
                <div className="flex justify-between"><span>Your first name and middle initial</span><span className="text-foreground">Kunal</span></div>
                <div className="flex justify-between"><span>Last name</span><span className="text-foreground">Ahuja</span></div>
                <div className="flex justify-between"><span>Home address</span><span className="text-foreground">1458 Lake Shore Drive, Apt 10B</span></div>
                <div className="flex justify-between"><span>City, state, and ZIP</span><span className="text-foreground">New York, NY 10023</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>1. Wages, salaries, tips (W-2)</span><span className="text-foreground font-mono">$185,000</span></div>
                <div className="flex justify-between"><span>2. Tax-exempt interest</span><span className="text-foreground font-mono">$0</span></div>
                <div className="flex justify-between"><span>3a. Qualified dividends</span><span className="text-foreground font-mono">$6,180</span></div>
                <div className="flex justify-between"><span>3b. Ordinary dividends</span><span className="text-foreground font-mono">$8,240</span></div>
                <div className="flex justify-between"><span>7. Capital gain or (loss)</span><span className="text-foreground font-mono">$1,240</span></div>
                <div className="flex justify-between font-medium"><span className="text-foreground">9. Total income</span><span className="text-foreground font-mono">$194,480</span></div>
              </div>
            </div>
          </div>
        )}

        {refundVisible && !isComplete && (
          <div className="mt-6 max-w-[580px] mx-auto">
            <div className="p-4 bg-gray-dark-900 border border-brand-400/30 rounded-lg">
              <Eyebrow className="text-brand-400">Estimated refund</Eyebrow>
              <div className="flex items-baseline gap-6 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Federal</div>
                  <div className="text-[24px] font-semibold text-white tracking-tight">$4,820</div>
                </div>
                <div className="w-px h-8 bg-gray-dark-700" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">California</div>
                  <div className="text-[24px] font-semibold text-white tracking-tight">$1,210</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {draftSection && !isComplete && (() => {
        const progress = draftSection.progress ?? 0
        const done = progress >= 100
        const isDraftActive = activeSection === "draft"
        return (
          <div className="p-4" data-filing-section="draft">
            <div className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-3 transition-all duration-500",
              isDraftActive ? "border-brand-400 shadow-[0_0_0_1px_rgba(167,152,104,0.13),0_8px_24px_-8px_rgba(0,0,0,0.6)]" : "border-gray-dark-700",
              "bg-[#171717]"
            )}>
              <div className={cn("size-2 rounded-full transition-colors shrink-0", isDraftActive || done ? "bg-brand-400 shadow-[0_0_8px_var(--brand-400)]" : "bg-gray-dark-500")} />
              <span className="text-[14px] leading-[22px] text-gray-dark-200 font-medium whitespace-nowrap">{draftSection.label}</span>
              <div className={cn(
                "relative flex items-center gap-1 rounded-full pl-0.5 pr-1.5 py-0.5 text-xs font-medium tabular-nums transition-colors overflow-hidden shrink-0",
                "shadow-[0px_1px_2px_rgba(8,8,8,0.2),0px_4px_4px_rgba(8,8,8,0.08)]",
                done ? "bg-brand-400 text-gray-dark-950" : "bg-brand-700"
              )}>
                <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0px_1px_1px_rgba(255,255,255,0.2),inset_0px_6px_12px_rgba(255,255,255,0.12)]" />
                <div className="relative size-3 flex items-center justify-center">
                  <div className="size-[5px] rounded-full bg-brand-400" />
                </div>
                <span className="relative text-white">{progress}%</span>
              </div>
              <span className={cn(
                "ml-auto text-xs whitespace-nowrap shrink-0",
                done ? "text-gray-dark-200" : "bg-clip-text text-transparent bg-[length:200%_100%] animate-[filing-text-shimmer_5s_ease-in-out_infinite]"
              )} style={!done ? { backgroundImage: "linear-gradient(90deg, var(--brand-300) 0%, white 25%, var(--brand-300) 50%, white 75%, var(--brand-300) 100%)" } : undefined}>
                {done ? "Review return" : "Return being prepared"}
              </span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ── FILING tab ──────────────────────────────────────────────────────────────
function FilingTab({ setTab }: { setTab: (t: string) => void }) {
  const [section, setSection] = useState("advance-tax-2026")

  const contentClass = "flex h-full min-h-0 overflow-hidden rounded-tl-xl border-t border-l border-gray-dark-700 bg-gray-dark-900"

  const triggerClass = (active: boolean) => cn(
    "relative mx-3 my-1.5 flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm whitespace-nowrap outline-none transition-colors cursor-pointer bg-transparent",
    "text-gray-dark-400 hover:bg-gray-dark-800",
    active && "font-medium bg-gray-dark-900 border-gray-dark-700 text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),inset_0_2px_2px_0_rgba(255,255,255,0.2)]",
    "before:pointer-events-none before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:rounded-r-lg before:transition-colors",
    active ? "before:bg-brand-400 before:shadow-[0_0_8px_var(--brand-400)]" : "before:bg-transparent"
  )

  return (
    <div className="flex h-full overflow-hidden gap-0">
      <div className="w-[220px] shrink-0 flex flex-col gap-0 pt-2 overflow-y-auto">
        {/* 2026 year label */}
        <span className="mx-3 mt-3 mb-0.5 px-2 py-1.5 text-sm text-gray-dark-400">2026</span>
        {/* Sub-items with connecting vertical line */}
        <div className="relative ml-[22px] flex flex-col">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-dark-700" />
          <button onClick={() => setSection("advance-tax-2026")} className={triggerClass(section === "advance-tax-2026")}>
            <span className="min-w-0 flex-1 truncate text-left">Advance payments</span>
          </button>
          <button onClick={() => setSection("filing-2026")} className={triggerClass(section === "filing-2026")}>
            <span className="min-w-0 flex-1 truncate text-left">Return filing</span>
          </button>
        </div>

        {/* 2025 & 2024 as flat tabs */}
        <button onClick={() => setSection("summary-2025")} className={cn(triggerClass(section === "summary-2025"), "mt-1")}>
          <span className="min-w-0 flex-1 truncate text-left">2025</span>
        </button>
        <button onClick={() => setSection("summary-2024")} className={triggerClass(section === "summary-2024")}>
          <span className="min-w-0 flex-1 truncate text-left">2024</span>
        </button>
      </div>
      <div className="flex-1 min-w-0 h-full">
        <div className={cn(contentClass, section !== "advance-tax-2026" && "hidden")}><AdvanceTaxPayments /></div>
        <div className={cn(contentClass, section !== "filing-2026" && "hidden")}><CurrentReturnFiling /></div>
        <div className={cn(contentClass, section !== "summary-2025" && "hidden")}><ReturnSummary year="2025" /></div>
        <div className={cn(contentClass, section !== "summary-2024" && "hidden")}><ReturnSummary year="2024" /></div>
      </div>
    </div>
  )
}

function ProfileConfirmationForm({ onConfirm }: { onConfirm?: () => void }) {
  const [confirmed, setConfirmed] = useState(false)
  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm?.()
  }
  const [form, setForm] = useState({
    firstName: "Kunal", lastName: "Ahuja",
    email: "kunalahuja@gmail.com", countryCode: "+1", phone: "469-032-5673",
    maritalStatus: "Married",
    address: "1458 Lake Shore Drive", apt: "Apt 10B",
    country: "United States", state: "New York",
    stateAbbr: "NY", zip: "10023",
  })
  const [dob, setDob] = useState<Date>(new Date(1987, 2, 9))
  const [dobOpen, setDobOpen] = useState(false)
  const upd = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const formatDob = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`

  return (
    <div className="w-full mt-3">
      <div className="rounded-xl border border-gray-dark-700 bg-gray-dark-900 p-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">First name</Label>
            <Input value={form.firstName} onChange={upd("firstName")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Last name</Label>
            <Input value={form.lastName} onChange={upd("lastName")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Email</Label>
            <Input type="email" value={form.email} onChange={upd("email")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Phone number</Label>
            <div className="flex gap-2">
              <NativeSelect value={form.countryCode} onChange={upd("countryCode")} className="w-[72px] shrink-0 [&_select]:h-10 [&_select]:bg-gray-dark-800 [&_select]:border-gray-dark-700 [&_select]:text-white">
                <NativeSelectOption value="+1">+1</NativeSelectOption>
                <NativeSelectOption value="+44">+44</NativeSelectOption>
                <NativeSelectOption value="+91">+91</NativeSelectOption>
              </NativeSelect>
              <Input type="tel" value={form.phone} onChange={upd("phone")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Date of birth</Label>
            <Popover open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger asChild>
                <button className="h-10 w-full rounded-lg border border-gray-dark-700 bg-gray-dark-800 px-2.5 py-1 text-sm text-white text-left flex items-center justify-between cursor-pointer hover:border-gray-dark-600 transition-colors">
                  {formatDob(dob)}
                  <Calendar className="size-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={dob}
                  onSelect={(d) => { if (d) { setDob(d); setDobOpen(false) } }}
                  defaultMonth={dob}
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={2010}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Marital status</Label>
            <NativeSelect value={form.maritalStatus} onChange={upd("maritalStatus")} className="w-full [&_select]:h-10 [&_select]:bg-gray-dark-800 [&_select]:border-gray-dark-700 [&_select]:text-white">
              <NativeSelectOption value="Single">Single</NativeSelectOption>
              <NativeSelectOption value="Married">Married</NativeSelectOption>
              <NativeSelectOption value="Divorced">Divorced</NativeSelectOption>
              <NativeSelectOption value="Widowed">Widowed</NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label className="text-[13px] text-muted-foreground">Address</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.address} onChange={upd("address")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
              <NativeSelect value={form.apt} onChange={upd("apt")} className="w-full [&_select]:h-10 [&_select]:bg-gray-dark-800 [&_select]:border-gray-dark-700 [&_select]:text-white">
                <NativeSelectOption value="Apt 10B">Apt 10B</NativeSelectOption>
                <NativeSelectOption value="Apt 10A">Apt 10A</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.country} onChange={upd("country")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
              <NativeSelect value={form.state} onChange={upd("state")} className="w-full [&_select]:h-10 [&_select]:bg-gray-dark-800 [&_select]:border-gray-dark-700 [&_select]:text-white">
                <NativeSelectOption value="New York">New York</NativeSelectOption>
                <NativeSelectOption value="California">California</NativeSelectOption>
                <NativeSelectOption value="Texas">Texas</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NativeSelect value={form.stateAbbr} onChange={upd("stateAbbr")} className="w-full [&_select]:h-10 [&_select]:bg-gray-dark-800 [&_select]:border-gray-dark-700 [&_select]:text-white">
                <NativeSelectOption value="NY">NY</NativeSelectOption>
                <NativeSelectOption value="CA">CA</NativeSelectOption>
                <NativeSelectOption value="TX">TX</NativeSelectOption>
              </NativeSelect>
              <Input value={form.zip} onChange={upd("zip")} className="h-10 bg-gray-dark-800 border-gray-dark-700 text-white" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          {confirmed ? (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
              <Check className="size-3.5" /> Confirmed
            </span>
          ) : (
            <Button onClick={handleConfirm} className="bg-brand-600 hover:bg-brand-500 text-white gap-1.5">
              Confirm <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function CurrentReturnFiling() {
  const [scriptIdx, setScriptIdx] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [sections, setSections] = useState<FilingSection[]>(INITIAL_FILING_SECTIONS)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [currentChips, setCurrentChips] = useState<ChipAction[]>([])
  const [manualOpen, setManualOpen] = useState<Set<string>>(new Set())
  const [canvasTab, setCanvasTab] = useState("profile")
  const pendingChipsRef = useRef<ChipAction[] | null>(null)

  useEffect(() => {
    const draft = sections.find(s => s.id === "draft")
    if ((draft?.progress ?? 0) >= 100) setCanvasTab("summary")
  }, [sections])

  useEffect(() => {
    const itemSections = sections.filter(s => s.type === "items" && s.items)
    const total = itemSections.reduce((n, s) => n + (s.items?.length ?? 0), 0)
    const confirmed = itemSections.reduce((n, s) => n + (s.items?.filter(it => it.confirmed).length ?? 0), 0)
    if (total === 0) return
    const pct = Math.round((confirmed / total) * 100)
    const draft = sections.find(s => s.id === "draft")
    if (draft && (draft.progress ?? 0) !== pct && pct <= 100) {
      setSections(prev => prev.map(s => s.id === "draft" ? { ...s, progress: pct } : s))
    }
  }, [sections])

  const confirmItem = (sectionId: string, itemId: string, tags: string[]) => {
    setSections(prev => prev.map(s =>
      s.id !== sectionId ? s : { ...s, items: s.items?.map(it => it.id === itemId ? { ...it, confirmed: true, tags } : it) }
    ))
  }

  const confirmDocsBatch = (docIds: string[], tag = "Auto-imported") => {
    setSections(prev => prev.map(s =>
      s.id !== "documents" ? s : { ...s, items: s.items?.map(it => docIds.includes(it.id) ? { ...it, confirmed: true, extracting: false, tags: [tag] } : it) }
    ))
  }

  const markDocsExtracting = (docIds: string[]) => {
    setSections(prev => prev.map(s =>
      s.id !== "documents" ? s : { ...s, items: s.items?.map(it => docIds.includes(it.id) ? { ...it, extracting: true } : it) }
    ))
  }

  const applyAdvance = (advance: FilingScriptStep["advance"]) => {
    if (!advance) return
    if (advance.activeSection !== undefined) setActiveSectionId(advance.activeSection)
    if (advance.activeItem !== undefined) setActiveItem(advance.activeItem)
    setManualOpen(new Set())
    if (advance.completeSection) {
      setSections(prev => prev.map(s => s.id === advance.completeSection ? { ...s, state: "complete" } : s))
      if (advance.openSection) {
        setTimeout(() => setActiveSectionId(advance.openSection!), 600)
      }
    }
  }

  useEffect(() => {
    if (scriptIdx >= FILING_SCRIPT.length) return
    const step = FILING_SCRIPT[scriptIdx]
    if (step.role !== "assistant") return

    if (step.confirmDocs) {
      confirmDocsBatch(step.confirmDocs, step.confirmDocsTag)
    }

    if (step.runProgress) {
      // Progress is now computed in real-time from confirmed items
    }

    if (step.runExtraction) {
      markDocsExtracting(["1099div", "1099b"])
    }

    if (step.runExtraction && step.duration) {
      // Show the message + tool call immediately, then advance after duration
      const msg: ChatMessage = { role: "assistant", body: step.text, typing: true, runExtraction: true }
      setChatMessages(prev => [...prev, msg])
      setCurrentChips([])
      const t = setTimeout(() => {
        if (step.advance) applyAdvance(step.advance)
        setScriptIdx(scriptIdx + 1)
      }, step.duration)
      return () => clearTimeout(t)
    } else if (step.duration) {
      setIsThinking(true)
      const t = setTimeout(() => {
        setIsThinking(false)
        const msg: ChatMessage = { role: "assistant", body: step.text, typing: true, showExtractionTable: step.showExtractionTable, showUpload: step.showUpload, showMultiSelect: !!step.multiSelect, multiSelectOptions: step.multiSelect?.options }
        setChatMessages(prev => [...prev, msg])
        setCurrentChips([])
        if (step.chips) pendingChipsRef.current = step.chips.map(c => ({ id: c.id, label: c.label, primary: c.primary }))
        if (step.advance) applyAdvance(step.advance)
        setScriptIdx(scriptIdx + 1)
      }, step.duration)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        const msg: ChatMessage = { role: "assistant", body: step.text, typing: true, showUpload: step.showUpload, showExtractionTable: step.showExtractionTable, showMultiSelect: !!step.multiSelect, multiSelectOptions: step.multiSelect?.options }
        setChatMessages(prev => [...prev, msg])
        setCurrentChips([])
        if (step.chips) pendingChipsRef.current = step.chips.map(c => ({ id: c.id, label: c.label, primary: c.primary }))
        if (step.advance) applyAdvance(step.advance)
        setScriptIdx(scriptIdx + 1)
      }, 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptIdx])

  const onChip = (chip: ChipAction) => {
    const nextStep = FILING_SCRIPT[scriptIdx]
    if (!nextStep || nextStep.role !== "user") return

    pendingChipsRef.current = null
    setChatMessages(prev => [...prev, { role: "user", body: nextStep.text }])
    setCurrentChips([])
    setManualOpen(new Set())

    if (nextStep.confirm) confirmItem(nextStep.confirm.sectionId, nextStep.confirm.itemId, nextStep.confirm.tags)
    if (nextStep.confirmDocs) confirmDocsBatch(nextStep.confirmDocs, nextStep.confirmDocsTag)
    if (nextStep.advance) applyAdvance(nextStep.advance)
    setScriptIdx(scriptIdx + 1)
  }

  const handleTypingComplete = useCallback(() => {
    if (pendingChipsRef.current) {
      setCurrentChips(pendingChipsRef.current)
      pendingChipsRef.current = null
    }
  }, [])

  const handleUpload = () => {
    const nextStep = FILING_SCRIPT[scriptIdx]
    if (!nextStep || nextStep.role !== "user") return
    setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, showUpload: false } : m))
    setChatMessages(prev => [...prev, { role: "user", body: "Here's the year-end statement", attachment: "Fidelity_YE_2024.pdf" }])
    setCurrentChips([])
    setManualOpen(new Set())
    if (nextStep.triggerExtraction) {
      markDocsExtracting(["1099div", "1099b"])
    }
    if (nextStep.advance) applyAdvance(nextStep.advance)
    setScriptIdx(scriptIdx + 1)
  }

  const handleConfirmExtraction = () => {
    const nextStep = FILING_SCRIPT[scriptIdx]
    if (!nextStep || nextStep.role !== "user") return
    setChatMessages(prev => [...prev, { role: "user", body: nextStep.text }])
    setCurrentChips([])
    setManualOpen(new Set())
    if (nextStep.confirm) confirmItem(nextStep.confirm.sectionId, nextStep.confirm.itemId, nextStep.confirm.tags)
    if (nextStep.confirmDocs) confirmDocsBatch(nextStep.confirmDocs, nextStep.confirmDocsTag)
    if (nextStep.advance) applyAdvance(nextStep.advance)
    setScriptIdx(scriptIdx + 1)
  }

  const handleMultiSelect = (selected: string[]) => {
    const nextStep = FILING_SCRIPT[scriptIdx]
    if (!nextStep || nextStep.role !== "user" || !nextStep.isMultiSelectResponse) return
    const responseText = selected.length > 0 ? `Selected: ${selected.join(", ")}` : "None of these apply"
    setChatMessages(prev => [...prev, { role: "user", body: responseText }])
    setCurrentChips([])
    setManualOpen(new Set())
    if (nextStep.confirm) confirmItem(nextStep.confirm.sectionId, nextStep.confirm.itemId, nextStep.confirm.tags)
    if (nextStep.advance) applyAdvance(nextStep.advance)
    setScriptIdx(scriptIdx + 1)
  }

  const handleToggle = (id: string) => {
    if (id === activeSectionId) return
    setManualOpen(prev => {
      if (prev.has(id)) return new Set()
      return new Set([id])
    })
  }

  const isSectionOpen = (id: string) => id === activeSectionId || manualOpen.has(id)

  const thinkingMessages: ChatMessage[] = isThinking ? [...chatMessages, { role: "thinking", body: "" }] : chatMessages

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="flex-1 overflow-hidden min-w-0 h-full">
        <ChatSurface
          flush
          header="2026 Return Filing"
          messages={thinkingMessages}
          chips={currentChips}
          onChip={onChip}
          placeholder="Type your answer or ask a question…"
          onTypingComplete={handleTypingComplete}
          onUpload={handleUpload}
          onConfirmExtraction={handleConfirmExtraction}
          onMultiSelect={handleMultiSelect}
        />
      </div>
      <FilingCanvas
        sections={sections}
        isSectionOpen={isSectionOpen}
        activeSection={activeSectionId}
        activeItem={activeItem}
        onToggle={handleToggle}
        canvasTab={canvasTab}
        setCanvasTab={setCanvasTab}
      />
    </div>
  )
}

type Quarter = {
  id: string; label: string; datePill: string; range: string; dueDate: string
  amount: number; federal: number; state: number; daysUntil: number; confirmed: boolean; current: boolean
}

function AdvanceTaxPayments() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { role: "assistant", body: "Hi Kunal — let's talk about your 2026 estimated payments.\n\nBased on your projected income, you owe about $81,824 across the year, split into four quarterly payments of $20,456." },
    { role: "assistant", body: "Q1 was due Apr 15. Did you make the federal ($14,531) and CA ($5,925) payments? I can record them once you confirm." },
  ])

  const [quarters, setQuarters] = useState<Quarter[]>([
    { id: "q1", label: "Q1 estimated payment", datePill: "APR 15", range: "Jan 1 - Mar 31", dueDate: "April 15, 2026", amount: 20456, federal: 14531, state: 5925, daysUntil: 23, confirmed: false, current: true },
    { id: "q2", label: "Q2 estimated payment", datePill: "JUN 15", range: "Apr 1 - May 31", dueDate: "June 15, 2026", amount: 20456, federal: 14531, state: 5925, daysUntil: 85, confirmed: false, current: false },
    { id: "q3", label: "Q3 estimated payment", datePill: "SEP 15", range: "Jun 1 - Aug 31", dueDate: "September 15, 2026", amount: 20456, federal: 14531, state: 5925, daysUntil: 177, confirmed: false, current: false },
    { id: "q4", label: "Q4 estimated payment", datePill: "JAN 15", range: "Sep 1 - Dec 31", dueDate: "January 15, 2027", amount: 20456, federal: 14531, state: 5925, daysUntil: 299, confirmed: false, current: false },
  ])

  const onConfirmInChat = (quarter: Quarter) => {
    setMsgs(prev => [
      ...prev,
      { role: "user", body: `I want to confirm my ${quarter.label}.` },
      { role: "thinking", body: "" },
    ])
    setTimeout(() => setMsgs(prev => [...prev.filter(m => m.role !== "thinking"), { role: "assistant", body: `Got it. To record your ${quarter.label} (due ${quarter.dueDate}):\n\n• Federal $${quarter.federal.toLocaleString()} — confirmation number?\n• CA state $${quarter.state.toLocaleString()} — confirmation number?\n\nPaste them here or upload the IRS / FTB receipts. I'll mark it paid once verified.`, typing: true }]), 1500)
  }

  const onChip = (c: ChipAction) => {
    if (c.id === "confirm-q1") {
      onConfirmInChat(quarters[0])
    } else if (c.id === "not-yet") {
      setMsgs(prev => [
        ...prev,
        { role: "user", body: "Not yet — can you remind me how to pay?" },
        { role: "thinking", body: "" },
      ])
      setTimeout(() => setMsgs(prev => [...prev.filter(m => m.role !== "thinking"), { role: "assistant", body: "For federal: pay via IRS Direct Pay (irs.gov/payments) using Form 1040-ES. For CA: pay via FTB Web Pay (ftb.ca.gov) using Form 540-ES. I can also generate the vouchers if you'd like to mail checks.", typing: true }]), 1500)
    } else if (c.id === "remind") {
      setMsgs(prev => [
        ...prev,
        { role: "user", body: "Yes, send me reminders." },
        { role: "thinking", body: "" },
      ])
      setTimeout(() => setMsgs(prev => [...prev.filter(m => m.role !== "thinking"), { role: "assistant", body: "Done. I'll send you reminders 15, 10, and 5 days before each quarterly due date — via email and in-app notifications.", typing: true }]), 1500)
    }
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="flex-1 overflow-hidden min-w-0 h-full">
        <ChatSurface
          flush
          header="Quarterly estimated payments"
          messages={msgs}
          chips={[
            { id: "confirm-q1", label: "Confirm my Q1 payment", primary: true },
            { id: "not-yet", label: "Not paid yet — how do I pay?" },
            { id: "remind", label: "Set up reminders" },
          ]}
          onChip={onChip}
          placeholder="Confirm a payment, ask anything…"
        />
      </div>

      <AdvanceTaxCanvas quarters={quarters} onConfirmInChat={onConfirmInChat} />
    </div>
  )
}

function AdvanceTaxCanvas({ quarters, onConfirmInChat }: {
  quarters: Quarter[]; onConfirmInChat: (q: Quarter) => void
}) {
  const initialExpanded = quarters.find(q => q.current)?.id || quarters[0].id
  const [expandedId, setExpandedId] = useState(initialExpanded)
  const totalEstimate = quarters.reduce((a, q) => a + q.amount, 0)

  return (
    <div className="flex-[0_1_560px] border-l border-border bg-gray-dark-950 p-4 overflow-y-auto flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[18px] leading-7 font-medium text-foreground">Estimated payments</span>
        <span className="text-base text-muted-foreground">·</span>
        <span className="text-base font-medium text-foreground/80 tabular-nums">
          ${totalEstimate.toLocaleString()} total
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {quarters.map((q) => (
          <QuarterCard
            key={q.id}
            q={q}
            expanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? "" : q.id)}
            onConfirm={() => onConfirmInChat(q)}
          />
        ))}
      </div>
    </div>
  )
}

function QuarterCard({ q, expanded, onToggle, onConfirm }: {
  q: Quarter; expanded: boolean; onToggle: () => void; onConfirm: () => void
}) {
  return (
    <div className="bg-gray-dark-800 border border-gray-dark-700 rounded-[10px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 bg-transparent border-none cursor-pointer flex items-center gap-3 text-left hover:bg-gray-dark-800 transition-colors"
      >
        <Badge variant="outline" className="bg-brand-500/15 text-brand-400 border-transparent rounded-md px-2.5 py-1.5 text-[11px] font-medium tracking-wider tabular-nums shrink-0">
          {q.datePill}
        </Badge>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{q.label}</span>
            {q.current && !q.confirmed && (
              <Badge className="bg-red-50 text-red-700 border-transparent rounded-full text-[10px] font-semibold tracking-wider">
                {q.daysUntil} DAYS
              </Badge>
            )}
            {q.confirmed && (
              <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Paid</span>
            )}
          </div>
        </div>
        <div className="text-base font-medium text-foreground tabular-nums">
          ${q.amount.toLocaleString()}
        </div>
        <span className={cn(
          "text-muted-foreground text-[11px] leading-none ml-1 transition-transform",
          expanded ? "rotate-180" : "rotate-0"
        )}>▾</span>
      </button>

      {expanded && (
        <div className="border-t border-border bg-card">
          <VoucherRow label="Federal" form="Form 1040-ES" amount={q.federal} />
          <VoucherRow label="California" form="Form 540-ES" amount={q.state} divider />
          <div className="flex justify-end items-center px-4 py-3 bg-background text-xs text-muted-foreground">
            {!q.confirmed && (
              <span>
                Made the payment?{" "}
                <button
                  onClick={onConfirm}
                  className="text-xs bg-transparent border-none text-foreground font-medium cursor-pointer underline p-0"
                >
                  Confirm here
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function VoucherRow({ label, form, amount, divider }: {
  label: string; form: string; amount: number; divider?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-3.5 px-4 py-3",
      divider && "border-t border-border"
    )}>
      <div className="w-0.5 h-4.5 bg-foreground/60 shrink-0" />
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{form}</span>
      </div>
      <div className="text-sm font-medium text-foreground tabular-nums">
        ${amount.toLocaleString()}
      </div>
      <Button variant="outline" size="xs" className="rounded-full gap-1.5">
        Download voucher
        <Download className="size-[11px]" />
      </Button>
    </div>
  )
}

// Return Summary
const PRIOR_YEAR_DATA: Record<string, {
  summary: { income: string; tax: string; refund: number; isRefund: boolean }
  chat: ChatMessage[]
  chips: ChipAction[]
}> = {
  "2025": {
    summary: { income: "$472,000", tax: "$118,400", refund: 2140, isRefund: true },
    chat: [
      { role: "assistant", body: "Let's start your 2025 return. Are you filing as Single, Married, or Head of Household?" },
      { role: "user", body: "Married filing jointly again." },
      { role: "assistant", body: "Got it. Same dependents as last year — your two children?" },
      { role: "user", body: "Yes, same two." },
      { role: "assistant", body: "Please upload your W-2 and any 1099 forms." },
      { role: "user", body: "Uploading.", attachment: "W2_2025.pdf" },
      { role: "assistant", body: "I see wages of $268,000 and another $204,000 from your spouse. With the standard deduction and your federal withholding of $58,200, you're looking at a refund." },
      { role: "user", body: "Sounds right. Let's finalize." },
      { role: "assistant", body: "Done. Your 2025 return was filed on April 8, 2026 and accepted by the IRS.\n\nSummary\nFiling status: Married Filing Jointly\nTotal income: $472,000\nFederal tax: $118,400\nRefund: $2,140 (deposited Apr 22, 2026)\n\nAsk me anything about this return — I have full context." },
    ],
    chips: [
      { id: "why-refund", label: "Why was my refund so small?" },
      { id: "compare", label: "Compare to my 2024 return" },
      { id: "amend", label: "Do I need to amend anything?" },
    ],
  },
  "2024": {
    summary: { income: "$398,000", tax: "$92,800", refund: 1890, isRefund: true },
    chat: [
      { role: "assistant", body: "Welcome to your 2024 return. First time filing with Thrive?" },
      { role: "user", body: "Yes, first time." },
      { role: "assistant", body: "Great. I'll guide you through. Filing status?" },
      { role: "user", body: "Married filing jointly. Two kids." },
      { role: "assistant", body: "Please upload your W-2s and any other income forms." },
      { role: "user", body: "Uploading both.", attachment: "W2_2024_combined.pdf" },
      { role: "assistant", body: "Got it. $398,000 combined household income. Any charitable contributions or mortgage interest?" },
      { role: "user", body: "Yes — $24,000 mortgage interest, $8,000 to a DAF." },
      { role: "assistant", body: "Itemizing makes sense for you. Federal tax comes to $92,800 after deductions and credits." },
      { role: "assistant", body: "Your 2024 return was filed on April 12, 2025 and accepted.\n\nSummary\nFiling status: Married Filing Jointly\nTotal income: $398,000\nFederal tax: $92,800\nRefund: $1,890 (deposited Apr 28, 2025)\n\nAsk me anything about this return — I have full context." },
    ],
    chips: [
      { id: "deductions", label: "What deductions did I take?" },
      { id: "compare", label: "How does this compare to 2025?" },
      { id: "documents", label: "Show me my documents" },
    ],
  },
}

function ReturnSummary({ year }: { year: string }) {
  const data = PRIOR_YEAR_DATA[year]
  if (!data) {
    return (
      <div className="px-4 py-4">
        <Eyebrow>Return Summary</Eyebrow>
        <div className="text-base text-muted-foreground mt-3">No data available for {year}.</div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="flex-1 overflow-hidden min-w-0 h-full">
        <ChatSurface
          flush
          header={`Your ${year} return`}
          messages={data.chat}
          chips={data.chips}
          onChip={() => {}}
          placeholder={`Ask about your ${year} return…`}
        />
      </div>
      <PdfPreviewPanel year={year} />
    </div>
  )
}

function PdfPreviewPanel({ year }: { year: string }) {
  const yearDocs = DOCUMENTS_HUB.filter(d => d.year === year && d.name !== `Form_1040_${year}.pdf`)
  const [previewTab, setPreviewTab] = useState("1040")

  return (
    <div className="flex-[0_1_560px] border-l border-border bg-gray-dark-950 overflow-y-auto flex flex-col">
      <Tabs value={previewTab} onValueChange={setPreviewTab} className="flex flex-col h-full gap-0">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0">
          <div className="text-[18px] leading-7 font-medium text-foreground shrink-0">Preview</div>
          <SlidingTabsList value={previewTab} className="gap-0.5">
            <TabsTrigger value="1040" className="z-[1] data-active:bg-transparent data-active:shadow-none">1040 PDF</TabsTrigger>
            <TabsTrigger value="docs" className="z-[1] data-active:bg-transparent data-active:shadow-none">Other documents</TabsTrigger>
          </SlidingTabsList>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="shrink-0 gap-1 text-[14px] leading-4 h-7 pl-2 pr-1.5">
            Download
            <Download className="size-4" />
          </Button>
        </div>

        <TabsContent value="1040" className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">

          <div className="flex-1 min-h-[480px] bg-background border border-border rounded-lg shadow-sm px-6 py-7 flex flex-col relative">
            <div className="pb-3.5 border-b-[1.5px] border-border mb-4">
              <div className="text-[9px] uppercase tracking-[1.2px] text-muted-foreground/60 font-semibold">
                Department of the Treasury — Internal Revenue Service
              </div>
              <div className="text-base font-semibold text-foreground/80 mt-1">Form 1040 · {year}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">U.S. Individual Income Tax Return</div>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
              {[55, 80, 65, 90, 70, 85, 50, 75, 60].map((w, i) => (
                <Skeleton key={i} className="h-2" style={{ width: `${w}%` }} />
              ))}
            </div>

            <div className="mt-5 pt-3.5 border-t border-border flex items-center gap-2.5">
              <Badge variant="outline" className="text-emerald-600 border-emerald-600 rounded text-[10px] font-semibold uppercase tracking-[1px] -rotate-2">
                Accepted
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                Filed {year === "2025" ? "Apr 8, 2026" : "Apr 12, 2025"}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground/60 text-center py-1">
            Click download to get the full PDF
          </div>
        </TabsContent>

        <TabsContent value="docs" className="flex-1 overflow-y-auto px-4 pb-4">
          {yearDocs.length === 0 ? (
            <div className="py-10 px-6 text-center bg-card border border-border rounded-[10px]">
              <div className="text-sm font-medium text-foreground mb-1.5">No documents for {year}</div>
              <div className="text-[13px] text-muted-foreground">Documents will appear here once uploaded.</div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-[10px] overflow-hidden">
              {yearDocs.map((d, i, arr) => (
                <div
                  key={d.name}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5",
                    i < arr.length - 1 && "border-b border-border"
                  )}
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground font-medium truncate">{d.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{d.desc}</div>
                  </div>
                  <button className="shrink-0 size-7 rounded-md hover:bg-gray-dark-700 transition-colors grid place-items-center border-none bg-transparent cursor-pointer" aria-label={`Download ${d.name}`}>
                    <Download className="size-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── DocumentsHub ────────────────────────────────────────────────────────────
const DOC_TYPES = ["All", "Forms", "Schedules", "Statements", "Receipts"]

const DOCUMENTS_HUB = [
  { name: "W2_2026.pdf", desc: "Wages from Tech Corp · uploaded Mar 12", year: "2026", irsType: "Forms", status: "received" },
  { name: "Vanguard_1099-DIV_2026.pdf", desc: "Dividend statement · uploaded Mar 18", year: "2026", irsType: "Statements", status: "received" },
  { name: "1099-NECs", desc: "Freelance income", year: "2026", irsType: "Forms", status: "queued" },
  { name: "1098_Mortgage_2026.pdf", desc: "Mortgage interest", year: "2026", irsType: "Forms", status: "queued" },
  { name: "Schedule_A_2026_draft.pdf", desc: "Itemized deductions (draft)", year: "2026", irsType: "Schedules", status: "queued" },
  { name: "Schedule_E_2026_draft.pdf", desc: "Rental income (draft)", year: "2026", irsType: "Schedules", status: "queued" },
  { name: "Coinbase_2026.csv", desc: "Crypto transaction history", year: "2026", irsType: "Statements", status: "queued" },
  { name: "Fidelity_RSU_2026.pdf", desc: "RSU vest statements", year: "2026", irsType: "Statements", status: "queued" },
  { name: "DAF_contributions_2026.pdf", desc: "Donor-Advised Fund letter", year: "2026", irsType: "Receipts", status: "queued" },
  { name: "Form_1040_2025.pdf", desc: "Filed return", year: "2025", irsType: "Forms", status: "received" },
  { name: "W2_2025_Kunal.pdf", desc: "Wages from Tech Corp", year: "2025", irsType: "Forms", status: "received" },
  { name: "W2_2025_Spouse.pdf", desc: "Spouse W-2", year: "2025", irsType: "Forms", status: "received" },
  { name: "1098_Mortgage_2025.pdf", desc: "Mortgage interest paid", year: "2025", irsType: "Forms", status: "received" },
  { name: "Form_8879_2025.pdf", desc: "E-file authorization", year: "2025", irsType: "Forms", status: "received" },
  { name: "Schedule_A_2025.pdf", desc: "Itemized deductions", year: "2025", irsType: "Schedules", status: "received" },
  { name: "Schedule_B_2025.pdf", desc: "Interest & dividends", year: "2025", irsType: "Schedules", status: "received" },
  { name: "Schedule_D_2025.pdf", desc: "Capital gains & losses", year: "2025", irsType: "Schedules", status: "received" },
  { name: "Schedule_E_2025.pdf", desc: "Rental property income", year: "2025", irsType: "Schedules", status: "received" },
  { name: "Fidelity_1099-B_2025.pdf", desc: "Brokerage capital gains", year: "2025", irsType: "Statements", status: "received" },
  { name: "Fidelity_1099-DIV_2025.pdf", desc: "Dividend statement", year: "2025", irsType: "Statements", status: "received" },
  { name: "Chase_1099-INT_2025.pdf", desc: "Interest income", year: "2025", irsType: "Statements", status: "received" },
  { name: "RSU_vest_statement_2025.pdf", desc: "Tech Corp RSU vests", year: "2025", irsType: "Statements", status: "received" },
  { name: "DAF_letter_2025.pdf", desc: "Donor-Advised Fund contributions", year: "2025", irsType: "Receipts", status: "received" },
  { name: "Property_tax_receipt_2025.pdf", desc: "CA property tax paid", year: "2025", irsType: "Receipts", status: "received" },
  { name: "Form_1040_2024.pdf", desc: "Filed return", year: "2024", irsType: "Forms", status: "received" },
  { name: "W2_2024_combined.pdf", desc: "W-2s (combined upload)", year: "2024", irsType: "Forms", status: "received" },
  { name: "1098_Mortgage_2024.pdf", desc: "Mortgage interest paid", year: "2024", irsType: "Forms", status: "received" },
  { name: "Form_8879_2024.pdf", desc: "E-file authorization", year: "2024", irsType: "Forms", status: "received" },
  { name: "Schedule_A_2024.pdf", desc: "Itemized deductions", year: "2024", irsType: "Schedules", status: "received" },
  { name: "Schedule_B_2024.pdf", desc: "Interest & dividends", year: "2024", irsType: "Schedules", status: "received" },
  { name: "Vanguard_1099-DIV_2024.pdf", desc: "Dividend statement", year: "2024", irsType: "Statements", status: "received" },
  { name: "Chase_1099-INT_2024.pdf", desc: "Interest income", year: "2024", irsType: "Statements", status: "received" },
  { name: "DAF_letter_2024.pdf", desc: "DAF contribution receipts", year: "2024", irsType: "Receipts", status: "received" },
]

function DocStatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    received: { label: "Received", cls: "bg-emerald-500/15 text-emerald-400" },
    queued: { label: "Queued", cls: "bg-gray-dark-700 text-gray-dark-200" },
    pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-400" },
  }
  const { label, cls } = map[status] ?? map.queued
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-4", cls)}>
      {label}
    </span>
  )
}

function DocumentsHub({ setTab }: { setTab: (t: string) => void }) {
  const years = ["2026", "2025", "2024"]
  const [activeYear, setActiveYear] = useState("2026")
  const [activeType, setActiveType] = useState("All")
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const handleYearChange = (y: string) => {
    setActiveYear(y)
    setActiveType("All")
  }

  const yearDocs = DOCUMENTS_HUB.filter(d => d.year === activeYear)
  const typeCounts = DOC_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = t === "All" ? yearDocs.length : yearDocs.filter(d => d.irsType === t).length
    return acc
  }, {})

  const visibleDocs = activeType === "All" ? yearDocs : yearDocs.filter(d => d.irsType === activeType)

  useEffect(() => {
    if (!selectedName) return
    const stillVisible = visibleDocs.some(d => d.name === selectedName)
    if (!stillVisible) setSelectedName(null)
  }, [activeYear, activeType, visibleDocs.length, selectedName])

  const selected = visibleDocs.find(d => d.name === selectedName) || null
  const previewOpen = !!selected
  const showPill = (d: typeof DOCUMENTS_HUB[number]) => !(d.year === "2026" && d.status !== "received")

  return (
    <div className={cn(
      "flex h-full overflow-hidden",
      previewOpen && "[&>.docs-content]:flex-1"
    )}>
      <SideNavBarTabs
        value={activeYear}
        onValueChange={handleYearChange}
        className="shrink-0"
      >
        <SideNavBarTabsList variant="default" className="w-[220px] [&_svg]:hidden">
          {years.map((y) => (
            <SideNavBarTabsTrigger key={y} value={y}>{y}</SideNavBarTabsTrigger>
          ))}
        </SideNavBarTabsList>
      </SideNavBarTabs>

      <div className="docs-content flex h-full overflow-hidden min-w-0 flex-1 rounded-tl-xl border-t border-l border-gray-dark-700 bg-gray-dark-900">
        <div className="flex flex-col h-full overflow-hidden min-w-0 flex-1">
          <div className="px-4 pt-4 shrink-0">
            <h1 className="text-[18px] leading-7 font-medium m-0 mb-6 tracking-tight text-foreground">
              {activeYear} documents
            </h1>


            <Tabs value={activeType} onValueChange={setActiveType}>
              <SlidingTabsList value={activeType} className="mb-4">
                {DOC_TYPES.map((t) => (
                  <TabsTrigger key={t} value={t} className="gap-1.5 z-[1] data-active:bg-transparent data-active:shadow-none">
                    {t}
                    <span className="inline-flex items-center justify-center rounded-[4px] bg-gray-dark-700 px-1 py-0.5 text-[10px] leading-3 font-normal text-[#fffef9] min-w-4 text-center">
                      {typeCounts[t]}
                    </span>
                  </TabsTrigger>
                ))}
              </SlidingTabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {visibleDocs.length === 0 ? (
              <div className="py-10 px-6 text-center bg-card border border-border rounded-[10px]">
                <div className="text-sm font-medium text-foreground mb-1.5">
                  No {activeType.toLowerCase()} for {activeYear}
                </div>
                <div className="text-[13px] text-muted-foreground max-w-[360px] mx-auto">
                  Documents in this category will show up here once they're added.
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-[10px] overflow-hidden">
                {visibleDocs.map((d, i, arr) => {
                  const isSelected = selectedName === d.name
                  return (
                    <div
                      key={d.name}
                      onClick={() => setSelectedName(d.name)}
                      className={cn(
                        "flex items-center gap-3.5 px-4.5 py-3.5 cursor-pointer transition-colors",
                        i < arr.length - 1 && "border-b border-border",
                        isSelected ? "bg-gray-dark-950" : "hover:bg-muted/50"
                      )}
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground font-medium truncate">{d.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                          <span>{d.desc}</span>
                          {activeType === "All" && (
                            <>
                              <span className="text-muted-foreground/60">·</span>
                              <span className="text-muted-foreground/60">{d.irsType}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {showPill(d) && <DocStatusPill status={d.status} />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {previewOpen && (
          <div className="w-[540px] shrink-0 border-l border-border bg-background overflow-y-auto p-4">
            <DocPreviewPanel doc={selected!} onClose={() => setSelectedName(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

function DocPreviewPanel({ doc, onClose }: {
  doc: typeof DOCUMENTS_HUB[number]; onClose: () => void
}) {
  const isReceived = doc.status === "received"
  const isQueued = doc.status === "queued"

  return (
    <div>
      <div className="flex justify-between items-start gap-3 mb-3.5">
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium text-foreground mb-1 truncate">{doc.name}</div>
          <div className="text-xs text-muted-foreground">{doc.desc}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isReceived && (
            <Button variant="outline" size="sm" className="gap-1 text-[14px] leading-4 h-7 pl-2 pr-1.5">
              Download
              <Download className="size-4" />
            </Button>
          )}
          <button onClick={onClose} className="shrink-0 size-7 rounded-md bg-gray-dark-700 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors grid place-items-center" aria-label="Close preview">
            <X className="size-4 text-white" />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 min-h-[460px] relative overflow-hidden">
        {isReceived ? (
          <>
            <div className="border-b border-border pb-3.5 mb-4.5">
              <Skeleton className="h-2 w-[30%] mb-1.5" />
              <Skeleton className="h-1.5 w-[60%]" />
            </div>
            {[80, 65, 90, 55, 75, 88, 50, 70, 92, 60, 78].map((w, i) => (
              <Skeleton key={i} className="h-[5px] mb-2.5" style={{ width: `${w}%` }} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-5">
            <div className="size-14 rounded-full bg-brand-500/15 flex items-center justify-center mb-4 text-2xl">
              {isQueued ? "📥" : "⏳"}
            </div>
            <div className="text-sm font-medium text-foreground mb-1.5">
              {isQueued ? "Not yet received" : "We're waiting on this"}
            </div>
            <div className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
              {isQueued
                ? "I'll request this once it's available from your provider."
                : "Upload through the filing chat or I'll fetch it for you."}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Notification Panel ──────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: "1",
    title: "Q2 estimated tax payment",
    subtitle: "2026 estimated federal tax",
    meta: "$3,200",
    action: "Continue to pay",
    category: "filing",
  },
  {
    id: "2",
    title: "Confirm Indian rental income",
    subtitle: "Helps with FTC strategy worth $3,640",
    action: "Continue",
    category: "planning",
  },
  {
    id: "3",
    title: "Confirm Indian rental income",
    subtitle: "Helps with FTC strategy worth $3,640",
    action: "Continue",
    category: "planning",
  },
]

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifTab, setNotifTab] = useState("all")
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const timer = setTimeout(() => setVisible(true), 20)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  const filtered = notifTab === "all"
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter(n => n.category === notifTab)

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-[8px] transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel — slides in from right, positioned 16px from top/bottom/right */}
      <div className={cn(
        "absolute right-4 top-4 bottom-4 w-[480px] bg-gray-dark-900 border border-gray-dark-700 rounded-2xl p-5 flex flex-col gap-6 overflow-hidden transition-transform duration-300 ease-out",
        visible ? "translate-x-0" : "translate-x-[calc(100%+16px)]"
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] z-10 shrink-0 size-6 rounded-md bg-gray-dark-700 p-1 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors grid place-items-center"
        >
          <X className="size-4 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-2">
          <span className="text-[14px] font-medium leading-4 text-white">Notifications</span>
          <div className="flex items-center gap-1 rounded-3xl">
            <span className="relative size-4 grid place-items-center">
              <span className="absolute size-2 rounded-full bg-[#f04438]" />
              <span className="absolute size-2 rounded-full bg-[#f04438] animate-ping opacity-75" />
            </span>
            <span className="text-[14px] leading-4 text-[#fda29b]">{NOTIFICATIONS.length} pending items</span>
          </div>
        </div>

        {/* Tabs — same pattern as strategy tabs */}
        <Tabs value={notifTab} onValueChange={setNotifTab} className="flex flex-col gap-6">
          {/* Tabs list hidden */}

          {/* Notification items */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1">
            {filtered.map((n, i) => (
              <React.Fragment key={n.id + i}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="text-[14px] font-medium leading-5 text-white">{n.title}</div>
                    <div className="text-[12px] leading-4 text-gray-dark-100 flex items-center gap-1">
                      <span>{n.subtitle}</span>
                      {n.meta && (
                        <>
                          <span className="text-gray-dark-100">·</span>
                          <span>{n.meta}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="shrink-0 text-[14px] leading-4 text-[#3e9ef3] cursor-pointer border-none bg-transparent hover:underline">
                    {n.action}
                  </button>
                </div>
                {i < filtered.length - 1 && <Separator className="bg-gray-dark-700" />}
              </React.Fragment>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

// ── ProfilePage ─────────────────────────────────────────────────────────────
function ProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [profileTab, setProfileTab] = useState<"personal" | "tax" | "security">("personal")
  const [twoFaOn, setTwoFaOn] = useState(true)

  const sidebarItems: { key: typeof profileTab; label: string; icon: React.ReactNode }[] = [
    { key: "personal", label: "Personal information", icon: <UserAccount className="size-4 shrink-0" /> },
    { key: "tax", label: "Tax profile", icon: <CoinsDollar className="size-4 shrink-0" /> },
    { key: "security", label: "Profile security", icon: <SecurityLock className="size-4 shrink-0" /> },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="!bg-gray-dark-950 border border-gray-dark-700 rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.16)] !p-0 !max-w-[680px] !w-[680px] !gap-0 !ring-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Profile settings</DialogTitle>
        <div className="relative flex h-[480px]">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-[11px] right-[11px] z-10 shrink-0 size-6 rounded-md bg-gray-dark-700 p-1 cursor-pointer border-none hover:bg-gray-dark-600 transition-colors grid place-items-center"
          >
            <X className="size-4 text-white" />
          </button>

          {/* Left sidebar */}
          <div className="w-[200px] shrink-0 bg-card rounded-l-[9px] m-[3px] mr-0 drop-shadow-[0px_0px_1.5px_rgba(0,0,0,0.2)]">
            <div className="relative flex flex-col gap-1.5 p-1.5">
              {/* Sliding active background */}
              <div
                className="absolute left-1.5 right-1.5 h-8 rounded-lg bg-gray-dark-900 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.2)] transition-all duration-200 ease-out"
                style={{ top: `${6 + sidebarItems.findIndex(i => i.key === profileTab) * 38}px` }}
              />
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setProfileTab(item.key)}
                  className={cn(
                    "relative z-[1] flex items-center gap-1.5 w-full px-[6px] py-1.5 rounded-lg text-[14px] leading-5 text-left cursor-pointer border-none transition-colors",
                    profileTab === item.key
                      ? "text-white"
                      : "text-gray-dark-200 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 flex flex-col min-w-0 pt-[15px] pl-[16px] pr-[15px]">
            {/* Tab title */}
            <div className="text-[14px] font-medium leading-[22px] text-white mb-[20px]">
              {profileTab === "personal" && "Profile information"}
              {profileTab === "tax" && "Tax profile"}
              {profileTab === "security" && "Profile security"}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {profileTab === "personal" && (
                <div className="flex flex-col items-center gap-8 w-[444px]">
                  {/* Avatar */}
                  <div className="relative size-[112px]">
                    <div className="size-[112px] rounded-full bg-gray-dark-800 border border-gray-dark-700 grid place-items-center">
                      <User03 className="size-16 text-gray-dark-100" />
                    </div>
                    <div className="absolute bottom-0 right-0 size-7 rounded-full bg-gray-dark-700 border border-gray-dark-600 grid place-items-center">
                      <ImageUpload className="size-3.5 text-white" />
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                      <Label className="px-1 text-[14px] text-white">Name</Label>
                      <Input
                        readOnly
                        defaultValue="John Doe"
                        className="h-10 rounded-xl bg-gray-dark-800 border-gray-dark-700 px-3 text-[14px] text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="px-1 text-[14px] text-white">Email</Label>
                      <Input
                        readOnly
                        defaultValue="johndoe@example.com"
                        className="h-10 rounded-xl bg-gray-dark-800 border-gray-dark-700 px-3 text-[14px] text-white"
                      />
                    </div>
                  </div>

                  {/* Edit button — bottom right */}
                  <div className="flex justify-end w-full mt-auto">
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl text-[14px]">
                      Edit information
                    </Button>
                  </div>
                </div>
              )}

              {profileTab === "tax" && (
                <div className="flex flex-col gap-4 w-[444px]">
                  {[
                    { label: "Filing status", value: "Married filing jointly" },
                    { label: "Resident state", value: "California" },
                    { label: "Dependents", value: "Two" },
                    { label: "NRI status", value: "Resident alien" },
                  ].map((field) => (
                    <div key={field.label} className="flex flex-col gap-2">
                      <Label className="px-1 text-[14px] text-white">{field.label}</Label>
                      <Input
                        readOnly
                        defaultValue={field.value}
                        className="h-10 rounded-xl bg-gray-dark-800 border-gray-dark-700 px-3 text-[14px] font-medium text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "security" && (
                <div className="flex flex-col gap-4 w-full max-w-[444px]">
                  {/* Email */}
                  <div className="flex items-center gap-12">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="text-[16px] font-semibold leading-6 text-white">Email</div>
                      <div className="text-[12px] leading-4 text-gray-dark-200">kunalahuja@gmail.com</div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 h-8 pl-3 pr-2 rounded-lg gap-1 text-[14px]">
                      Change email
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  <Separator className="bg-gray-dark-700" />

                  {/* Password */}
                  <div className="flex items-center gap-12">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="text-[16px] font-semibold leading-6 text-white">Password</div>
                      <div className="text-[12px] leading-4 text-gray-dark-200">************</div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 h-8 pl-3 pr-2 rounded-lg gap-1 text-[14px]">
                      Update password
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  <Separator className="bg-gray-dark-700" />

                  {/* Logout everywhere */}
                  <div className="flex items-center gap-12">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="text-[16px] font-semibold leading-6 text-white">Logout everywhere</div>
                      <div className="text-[12px] leading-4 text-gray-dark-200">If you notice any suspicious activity, log out from all devices and browsers.</div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 h-8 pl-3 pr-2 rounded-lg gap-1 text-[14px]">
                      Logout
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  <Separator className="bg-gray-dark-700" />

                  {/* 2FA toggle */}
                  <div className="flex items-center gap-12">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="text-[16px] font-semibold leading-6 text-white">2-factor authentication</div>
                      <div className="text-[12px] leading-4 text-gray-dark-200">Status: {twoFaOn ? "On" : "Off"}</div>
                    </div>
                    <Switch
                      checked={twoFaOn}
                      onCheckedChange={setTwoFaOn}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── app ─────────────────────────────────────────────────────────────────────
export default function ThriveV15() {
  const [tab, setTab] = useState("home")
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [action, setAction] = useState<ActionItem | null>(null)
  const [states, setStates] = useState(initialStates)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [chats, setChats] = useState<ChatStore>({})
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const handleSetTab = (t: string) => {
    if (t === "profile") {
      setProfileOpen(true)
      return
    }
    setTab(t)
  }

  const goHome = () => {
    setTab("home")
    setAction(null)
    setActiveChatId(null)
  }

  const onComplete = (actionId: string) => {
    setCompletedIds(prev => prev.includes(actionId) ? prev : [...prev, actionId])
  }

  const onAdvance = (nextAction: ActionItem) => {
    setAction(nextAction)
  }

  const savings = useMemo(() => {
    const inPlan = STRATEGIES.filter(s => s.personalized && states[s.id] !== "SKIPPED")
    return {
      total: inPlan.reduce((a, s) => a + (s.savings || 0), 0),
      count: inPlan.length,
    }
  }, [states])

  return (
    <div
      className="h-screen overflow-hidden flex flex-col bg-gray-dark-900 text-foreground"
      style={{
        backgroundImage: "url('/noise-grain.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "2269px 2269px",
        backgroundBlendMode: "overlay",
      }}
    >
      <TopNav
        tab={tab} setTab={handleSetTab}
        onGoHome={goHome}
        activeChatId={activeChatId}
        onClickHomeTab={goHome}
        onNotifOpen={() => setNotifOpen(true)}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "home" && (
          <HomeTab
            openAction={setAction}
            action={action}
            setAction={setAction}
            savings={savings}
            completedIds={completedIds}
            onAdvance={onAdvance}
            onComplete={onComplete}
            chats={chats}
            setChats={setChats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onGoToPlanning={() => handleSetTab("planning")}
            onGoToFiling={() => handleSetTab("filing")}
            setTab={handleSetTab}
          />
        )}
        {tab === "planning" && <PlanningTab states={states} setStates={setStates} setTab={handleSetTab} />}
        {tab === "filing" && <FilingTab setTab={handleSetTab} />}
        {tab === "documents" && <DocumentsHub setTab={handleSetTab} />}
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  )
}
