/**
 * Lucide-compatible icon shims backed by HugeIcons.
 *
 * Lets the rest of the codebase keep `<Plus className="…" />` syntax while
 * the underlying icon set is HugeIcons (consistent with shadcn primitives).
 */
import * as React from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowVerticalIcon,
  Attachment01Icon,
  NotificationIcon,
  Calendar01Icon,
  Cancel01Icon,
  CreditCardIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Delete02Icon,
  FavouriteIcon,
  File01Icon,
  Home01Icon,
  InformationCircleIcon,
  LinkSquare01Icon,
  Loading03Icon,
  Logout01Icon,
  Mail01Icon,
  Mic01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  TerminalIcon,
  TextAlignCenterIcon,
  TextAlignLeft01Icon,
  TextAlignRight01Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  Tick01Icon,
  Tick02Icon,
  HelpSquareIcon,
  MessageQuestionIcon,
  UnfoldMoreIcon,
  Download01Icon,
  ImageUpload01Icon,
  Upload01Icon,
  User03Icon,
  UserAccountIcon,
  UserCircleIcon,
  UserIcon,
  Clock01Icon,
  CoinsDollarIcon,
  PanelLeftOpenIcon,
  SecurityLockIcon,
} from "@hugeicons/core-free-icons"

type HugeIconAsset = typeof Add01Icon
type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">

function makeIcon(asset: HugeIconAsset, displayName: string) {
  const Component = (props: IconProps) => (
    <HugeiconsIcon icon={asset} {...props} />
  )
  Component.displayName = displayName
  return Component
}

// Names mirror lucide-react so consumer JSX (`<Plus />`, `<Plus className="…" />`)
// keeps working unchanged after swapping the import path.
export const Bold = makeIcon(TextBoldIcon, "Bold")
export const Italic = makeIcon(TextItalicIcon, "Italic")
export const Underline = makeIcon(TextUnderlineIcon, "Underline")
export const AlignLeft = makeIcon(TextAlignLeft01Icon, "AlignLeft")
export const AlignCenter = makeIcon(TextAlignCenterIcon, "AlignCenter")
export const AlignRight = makeIcon(TextAlignRight01Icon, "AlignRight")
export const ChevronRight = makeIcon(ArrowRight01Icon, "ChevronRight")
export const ChevronsUpDown = makeIcon(ArrowVerticalIcon, "ChevronsUpDown")
export const Check = makeIcon(Tick02Icon, "Check")
export const Tick01 = makeIcon(Tick01Icon, "Tick01")
export const CheckmarkCircle = makeIcon(CheckmarkCircle01Icon, "CheckmarkCircle")
export const Mail = makeIcon(Mail01Icon, "Mail")
export const Search = makeIcon(Search01Icon, "Search")
export const Plus = makeIcon(Add01Icon, "Plus")
export const Terminal = makeIcon(TerminalIcon, "Terminal")
export const AlertCircle = makeIcon(AlertCircleIcon, "AlertCircle")
export const Info = makeIcon(InformationCircleIcon, "Info")
export const Calendar = makeIcon(Calendar01Icon, "Calendar")
export const CreditCard = makeIcon(CreditCardIcon, "CreditCard")
export const Settings = makeIcon(Settings01Icon, "Settings")
export const User = makeIcon(UserIcon, "User")
export const User03 = makeIcon(User03Icon, "User03")
export const Loader2 = makeIcon(Loading03Icon, "Loader2")
export const Home = makeIcon(Home01Icon, "Home")
export const FileText = makeIcon(File01Icon, "FileText")
export const Bell = makeIcon(NotificationIcon, "Bell")
export const Star = makeIcon(StarIcon, "Star")
export const Heart = makeIcon(FavouriteIcon, "Heart")
export const MoreHorizontal = makeIcon(MoreHorizontalIcon, "MoreHorizontal")
export const Trash = makeIcon(Delete02Icon, "Trash")
export const Copy = makeIcon(Copy01Icon, "Copy")
export const Pencil = makeIcon(PencilEdit01Icon, "Pencil")
export const ExternalLink = makeIcon(LinkSquare01Icon, "ExternalLink")
export const ArrowRight = makeIcon(ArrowRight01Icon, "ArrowRight")
export const ArrowUp = makeIcon(ArrowUp01Icon, "ArrowUp")
export const CircleAlert = makeIcon(AlertCircleIcon, "CircleAlert")
export const Download = makeIcon(Download01Icon, "Download")
export const ImageUpload = makeIcon(ImageUpload01Icon, "ImageUpload")
export const Upload = makeIcon(Upload01Icon, "Upload")
export const X = makeIcon(Cancel01Icon, "X")
export const LogOut = makeIcon(Logout01Icon, "LogOut")
export const Mic = makeIcon(Mic01Icon, "Mic")
export const MessageQuestion = makeIcon(MessageQuestionIcon, "MessageQuestion")
export const UnfoldMore = makeIcon(UnfoldMoreIcon, "UnfoldMore")
export const Paperclip = makeIcon(Attachment01Icon, "Paperclip")
export const HelpSquare = makeIcon(HelpSquareIcon, "HelpSquare")
export const UserAccount = makeIcon(UserAccountIcon, "UserAccount")
export const UserCircle = makeIcon(UserCircleIcon, "UserCircle")
export const Clock = makeIcon(Clock01Icon, "Clock")
export const CoinsDollar = makeIcon(CoinsDollarIcon, "CoinsDollar")
export const PanelLeftOpen = makeIcon(PanelLeftOpenIcon, "PanelLeftOpen")
export const SecurityLock = makeIcon(SecurityLockIcon, "SecurityLock")
