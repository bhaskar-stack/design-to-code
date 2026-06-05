"use client"

import * as React from "react"
import { ArrowUp, X } from "@/components/icons"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { FileIcon, type FileIconType } from "@/components/ui/file-icon"

export type PromptInputAttachment = {
  /** Display name (e.g., "1040-2024.pdf"). */
  name: string
  /** File type — used to pick the right `FileIcon`. */
  type?: FileIconType
}

type PromptInputProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange" | "onSubmit" | "children"
> & {
  value?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  /**
   * Layout variant.
   * - `"default"`: multi-line textarea with a bottom toolbar (children + send).
   * - `"inline"`: single-line input with the send button on the right.
   *   Children render as a left-side action (e.g., a file-attach button).
   */
  variant?: "default" | "inline"
  /** Wrapper className applied to the InputGroup root. */
  containerClassName?: string
  /** Force the submit button into a disabled state regardless of input emptiness. */
  submitDisabled?: boolean
  /**
   * Left-side toolbar actions.
   * - In `default` variant: rendered inside the bottom toolbar.
   * - In `inline` variant: rendered as a left-side addon next to the input.
   */
  children?: React.ReactNode
  /** Files currently attached to the prompt — rendered as chips above the input. */
  attachments?: PromptInputAttachment[]
  /** Called when the user clicks the remove (×) button on an attachment chip. */
  onRemoveAttachment?: (index: number) => void
}

function PromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder,
  variant = "default",
  containerClassName,
  className,
  children,
  submitDisabled,
  attachments,
  onRemoveAttachment,
  onKeyDown,
  ...props
}: PromptInputProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (!isControlled) setInternalValue(e.target.value)
    onValueChange?.(e.target.value)
  }

  const hasAttachments = !!attachments && attachments.length > 0
  const isEmpty = currentValue.trim().length === 0 && !hasAttachments
  const disabled = submitDisabled ?? isEmpty

  const handleSubmit = React.useCallback(() => {
    if (disabled) return
    onSubmit?.(currentValue)
    if (!isControlled) setInternalValue("")
  }, [currentValue, disabled, isControlled, onSubmit])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    }
    onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>)
  }

  const sendButton = (
    <InputGroupButton
      type="button"
      size="icon-sm"
      variant="default"
      className={cn(variant === "default" && "ml-auto", "rounded-full")}
      disabled={disabled}
      onClick={handleSubmit}
      aria-label="Send message"
    >
      <ArrowUp />
    </InputGroupButton>
  )

  // Standalone chips row — sits ABOVE the input. Rendered as its own row
  // (not as an InputGroup addon) so the input row below stays a clean
  // horizontal flex with left-action / input / send all aligned.
  const chipsRow = hasAttachments ? (
    <div className="flex flex-wrap gap-1.5 px-2 pt-2">
      {attachments!.map((file, i) => (
        <PromptInputAttachmentChip
          key={`${file.name}-${i}`}
          file={file}
          onRemove={
            onRemoveAttachment ? () => onRemoveAttachment(i) : undefined
          }
        />
      ))}
    </div>
  ) : null

  if (variant === "inline") {
    // The "input row" is the actual InputGroup. When chips are present, we
    // wrap chips + input row in an outer column container that takes the
    // border / radius / shadow, and strip those styles off the InputGroup
    // so the visuals don't double-up.
    const inputRow = (
      <InputGroup
        className={cn(
          "h-12 transition-colors",
          // When wrapped (chips present), the outer container owns the chrome.
          hasAttachments
            ? "rounded-none border-0 bg-transparent shadow-none"
            : "rounded-xl border-input bg-background shadow-sm",
          children ? "pl-1.5" : "pl-1",
          "pr-1.5",
          !hasAttachments && containerClassName
        )}
      >
        {children && (
          <InputGroupAddon align="inline-start">{children}</InputGroupAddon>
        )}
        <InputGroupInput
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("px-3 text-sm", className)}
          {...(props as React.ComponentProps<"input">)}
        />
        <InputGroupAddon align="inline-end">{sendButton}</InputGroupAddon>
      </InputGroup>
    )

    if (!hasAttachments) return inputRow

    return (
      <div
        className={cn(
          "flex flex-col rounded-xl border border-input bg-background shadow-sm transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          "dark:bg-input/30",
          containerClassName
        )}
      >
        {chipsRow}
        {inputRow}
      </div>
    )
  }

  return (
    <InputGroup
      className={cn(
        "rounded-2xl border-input bg-background p-1 shadow-sm transition-colors",
        containerClassName
      )}
    >
      {hasAttachments && (
        <InputGroupAddon
          align="block-start"
          className="flex-wrap gap-1.5 px-2 pt-2"
        >
          {attachments!.map((file, i) => (
            <PromptInputAttachmentChip
              key={`${file.name}-${i}`}
              file={file}
              onRemove={
                onRemoveAttachment ? () => onRemoveAttachment(i) : undefined
              }
            />
          ))}
        </InputGroupAddon>
      )}
      <InputGroupTextarea
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("min-h-14 px-3 pt-3", className)}
        {...props}
      />
      <InputGroupAddon align="block-end" className="px-2 pb-2">
        {children}
        {sendButton}
      </InputGroupAddon>
    </InputGroup>
  )
}

// ---------------------------------------------------------------------------
// Attachment chip (internal)
// ---------------------------------------------------------------------------
function PromptInputAttachmentChip({
  file,
  onRemove,
}: {
  file: PromptInputAttachment
  onRemove?: () => void
}) {
  return (
    <span
      data-slot="prompt-input-attachment"
      className={cn(
        "inline-flex h-7 max-w-[220px] items-center gap-1.5 rounded-md border border-border bg-muted/40 pr-1 pl-1.5 text-xs",
        "dark:border-gray-dark-700 dark:bg-gray-dark-800/40"
      )}
    >
      <FileIcon
        type={file.type ?? "pdf"}
        size={16}
        showLabel={false}
        className="shrink-0"
      />
      <span className="truncate font-medium">{file.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className={cn(
            "ml-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground"
          )}
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  )
}

export { PromptInput }
