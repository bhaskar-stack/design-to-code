"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "@/components/icons"

// ---------------------------------------------------------------------------
// Single date picker
// ---------------------------------------------------------------------------

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Restrict the selectable range. */
  fromDate?: Date
  toDate?: Date
  /** date-fns format token. Default `"PPP"` ("April 5, 2026"). */
  formatStr?: string
  /** Calendar caption layout: "label" | "dropdown" | "dropdown-months" | "dropdown-years". */
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  disabled,
  className,
  fromDate,
  toDate,
  formatStr = "PPP",
  captionLayout = "label",
}: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const handleSelect = (next: Date | undefined) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const dayDisabled = React.useMemo(() => {
    if (!fromDate && !toDate) return undefined
    return (d: Date) => {
      if (fromDate && d < fromDate) return true
      if (toDate && d > toDate) return true
      return false
    }
  }, [fromDate, toDate])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-slot="date-picker-trigger"
          className={cn(
            "h-10 w-[260px] justify-between font-normal",
            !current && "text-muted-foreground",
            className
          )}
        >
          {current ? format(current, formatStr) : placeholder}
          <CalendarIcon className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={current}
          onSelect={handleSelect}
          disabled={dayDisabled}
          captionLayout={captionLayout}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// Date range picker (with optional presets)
// ---------------------------------------------------------------------------

export type DateRangePreset = {
  label: string
  value: DateRange
}

export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  numberOfMonths?: number
  fromDate?: Date
  toDate?: Date
  /** Optional preset list (rendered as a left rail in the popover). */
  presets?: DateRangePreset[]
}

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date range",
  disabled,
  className,
  numberOfMonths = 2,
  fromDate,
  toDate,
  presets,
}: DateRangePickerProps) {
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    defaultValue
  )
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const handleSelect = (next: DateRange | undefined) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const dayDisabled = React.useMemo(() => {
    if (!fromDate && !toDate) return undefined
    return (d: Date) => {
      if (fromDate && d < fromDate) return true
      if (toDate && d > toDate) return true
      return false
    }
  }, [fromDate, toDate])

  const label = (() => {
    if (!current?.from) return placeholder
    if (!current.to) return format(current.from, "PPP")
    return `${format(current.from, "MMM d, yyyy")} – ${format(
      current.to,
      "MMM d, yyyy"
    )}`
  })()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-slot="date-range-picker-trigger"
          className={cn(
            "h-10 w-[300px] justify-between font-normal",
            !current?.from && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{label}</span>
          <CalendarIcon className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto p-0">
        {presets && presets.length > 0 && (
          <div className="flex w-[140px] flex-col gap-0.5 border-r p-2">
            {presets.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handleSelect(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        )}
        <Calendar
          mode="range"
          selected={current}
          onSelect={handleSelect}
          numberOfMonths={numberOfMonths}
          disabled={dayDisabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// Multiple-date picker
// ---------------------------------------------------------------------------

export interface MultiDatePickerProps {
  value?: Date[]
  defaultValue?: Date[]
  onValueChange?: (dates: Date[] | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Maximum dates selectable. */
  max?: number
}

export function MultiDatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick dates",
  disabled,
  className,
  max,
}: MultiDatePickerProps) {
  const [internal, setInternal] = React.useState<Date[] | undefined>(
    defaultValue
  )
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const handleSelect = (next: Date[] | undefined) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const label =
    current && current.length > 0
      ? current.length === 1
        ? format(current[0], "PPP")
        : `${current.length} dates selected`
      : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-slot="multi-date-picker-trigger"
          className={cn(
            "h-10 w-[260px] justify-between font-normal",
            (!current || current.length === 0) && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{label}</span>
          <CalendarIcon className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="multiple"
          selected={current}
          onSelect={handleSelect}
          max={max}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// Date + time picker
// ---------------------------------------------------------------------------

export interface DateTimePickerProps {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date & time",
  disabled,
  className,
}: DateTimePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const update = (next: Date | undefined) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const handleDayChange = (day: Date | undefined) => {
    if (!day) return update(undefined)
    // Carry over the existing time-of-day, or default to 09:00.
    const next = new Date(day)
    if (current) {
      next.setHours(current.getHours(), current.getMinutes(), 0, 0)
    } else {
      next.setHours(9, 0, 0, 0)
    }
    update(next)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hStr, mStr] = e.target.value.split(":")
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr, 10)
    if (Number.isNaN(h) || Number.isNaN(m)) return
    const next = current ? new Date(current) : new Date()
    next.setHours(h, m, 0, 0)
    update(next)
  }

  const timeStr = current
    ? `${String(current.getHours()).padStart(2, "0")}:${String(
        current.getMinutes()
      ).padStart(2, "0")}`
    : "09:00"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-slot="date-time-picker-trigger"
          className={cn(
            "h-10 w-[280px] justify-between font-normal",
            !current && "text-muted-foreground",
            className
          )}
        >
          {current ? format(current, "PPP, p") : placeholder}
          <CalendarIcon className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={current}
          onSelect={handleDayChange}
          autoFocus
        />
        <div className="flex items-center gap-2 border-t p-3">
          <span className="text-sm text-muted-foreground">Time</span>
          <input
            type="time"
            value={timeStr}
            onChange={handleTimeChange}
            disabled={!current}
            className={cn(
              "h-9 flex-1 rounded-md border border-input bg-transparent px-2.5 text-sm outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-input/30"
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
