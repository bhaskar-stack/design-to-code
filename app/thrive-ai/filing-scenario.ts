// Branching scenario for the 2026 return-filing chat.
//
// The chat walks a graph of nodes. Each node asks one question and offers options;
// each option records an answer (facts), updates the canvas (effects) and picks the
// next node. computeReturn() turns the facts into the numbers shown on the summary,
// the draft 1040 and in the chat, so every path ends with its own result.
//
// The figures are a simplified model for a prototype, not tax software.

// ── facts ───────────────────────────────────────────────────────────────────

export type FilingStatus = "MFJ" | "Single" | "HOH" | "MFS"

export type FilingFacts = {
  status: FilingStatus
  residency: "CA" | "TX" | "NY"
  /** Share of the year spent as a California resident */
  caShare: number
  /** Children under 17 (child tax credit) */
  kids: number
  /** Other dependents ($500 credit), e.g. a child who aged out */
  otherDependents: number
  employment: "full" | "switched" | "left"
  seClients: 0 | 1 | 2 | 3
  brokerage: "fidelity" | "fidelity_schwab" | "none"
  statement: "extracted" | "skipped"
  crypto: "coinbase" | "coinbase_kraken" | "none"
  rental: "same" | "sold" | "none"
  hdfcPeak: number
  hdfcClosed: boolean
  iciciPeak: number
  iciciClosed: boolean
  nrePeak: number
  pfic: boolean
  expenses: string[]
  charityCash: number
  charityFlagged: boolean
  deduction: "itemized" | "standard" | null
  ira: "roth" | "backdoor" | "recharacterize" | "none"
  rsuAdjusted: boolean
  iso: "amt" | "disqualifying" | "none"
  pficMethod: "mtm" | "default" | "cpa" | null
}

export const DEFAULT_FACTS: FilingFacts = {
  status: "MFJ",
  residency: "CA",
  caShare: 1,
  kids: 2,
  otherDependents: 0,
  employment: "full",
  seClients: 2,
  brokerage: "fidelity",
  statement: "extracted",
  crypto: "coinbase",
  rental: "same",
  hdfcPeak: 8420,
  hdfcClosed: false,
  iciciPeak: 5860,
  iciciClosed: false,
  nrePeak: 0,
  pfic: false,
  expenses: ["mortgage", "property_tax", "charity_cash"],
  charityCash: 4800,
  charityFlagged: false,
  deduction: null,
  ira: "roth",
  rsuAdjusted: true,
  iso: "amt",
  pficMethod: null,
}

// ── tax model ───────────────────────────────────────────────────────────────

type Bracket = [upTo: number, rate: number]

const FED_BRACKETS: Record<FilingStatus, Bracket[]> = {
  MFJ: [[23200, 0.1], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]],
  Single: [[11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
  HOH: [[16550, 0.1], [63100, 0.12], [100500, 0.22], [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37]],
  MFS: [[11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [365600, 0.35], [Infinity, 0.37]],
}

const CA_SINGLE: Bracket[] = [[10756, 0.01], [25499, 0.02], [40245, 0.04], [55866, 0.06], [70606, 0.08], [360659, 0.093], [432787, 0.103], [721314, 0.113], [Infinity, 0.123]]
const CA_BRACKETS: Record<FilingStatus, Bracket[]> = {
  MFJ: CA_SINGLE.map(([u, r]) => [u * 2, r]),
  Single: CA_SINGLE,
  MFS: CA_SINGLE,
  HOH: [[21527, 0.01], [51000, 0.02], [65744, 0.04], [81364, 0.06], [96104, 0.08], [490493, 0.093], [588593, 0.103], [980987, 0.113], [Infinity, 0.123]],
}

const STANDARD: Record<FilingStatus, number> = { MFJ: 29200, Single: 14600, HOH: 21900, MFS: 14600 }
const CA_STANDARD: Record<FilingStatus, number> = { MFJ: 11080, Single: 5540, HOH: 11080, MFS: 5540 }
const NIIT_THRESHOLD: Record<FilingStatus, number> = { MFJ: 250000, Single: 200000, HOH: 200000, MFS: 125000 }
const CTC_PHASEOUT: Record<FilingStatus, number> = { MFJ: 400000, Single: 200000, HOH: 200000, MFS: 200000 }
const ROTH_LIMIT: Record<FilingStatus, number> = { MFJ: 240000, Single: 161000, HOH: 161000, MFS: 10000 }
const STUDENT_LOAN_PHASEOUT: Record<FilingStatus, [number, number]> = { MFJ: [165000, 195000], Single: [80000, 95000], HOH: [80000, 95000], MFS: [0, 0] }

function bracketTax(brackets: Bracket[], income: number) {
  let tax = 0
  let lower = 0
  for (const [upTo, rate] of brackets) {
    if (income <= lower) break
    tax += (Math.min(income, upTo) - lower) * rate
    lower = upTo
  }
  return tax
}

const WAGES = { full: 185000, switched: 193000, left: 128000 }
const FED_WITHHOLDING = { full: 40404, switched: 42950, left: 27600 }
const CA_WITHHOLDING = { full: 11365, switched: 11980, left: 7850 }
const SE_INCOME = { 0: 0, 1: 24300, 2: 42600, 3: 58900 }
const ISO_SPREAD = 44400
const AMT = 11840
const RSU_BASIS_GAP = 42103
const FED_ESTIMATED = 10424

export type ReturnLine = { label: string; value: number; highlight?: boolean }

export function computeReturn(f: FilingFacts) {
  const wages = WAGES[f.employment] + (f.iso === "disqualifying" ? ISO_SPREAD : 0)
  const se = SE_INCOME[f.seClients]
  const schwab = f.brokerage === "fidelity_schwab"
  const hasBrokerage = f.brokerage !== "none"
  const ordDiv = hasBrokerage ? 8240 + (schwab ? 1920 : 0) : 0
  const qualDiv = hasBrokerage ? 6180 + (schwab ? 1310 : 0) : 0
  const stGains = hasBrokerage ? 1240 + (schwab ? 860 : 0) + (f.rsuAdjusted ? 0 : RSU_BASIS_GAP) : 0
  const ltGains = f.rental === "sold" ? 41200 : 0
  const rentalNet = { same: 18400, sold: 7600, none: 0 }[f.rental]
  const crypto = { coinbase: 3820, coinbase_kraken: 5140, none: 0 }[f.crypto]
  const pficIncome = f.pfic && f.pficMethod === "mtm" ? 2300 : 0
  const totalIncome = wages + se + ordDiv + stGains + ltGains + rentalNet + crypto + pficIncome

  const k401 = 23000
  const seHalf = Math.round((se * 0.9235 * 0.153) / 2)
  const homeOffice = se > 0 ? 1800 : 0
  const preAgi = totalIncome - k401 - seHalf - homeOffice
  const [slStart, slEnd] = STUDENT_LOAN_PHASEOUT[f.status]
  const studentLoan = f.expenses.includes("student_loan") && slEnd > slStart
    ? Math.round(2500 * Math.min(1, Math.max(0, (slEnd - preAgi) / (slEnd - slStart))))
    : 0
  const agi = preAgi - studentLoan

  const standard = STANDARD[f.status]
  const salt = f.status === "MFS" ? 5000 : 10000
  const mortgage = f.expenses.includes("mortgage") ? 23620 : 0
  const charity = (f.expenses.includes("charity_cash") ? f.charityCash : 0) + (f.expenses.includes("charity_goods") ? 1400 : 0)
  const medical = f.expenses.includes("medical") ? Math.max(0, 6200 - Math.round(agi * 0.075)) : 0
  const itemized = mortgage + salt + charity + medical
  const recommended: "itemized" | "standard" = itemized > standard ? "itemized" : "standard"
  const deductionChoice = f.deduction ?? recommended
  const deduction = deductionChoice === "itemized" ? itemized : standard
  const taxable = Math.max(0, agi - deduction)

  const preferential = Math.min(taxable, qualDiv + ltGains)
  const fedIncomeTax = Math.round(bracketTax(FED_BRACKETS[f.status], taxable - preferential) + preferential * 0.15)

  const ctcReduction = Math.ceil(Math.max(0, agi - CTC_PHASEOUT[f.status]) / 1000) * 50
  const childCredit = Math.max(0, f.kids * 2000 + f.otherDependents * 500 - ctcReduction)
  const careCredit = f.expenses.includes("childcare") && f.kids > 0 ? 600 * Math.min(f.kids, 2) : 0
  const credits = childCredit + careCredit

  const seTax = Math.round(se * 0.9235 * 0.153)
  const investmentIncome = ordDiv + stGains + ltGains + rentalNet + crypto + pficIncome
  const niit = Math.round(0.038 * Math.max(0, Math.min(investmentIncome, agi - NIIT_THRESHOLD[f.status])))
  const amt = f.iso === "amt" ? AMT : 0
  const fedTax = Math.max(0, fedIncomeTax - credits) + seTax + niit + amt
  const fedWithholding = FED_WITHHOLDING[f.employment]
  const fedRefund = fedWithholding + FED_ESTIMATED - fedTax

  const caItemized = mortgage + charity + (f.expenses.includes("property_tax") ? 6400 : 0)
  const caDeduction = deductionChoice === "itemized" ? caItemized : CA_STANDARD[f.status]
  const caTaxable = Math.max(0, agi - caDeduction)
  const caCredits = 149 * (f.status === "MFJ" ? 2 : 1) + 461 * (f.kids + f.otherDependents)
  const caTax = Math.round(Math.max(0, bracketTax(CA_BRACKETS[f.status], caTaxable) - caCredits) * f.caShare)
  const caWithholding = Math.round(CA_WITHHOLDING[f.employment] * f.caShare)
  const caRefund = caWithholding - caTax

  const nyShare = f.residency === "NY" ? 1 - f.caShare : 0
  const nyTax = Math.round(taxable * 0.0625 * nyShare)
  const nyWithholding = Math.round(wages * 0.052 * nyShare)
  const nyRefund = nyWithholding - nyTax

  const foreignPeak = (f.hdfcPeak) + (f.iciciPeak) + f.nrePeak
  const stateName = { CA: "California", TX: "California (part-year)", NY: "California (part-year)" }[f.residency]

  const income: ReturnLine[] = [
    { label: f.employment === "switched" ? "W-2 wages (Tech Corp + Nimbus Labs)" : "W-2 wages (Tech Corp)", value: wages - (f.iso === "disqualifying" ? ISO_SPREAD : 0) },
    ...(f.iso === "disqualifying" ? [{ label: "ISO disqualifying disposition", value: ISO_SPREAD }] : []),
    ...(se ? [{ label: `Self-employment (${f.seClients} client${f.seClients > 1 ? "s" : ""})`, value: se }] : []),
    ...(hasBrokerage ? [
      { label: "Ordinary dividends", value: ordDiv },
      { label: "Qualified dividends (included above)", value: qualDiv },
      { label: "Short-term capital gains", value: stGains },
    ] : []),
    ...(ltGains ? [{ label: "Long-term gain (Austin sale)", value: ltGains }] : []),
    ...(rentalNet ? [{ label: "Rental income (net)", value: rentalNet }] : []),
    ...(crypto ? [{ label: "Crypto gains", value: crypto }] : []),
    ...(pficIncome ? [{ label: "PFIC mark-to-market", value: pficIncome }] : []),
  ]
  const deductions: ReturnLine[] = [
    { label: deductionChoice === "itemized" ? "Itemized deductions" : `Standard deduction (${f.status})`, value: deduction },
    { label: "401(k) contributions", value: k401 },
    ...(seHalf ? [{ label: "Self-employment tax (½)", value: seHalf }] : []),
    ...(homeOffice ? [{ label: "Home office deduction", value: homeOffice }] : []),
    ...(studentLoan ? [{ label: "Student loan interest", value: studentLoan }] : []),
  ]
  const taxLines: ReturnLine[] = [
    { label: "Taxable income", value: taxable },
    { label: "Federal income tax", value: fedIncomeTax },
    { label: "Credits", value: -credits },
    ...(seTax ? [{ label: "Self-employment tax", value: seTax }] : []),
    { label: "Net investment income tax", value: niit },
    ...(amt ? [{ label: "Alternative minimum tax", value: amt }] : []),
    { label: `${stateName} tax`, value: caTax },
    ...(nyShare ? [{ label: "New York tax (part-year)", value: nyTax }] : []),
  ]
  const payments: ReturnLine[] = [
    { label: "Federal withholding (W-2)", value: fedWithholding },
    { label: "Federal estimated payments", value: FED_ESTIMATED },
    { label: "CA withholding (W-2)", value: caWithholding },
    ...(nyShare ? [{ label: "NY withholding (W-2)", value: nyWithholding }] : []),
    { label: fedRefund >= 0 ? "Federal refund" : "Federal balance due", value: Math.abs(fedRefund), highlight: true },
    { label: caRefund >= 0 ? "California refund" : "California balance due", value: Math.abs(caRefund), highlight: true },
    ...(nyShare ? [{ label: nyRefund >= 0 ? "New York refund" : "New York balance due", value: Math.abs(nyRefund), highlight: true }] : []),
  ]
  const carryovers: ReturnLine[] = [
    { label: "AMT credit carryforward (Form 8801)", value: amt },
    { label: "Capital loss carryover", value: 0 },
    { label: "Charitable contribution carryover", value: 0 },
  ]

  return {
    wages, se, ordDiv, qualDiv, stGains, ltGains, rentalNet, crypto, pficIncome, totalIncome,
    adjustments: k401 + seHalf + homeOffice + studentLoan, agi,
    standard, itemized, mortgage, salt, charity, recommended, deductionChoice, deduction, taxable,
    fedIncomeTax, credits, childCredit, careCredit, seTax, niit, amt, fedTax,
    fedWithholding, fedEstimated: FED_ESTIMATED, fedRefund,
    caTax, caWithholding, caRefund, nyTax, nyRefund, hasNY: nyShare > 0,
    totalBack: fedRefund + caRefund + (nyShare ? nyRefund : 0),
    rothOverLimit: agi > ROTH_LIMIT[f.status],
    studentLoanPhasedOut: f.expenses.includes("student_loan") && studentLoan === 0,
    foreignPeak, fbarRequired: foreignPeak > 10000,
    summary: { income, deductions, taxLines, payments, carryovers },
  }
}

export type ReturnResult = ReturnType<typeof computeReturn>

export const money = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`

// ── canvas ──────────────────────────────────────────────────────────────────

export type FilingItem = { id: string; label: string; tags: string[]; confirmed: boolean; extracting?: boolean; na?: boolean }
export type FilingSection = {
  id: string; label: string; type: "items" | "progress"
  items?: FilingItem[]; state?: string; progress?: number
}

const item = (id: string, label: string): FilingItem => ({ id, label, tags: [], confirmed: false })

export const INITIAL_FILING_SECTIONS: FilingSection[] = [
  { id: "profile", label: "Your profile information", type: "items", items: [item("filing_status", "Filing status"), item("residency", "Residency"), item("dependents", "Dependents")] },
  { id: "income", label: "Income sources", type: "items", items: [item("employment", "Employment"), item("self_employment", "Self-employment"), item("stocks", "Stocks & brokerage"), item("crypto", "Crypto"), item("rental", "Rental & real estate")] },
  { id: "documents", label: "Documents collection", type: "items", items: documentItems(DEFAULT_FACTS) },
  { id: "foreign", label: "Foreign accounts", type: "items", items: [item("hdfc", "HDFC Bank"), item("icici", "ICICI Bank"), item("other_foreign", "Other accounts")] },
  { id: "deductions", label: "Deductions & credits", type: "items", items: [item("expenses", "This year's expenses"), item("charitable", "Charitable giving"), item("standard_vs_itemized", "Standard vs itemized"), item("retirement", "Retirement contributions")] },
  { id: "planning", label: "Tax planning checks", type: "items", items: [item("rsu_basis", "RSU cost basis"), item("iso_amt", "ISO & AMT exposure"), item("state_tax", "State tax (California)")] },
  { id: "draft", label: "Draft return", type: "progress", progress: 0 },
]

/** Documents the return needs, given the income answers so far. Fidelity statements need an upload. */
export function documentItems(f: FilingFacts): FilingItem[] {
  return [
    item("w2", "W-2 · Tech Corp"),
    ...(f.employment === "switched" ? [item("w2_nimbus", "W-2 · Nimbus Labs")] : []),
    ...(f.seClients ? [item("1099nec", `1099-NEC · Freelance (×${f.seClients})`)] : []),
    ...(f.brokerage !== "none" ? [item("1099div", "1099-DIV · Fidelity"), item("1099b", "1099-B · Fidelity")] : []),
    ...(f.brokerage === "fidelity_schwab" ? [item("schwab", "1099 composite · Schwab")] : []),
    ...(f.crypto !== "none" ? [item("coinbase", "Coinbase transactions")] : []),
    ...(f.crypto === "coinbase_kraken" ? [item("kraken", "Kraken transactions")] : []),
    ...(f.rental !== "none" ? [item("rental_docs", "Rental records · Austin")] : []),
    ...(f.rental === "sold" ? [item("closing", "Closing statement · Austin")] : []),
  ]
}

export const UPLOAD_DOCS = ["1099div", "1099b"]

export type FilingEffect = {
  confirm?: { section: string; item: string; tags: string[]; na?: boolean }[]
  /** Adds an item to a section, before the item named in `before` if given */
  add?: { section: string; id: string; label: string; before?: string }[]
  relabel?: { section: string; item: string; label: string }[]
  /** Rebuild the documents list from the current facts, keeping confirmations */
  syncDocs?: boolean
  /** Confirm every document that doesn't need an upload */
  importDocs?: boolean
  extracting?: string[]
  canvasTab?: "profile" | "summary" | "draft"
}

// ── script ──────────────────────────────────────────────────────────────────

type Dyn<T> = T | ((f: FilingFacts, r: ReturnResult) => T)

export type FilingOption = {
  id: string
  label: string
  /** Text of the user's bubble, when it should differ from the chip label */
  reply?: string
  set?: Partial<FilingFacts>
  effect?: Dyn<FilingEffect>
  next: Dyn<string>
}

export type FilingAction = { reply?: string; set?: Partial<FilingFacts>; effect?: Dyn<FilingEffect>; next: Dyn<string> }

export type FilingNode = {
  /** Section and item the canvas highlights while this question is open */
  focus?: { section: string; item?: string }
  text: Dyn<string>
  options?: Dyn<FilingOption[]>
  ui?: Dyn<"upload" | "extracting" | "extractionTable" | "multiSelect" | undefined>
  multiSelect?: { id: string; label: string; short: string }[]
  onUpload?: FilingAction
  onConfirmTable?: FilingAction
  onMultiSelect?: (ids: string[]) => FilingAction
  /** Moves on without user input */
  auto?: { after: number; next: Dyn<string> }
  /** Skips the question when it doesn't apply, marking the focus item not applicable */
  skip?: { when: (f: FilingFacts) => boolean; tags: string[]; next: Dyn<string> }
  effect?: Dyn<FilingEffect>
}

export function resolve<T>(v: Dyn<T>, f: FilingFacts): T {
  return typeof v === "function" ? (v as (f: FilingFacts, r: ReturnResult) => T)(f, computeReturn(f)) : v
}

const confirm = (section: string, itemId: string, ...tags: string[]): FilingEffect => ({ confirm: [{ section, item: itemId, tags }] })
const na = (section: string, itemId: string, tag = "Not applicable"): FilingEffect => ({ confirm: [{ section, item: itemId, tags: [tag], na: true }] })
const merge = (...effects: FilingEffect[]): FilingEffect => ({
  confirm: effects.flatMap(e => e.confirm ?? []),
  add: effects.flatMap(e => e.add ?? []),
  relabel: effects.flatMap(e => e.relabel ?? []),
  syncDocs: effects.some(e => e.syncDocs),
})

/** Re-offers a question's options after an explanation, without the option that asked for it */
const reask = (nodeId: string, without = "more"): Dyn<FilingOption[]> =>
  (f) => resolve(FILING_NODES[nodeId].options ?? [], f).filter(o => o.id !== without)

export const STATUS_LABEL: Record<FilingStatus, string> = { MFJ: "Married filing jointly", Single: "Single", HOH: "Head of household", MFS: "Married filing separately" }
const usd = money

export const FILING_START = "intro"

export const FILING_NODES: Record<string, FilingNode> = {
  intro: {
    text: "Welcome back, Bhaskar. I'll prepare your 2026 return. We'll walk through your profile, income, documents, foreign accounts, deductions, and planning checks — then I'll prepare the draft.\n\nYou can edit anything we confirm at any point.",
    options: [{ id: "begin", label: "Let's begin", next: "status" }],
  },

  // ── profile ──
  status: {
    focus: { section: "profile", item: "filing_status" },
    text: "I have you filing jointly with your spouse, same as last year. Still married filing jointly for 2026?",
    options: [
      { id: "mfj", label: "Yes, married filing jointly", set: { status: "MFJ" }, effect: confirm("profile", "filing_status", "Married filing jointly"), next: "residency" },
      { id: "changed", label: "Something changed", next: "status_changed" },
      { id: "compare", label: "Is joint still the best option?", next: "status_compare" },
    ],
  },
  status_compare: {
    focus: { section: "profile", item: "filing_status" },
    text: (f) => {
      const joint = computeReturn({ ...f, status: "MFJ" })
      const separate = computeReturn({ ...f, status: "MFS" })
      return `I ran both with last year's numbers. Filing jointly comes out ${usd(joint.totalBack - separate.totalBack)} better than filing separately — separate returns halve the SALT cap and phase out credits sooner.\n\nJoint is the better choice unless you need to keep liabilities apart.`
    },
    options: [
      { id: "mfj", label: "Stay with joint", set: { status: "MFJ" }, effect: confirm("profile", "filing_status", "Married filing jointly"), next: "residency" },
      { id: "mfs", label: "File separately anyway", set: { status: "MFS" }, effect: confirm("profile", "filing_status", "Married filing separately"), next: "residency" },
    ],
  },
  status_changed: {
    focus: { section: "profile", item: "filing_status" },
    text: "No problem — what's your filing status for 2026?",
    options: [
      { id: "single", label: "Single", set: { status: "Single" }, effect: confirm("profile", "filing_status", "Single"), next: "residency" },
      { id: "hoh", label: "Head of household", set: { status: "HOH" }, effect: confirm("profile", "filing_status", "Head of household"), next: "residency" },
      { id: "mfs", label: "Married filing separately", set: { status: "MFS" }, next: "status_mfs" },
      { id: "mfj", label: "Actually, still joint", set: { status: "MFJ" }, effect: confirm("profile", "filing_status", "Married filing jointly"), next: "residency" },
    ],
  },
  status_mfs: {
    focus: { section: "profile", item: "filing_status" },
    text: (f, r) => {
      const joint = computeReturn({ ...f, status: "MFJ" })
      return `Heads up — filing separately costs you about ${usd(joint.totalBack - r.totalBack)} more than filing jointly. The SALT cap drops to $5,000, brackets are narrower, and some credits phase out sooner.\n\nContinue with married filing separately?`
    },
    options: [
      { id: "mfs", label: "Continue with separate", set: { status: "MFS" }, effect: confirm("profile", "filing_status", "Married filing separately"), next: "residency" },
      { id: "mfj", label: "Switch back to joint", set: { status: "MFJ" }, effect: confirm("profile", "filing_status", "Married filing jointly"), next: "residency" },
    ],
  },
  residency: {
    focus: { section: "profile", item: "residency" },
    text: "California resident the full year, correct?",
    options: [
      { id: "ca", label: "Yes, full-year CA resident", set: { residency: "CA", caShare: 1 }, effect: confirm("profile", "residency", "California", "full year"), next: "dependents" },
      { id: "tx", label: "Moved to Texas this year", set: { residency: "TX" }, next: "residency_when" },
      { id: "ny", label: "Moved to New York this year", set: { residency: "NY" }, next: "residency_when" },
    ],
  },
  residency_when: {
    focus: { section: "profile", item: "residency" },
    text: (f) => `When did you move to ${f.residency === "TX" ? "Texas" : "New York"}? I'll split your income between the two states by date.`,
    options: (f) => {
      const state = f.residency === "TX" ? "Texas" : "New York"
      const stateLabel = f.residency === "TX" ? "State tax (CA part-year)" : "State tax (CA + NY)"
      const relabel = { relabel: [{ section: "planning", item: "state_tax", label: stateLabel }] }
      return [
        { id: "h1", label: "First half of the year", set: { caShare: 0.35 }, effect: merge(confirm("profile", "residency", `CA → ${state}`, "moved Q2"), relabel), next: "dependents" },
        { id: "h2", label: "Second half of the year", set: { caShare: 0.7 }, effect: merge(confirm("profile", "residency", `CA → ${state}`, "moved Q3"), relabel), next: "dependents" },
      ]
    },
  },
  dependents: {
    focus: { section: "profile", item: "dependents" },
    text: "Two dependents from last year — same for 2026?",
    options: [
      { id: "same", label: "Yes, same two", set: { kids: 2, otherDependents: 0 }, effect: confirm("profile", "dependents", "2 dependents"), next: (f) => f.status === "Single" ? "hoh_suggest" : "employment" },
      { id: "baby", label: "We had a baby — now three", set: { kids: 3, otherDependents: 0 }, effect: confirm("profile", "dependents", "3 dependents", "new baby"), next: (f) => f.status === "Single" ? "hoh_suggest" : "employment" },
      { id: "aged", label: "One turned 17", set: { kids: 1, otherDependents: 1 }, next: "dependents_aged" },
      { id: "none", label: "No dependents this year", set: { kids: 0, otherDependents: 0 }, effect: confirm("profile", "dependents", "none"), next: "employment" },
    ],
  },
  dependents_aged: {
    focus: { section: "profile", item: "dependents" },
    text: "Got it. Once a child turns 17 they no longer qualify for the $2,000 child tax credit, but they still count for the $500 credit for other dependents if they live with you and you support them.",
    options: [
      { id: "ok", label: "Makes sense, continue", effect: confirm("profile", "dependents", "1 child", "1 other dependent"), next: (f) => f.status === "Single" ? "hoh_suggest" : "employment" },
    ],
  },
  hoh_suggest: {
    focus: { section: "profile", item: "filing_status" },
    text: (f, r) => {
      const hoh = computeReturn({ ...f, status: "HOH" })
      return `Since you're single with a dependent living with you, you likely qualify for head of household — a bigger standard deduction ($21,900 vs $14,600) and wider brackets. That's about ${usd(hoh.totalBack - r.totalBack)} better.\n\nSwitch to head of household?`
    },
    options: [
      { id: "hoh", label: "Switch to head of household", set: { status: "HOH" }, effect: confirm("profile", "filing_status", "Head of household"), next: "employment" },
      { id: "single", label: "Keep single", next: "employment" },
    ],
  },

  // ── income ──
  employment: {
    focus: { section: "income", item: "employment" },
    text: "Pulling your W-2 from Tech Corp. Full year there?",
    options: [
      { id: "full", label: "Yes, full year at Tech Corp", set: { employment: "full" }, effect: merge(confirm("income", "employment", "W-2 · Tech Corp"), { syncDocs: true }), next: "self_employment" },
      { id: "switched", label: "Switched jobs mid-year", set: { employment: "switched" }, next: "employment_switched" },
      { id: "left", label: "Left Tech Corp in August", set: { employment: "left" }, effect: merge(confirm("income", "employment", "W-2 · Tech Corp", "Jan–Aug"), { syncDocs: true }), next: "employment_left" },
    ],
  },
  employment_switched: {
    focus: { section: "income", item: "employment" },
    text: "Found a second W-2 from Nimbus Labs in your payroll connections — started there in June. Two employers can over-withhold Social Security tax; I'll claim back anything above the wage base.",
    options: [
      { id: "ok", label: "Yes, Nimbus Labs", effect: merge(confirm("income", "employment", "Tech Corp", "Nimbus Labs"), { syncDocs: true }), next: "self_employment" },
    ],
  },
  employment_left: {
    focus: { section: "income", item: "employment" },
    text: "Thanks. Did you receive severance or a final RSU vest when you left? Those show up on the same W-2, so nothing extra to upload — I just want to make sure withholding covered them.",
    options: [
      { id: "covered", label: "It's all on the W-2", next: "self_employment" },
      { id: "unsure", label: "Not sure", reply: "Not sure — can you check?", next: "employment_left_check" },
    ],
  },
  employment_left_check: {
    focus: { section: "income", item: "employment" },
    text: "Checked — your final W-2 includes a $14,200 severance payment with 22% federal withholding. You're covered.",
    options: [{ id: "ok", label: "Great, continue", next: "self_employment" }],
  },
  self_employment: {
    focus: { section: "income", item: "self_employment" },
    text: "I see two 1099-NEC forms — freelance work for two clients. Include them?",
    options: [
      { id: "both", label: "Yes, include both", set: { seClients: 2 }, effect: merge(confirm("income", "self_employment", "freelance", "2 clients"), { syncDocs: true }), next: "stocks" },
      { id: "three", label: "There's a third client", set: { seClients: 3 }, effect: merge(confirm("income", "self_employment", "freelance", "3 clients"), { syncDocs: true }), next: "stocks" },
      { id: "one", label: "Only one was this year", set: { seClients: 1 }, effect: merge(confirm("income", "self_employment", "freelance", "1 client"), { syncDocs: true }), next: "stocks" },
      { id: "skip", label: "Skip self-employment", set: { seClients: 0 }, effect: merge(na("income", "self_employment", "none this year"), { syncDocs: true }), next: "stocks" },
    ],
  },
  stocks: {
    focus: { section: "income", item: "stocks" },
    text: "Your Fidelity 1099-DIV and 1099-B are loaded. I'll handle the cost basis adjustment in the planning section.",
    options: [
      { id: "fidelity", label: "Yes, proceed", set: { brokerage: "fidelity" }, effect: merge(confirm("income", "stocks", "Fidelity"), { syncDocs: true }), next: "crypto" },
      { id: "schwab", label: "I also have a Schwab account", set: { brokerage: "fidelity_schwab" }, effect: merge(confirm("income", "stocks", "Fidelity", "Schwab"), { syncDocs: true }), next: "stocks_schwab" },
      { id: "none", label: "No brokerage activity this year", set: { brokerage: "none" }, effect: merge(na("income", "stocks", "none this year"), { syncDocs: true }), next: "crypto" },
      { id: "more", label: "Tell me more", next: "stocks_more" },
    ],
  },
  stocks_more: {
    focus: { section: "income", item: "stocks" },
    text: "Brokers often report RSU shares with a $0 or partial cost basis because the vest value was already taxed on your W-2. If we used their numbers you'd pay tax on that income twice. I'll match each sale to your vest records and fix the basis before it hits Form 8949.",
    options: reask("stocks"),
  },
  stocks_schwab: {
    focus: { section: "income", item: "stocks" },
    text: "Connected to Schwab — pulled a 1099 composite with $1,920 in dividends and $860 in short-term gains. I've added it to your documents.",
    options: [{ id: "ok", label: "Perfect, continue", next: "crypto" }],
  },
  crypto: {
    focus: { section: "income", item: "crypto" },
    text: "Found Coinbase activity from last year. Pull this year's transactions the same way?",
    options: [
      { id: "coinbase", label: "Yes, pull from Coinbase", set: { crypto: "coinbase" }, effect: merge(confirm("income", "crypto", "Coinbase"), { syncDocs: true }), next: "rental" },
      { id: "kraken", label: "I also traded on Kraken", set: { crypto: "coinbase_kraken" }, effect: merge(confirm("income", "crypto", "Coinbase", "Kraken"), { syncDocs: true }), next: "crypto_kraken" },
      { id: "none", label: "No crypto activity this year", set: { crypto: "none" }, effect: merge(na("income", "crypto", "none this year"), { syncDocs: true }), next: "rental" },
    ],
  },
  crypto_kraken: {
    focus: { section: "income", item: "crypto" },
    text: "Linked Kraken — 38 trades, $1,320 in net gains. I'll reconcile transfers between the two exchanges so coins you moved aren't counted as sales.",
    options: [{ id: "ok", label: "Sounds good", next: "rental" }],
  },
  rental: {
    focus: { section: "income", item: "rental" },
    text: "Rental property in Austin, TX — same as last year?",
    options: [
      { id: "same", label: "Yes, same property", set: { rental: "same" }, effect: merge(confirm("income", "rental", "Austin, TX"), { syncDocs: true }), next: "documents" },
      { id: "sold", label: "We sold it this year", set: { rental: "sold" }, effect: merge(confirm("income", "rental", "Austin, TX", "sold"), { syncDocs: true }), next: "rental_sold" },
      { id: "none", label: "No rental income", set: { rental: "none" }, effect: merge(na("income", "rental", "none this year"), { syncDocs: true }), next: "documents" },
    ],
  },
  rental_sold: {
    focus: { section: "income", item: "rental" },
    text: "Got it — I found the closing statement in your email: sold in September with a $41,200 long-term gain. I'll recapture depreciation on Form 4797 and include the partial-year rent.",
    options: [{ id: "ok", label: "That's right", next: "documents" }],
  },

  // ── documents ──
  documents: {
    focus: { section: "documents" },
    effect: { syncDocs: true, importDocs: true },
    text: (f) => {
      const count = documentItems(f).filter(d => !UPLOAD_DOCS.includes(d.id) || f.brokerage === "none").length
      return f.brokerage === "none"
        ? `Income looks good. I imported all ${count} documents from your connected accounts — nothing to upload.`
        : `Income looks good. I imported ${count} documents automatically. I need one more — your year-end brokerage statement from Fidelity. Upload it and I'll extract the details.`
    },
    ui: (f) => f.brokerage === "none" ? undefined : "upload",
    options: (f) => f.brokerage === "none"
      ? [{ id: "ok", label: "Continue", next: "hdfc" }]
      : [{ id: "skip", label: "Skip — use the 1099 data", set: { statement: "skipped" }, effect: { confirm: UPLOAD_DOCS.map(id => ({ section: "documents", item: id, tags: ["From 1099"] })) }, next: "documents_skipped" }],
    onUpload: { reply: "Here's the year-end statement", set: { statement: "extracted" }, effect: { extracting: UPLOAD_DOCS }, next: "extracting" },
  },
  documents_skipped: {
    focus: { section: "documents" },
    text: "No problem — I'll use the 1099 figures. The year-end statement mostly helps catch mismatched basis, so I've flagged the RSU sales for a closer look in planning.",
    options: [{ id: "ok", label: "Continue", next: "hdfc" }],
  },
  extracting: {
    focus: { section: "documents" },
    text: "Reading the statement…",
    ui: "extracting",
    auto: { after: 12000, next: "extracted" },
  },
  extracted: {
    focus: { section: "documents" },
    text: "Got it. Here's what I pulled from the statement. Confirm everything looks right and I'll move on.",
    ui: "extractionTable",
    onConfirmTable: { reply: "Confirm extracted data", effect: { confirm: UPLOAD_DOCS.map(id => ({ section: "documents", item: id, tags: ["Extracted"] })) }, next: "hdfc" },
  },

  // ── foreign ──
  hdfc: {
    focus: { section: "foreign", item: "hdfc" },
    text: "Your HDFC Bank account peaked at $8,420 this year. Confirm?",
    options: [
      { id: "yes", label: "Yes, that's right", set: { hdfcPeak: 8420 }, effect: confirm("foreign", "hdfc", "$8,420 peak"), next: "icici" },
      { id: "higher", label: "It was higher at one point", next: "hdfc_peak" },
      { id: "closed", label: "I closed it this year", set: { hdfcPeak: 8420, hdfcClosed: true }, effect: confirm("foreign", "hdfc", "$8,420 peak", "closed"), next: "icici" },
    ],
  },
  hdfc_peak: {
    focus: { section: "foreign", item: "hdfc" },
    text: "FBAR uses the highest balance during the year, not the year-end figure. What was the peak?",
    options: [
      { id: "9800", label: "About $9,800", set: { hdfcPeak: 9800 }, effect: confirm("foreign", "hdfc", "$9,800 peak"), next: "icici" },
      { id: "12300", label: "About $12,300", set: { hdfcPeak: 12300 }, effect: confirm("foreign", "hdfc", "$12,300 peak"), next: "icici" },
      { id: "unsure", label: "Not sure", reply: "Not sure — can you estimate it?", set: { hdfcPeak: 10950 }, effect: confirm("foreign", "hdfc", "~$10,950 peak", "estimated"), next: "hdfc_estimated" },
    ],
  },
  hdfc_estimated: {
    focus: { section: "foreign", item: "hdfc" },
    text: "From your monthly statements the highest was about $10,950 in March. I'll use that — it's fine to report a reasonable estimate.",
    options: [{ id: "ok", label: "Use that", next: "icici" }],
  },
  icici: {
    focus: { section: "foreign", item: "icici" },
    text: "ICICI Bank peaked at $5,860. Confirm?",
    options: [
      { id: "yes", label: "Yes, that's right", set: { iciciPeak: 5860 }, effect: confirm("foreign", "icici", "$5,860 peak"), next: "foreign_other" },
      { id: "7400", label: "It was about $7,400", set: { iciciPeak: 7400 }, effect: confirm("foreign", "icici", "$7,400 peak"), next: "foreign_other" },
      { id: "closed", label: "I closed it this year", set: { iciciPeak: 5860, iciciClosed: true }, effect: confirm("foreign", "icici", "$5,860 peak", "closed"), next: "foreign_other" },
    ],
  },
  foreign_other: {
    focus: { section: "foreign", item: "other_foreign" },
    text: (f, r) => `Combined peak so far is ${usd(r.foreignPeak)}${r.fbarRequired ? " — over the $10,000 threshold, so you'll need to file an FBAR." : " — under the $10,000 FBAR threshold."} Any other foreign accounts or investments?`,
    options: [
      { id: "none", label: "No, just those", effect: (f, r) => confirm("foreign", "other_foreign", "none", r.fbarRequired ? "FBAR required" : "no FBAR"), next: "foreign_summary" },
      { id: "nre", label: "An SBI NRE account", set: { nrePeak: 6500 }, effect: { add: [{ section: "foreign", id: "sbi_nre", label: "SBI NRE account" }], confirm: [{ section: "foreign", item: "sbi_nre", tags: ["$6,500 peak", "interest tax-free in India"] }] }, next: "foreign_other_more" },
      { id: "mf", label: "Indian mutual funds", set: { pfic: true }, effect: { add: [{ section: "foreign", id: "indian_mf", label: "Indian mutual funds" }, { section: "planning", id: "pfic", label: "PFIC (Form 8621)", before: "state_tax" }], confirm: [{ section: "foreign", item: "indian_mf", tags: ["PFIC"] }] }, next: "foreign_other_more" },
    ],
  },
  foreign_other_more: {
    focus: { section: "foreign", item: "other_foreign" },
    text: (f, r) => `Added. Combined peak is now ${usd(r.foreignPeak)}${r.fbarRequired ? ", so FBAR is required" : ""}${f.pfic ? ". The mutual funds count as PFICs — we'll choose how to report them in planning" : ""}. Anything else?`,
    options: (f) => [
      { id: "none", label: "No, that's everything", effect: (ff, r) => confirm("foreign", "other_foreign", r.fbarRequired ? "FBAR required" : "no FBAR"), next: "foreign_summary" },
      ...(f.nrePeak ? [] : [{ id: "nre", label: "An SBI NRE account", set: { nrePeak: 6500 }, effect: { add: [{ section: "foreign", id: "sbi_nre", label: "SBI NRE account" }], confirm: [{ section: "foreign", item: "sbi_nre", tags: ["$6,500 peak", "interest tax-free in India"] }] }, next: "foreign_other_more" }]),
      ...(f.pfic ? [] : [{ id: "mf", label: "Indian mutual funds", set: { pfic: true }, effect: { add: [{ section: "foreign", id: "indian_mf", label: "Indian mutual funds" }, { section: "planning", id: "pfic", label: "PFIC (Form 8621)", before: "state_tax" }], confirm: [{ section: "foreign", item: "indian_mf", tags: ["PFIC"] }] }, next: "foreign_other_more" }]),
    ],
  },
  foreign_summary: {
    focus: { section: "foreign", item: "other_foreign" },
    text: (f, r) => `${r.fbarRequired ? "I'll prepare your FBAR (FinCEN 114) — it's filed separately from your return, due the same day." : "No FBAR needed this year."} Form 8938 isn't required — you're well under the ${f.status === "MFJ" ? "$100,000 threshold for joint filers" : "$50,000 threshold"} living in the US.`,
    options: [{ id: "ok", label: "Got it", next: "expenses" }],
  },

  // ── deductions ──
  expenses: {
    focus: { section: "deductions", item: "expenses" },
    text: "Before we settle your deductions, let me ask broadly — did you spend money on any of these this year? Tap each one that applies.",
    ui: "multiSelect",
    multiSelect: [
      { id: "mortgage", label: "Paid mortgage interest on a home you own", short: "mortgage interest" },
      { id: "property_tax", label: "Paid property tax", short: "property tax" },
      { id: "charity_cash", label: "Donated cash to a charity", short: "cash donations" },
      { id: "charity_goods", label: "Donated goods or property to a charity (clothes, furniture, stock, etc.)", short: "donated goods" },
      { id: "student_loan", label: "Paid interest on student loans", short: "student loan interest" },
      { id: "medical", label: "Had big out-of-pocket medical or dental bills", short: "medical bills" },
      { id: "childcare", label: "Paid for childcare so you (or your spouse) could work", short: "childcare" },
    ],
    onMultiSelect: (ids) => {
      const short = Object.fromEntries((FILING_NODES.expenses.multiSelect ?? []).map(o => [o.id, o.short]))
      const names = ids.map(id => short[id])
      return {
        reply: ids.length ? `Selected: ${names.join(", ")}` : "None of these apply",
        set: { expenses: ids },
        effect: ids.length
          ? confirm("deductions", "expenses", ...names.map(n => n[0].toUpperCase() + n.slice(1)))
          : confirm("deductions", "expenses", "none"),
        next: ids.some(id => id.startsWith("charity")) ? "charity" : "charity_none",
      }
    },
  },
  charity_none: {
    focus: { section: "deductions", item: "charitable" },
    text: "",
    skip: { when: () => true, tags: ["none this year"], next: "itemize" },
  },
  charity: {
    focus: { section: "deductions", item: "charitable" },
    text: (f) => [
      f.expenses.includes("charity_cash") ? "I have $4,800 in cash donations from your bank and DAF records." : null,
      f.expenses.includes("charity_goods") ? "Your donated goods come to about $1,400 at fair market value — I'll prepare Form 8283 since it's over $500." : null,
      f.expenses.includes("charity_cash") ? "Does $4,800 match your records?" : "Does that look right?",
    ].filter(Boolean).join(" "),
    options: (f) => f.expenses.includes("charity_cash")
      ? [
        { id: "yes", label: "Yes, that's right", set: { charityCash: 4800 }, effect: (ff) => confirm("deductions", "charitable", "$4,800 cash", ...(ff.expenses.includes("charity_goods") ? ["$1,400 goods"] : [])), next: "itemize" },
        { id: "more", label: "It was $6,200", set: { charityCash: 6200 }, effect: (ff) => confirm("deductions", "charitable", "$6,200 cash", ...(ff.expenses.includes("charity_goods") ? ["$1,400 goods"] : [])), next: "charity_receipts" },
        { id: "check", label: "Let me check", reply: "Let me check — use $4,800 for now", set: { charityCash: 4800, charityFlagged: true }, effect: confirm("deductions", "charitable", "$4,800 cash", "flagged for review"), next: "itemize" },
      ]
      : [{ id: "yes", label: "Yes, $1,400 in goods", effect: confirm("deductions", "charitable", "$1,400 goods", "Form 8283"), next: "itemize" }],
  },
  charity_receipts: {
    focus: { section: "deductions", item: "charitable" },
    text: "Updated to $6,200. Any single gift of $250 or more needs a written acknowledgment from the charity — I found receipts for all but one $1,400 donation. Want to add it?",
    options: [
      { id: "later", label: "I'll upload it later", next: "itemize" },
      { id: "have", label: "It's in my email", reply: "It's in my email from Bay Area Food Bank", next: "charity_found" },
    ],
  },
  charity_found: {
    focus: { section: "deductions", item: "charitable" },
    text: "Found it — Bay Area Food Bank, $1,400, March 2026. All your donations are documented now.",
    options: [{ id: "ok", label: "Thanks", next: "itemize" }],
  },
  itemize: {
    focus: { section: "deductions", item: "standard_vs_itemized" },
    text: (f, r) => {
      const parts = [
        r.mortgage ? `mortgage interest (${usd(r.mortgage)})` : null,
        `SALT capped at ${usd(r.salt)}`,
        r.charity ? `charitable (${usd(r.charity)})` : null,
      ].filter(Boolean).join(", ")
      const notes = [
        f.expenses.includes("medical") ? "Medical bills only count above 7.5% of your income, so they don't add anything this year." : null,
        r.studentLoanPhasedOut ? "Student loan interest is phased out at your income level, so it won't reduce your tax." : null,
        f.expenses.includes("childcare") && f.kids > 0 ? `Childcare qualifies for the dependent care credit — ${usd(r.careCredit)}, applied separately.` : null,
      ].filter(Boolean)
      const better = r.recommended === "itemized" ? `Itemized comes out higher at ${usd(r.itemized)}.` : `The standard deduction is higher, so take ${usd(r.standard)}.`
      return `Running the standard deduction (${usd(r.standard)}) against your itemized — ${parts}. ${better}${notes.length ? `\n\n${notes.join(" ")}` : ""}`
    },
    options: (f, r) => {
      const itemized: FilingOption = { id: "itemized", label: "Use itemized", set: { deduction: "itemized" }, effect: confirm("deductions", "standard_vs_itemized", `itemized · ${usd(r.itemized)}`), next: r.recommended === "itemized" ? "retirement" : "itemize_lower" }
      const standard: FilingOption = { id: "standard", label: "Use standard", set: { deduction: "standard" }, effect: confirm("deductions", "standard_vs_itemized", `standard · ${usd(r.standard)}`), next: r.recommended === "standard" ? "retirement" : "itemize_lower" }
      return r.recommended === "itemized" ? [itemized, standard] : [standard, itemized]
    },
  },
  itemize_lower: {
    focus: { section: "deductions", item: "standard_vs_itemized" },
    text: (f, r) => {
      const other = computeReturn({ ...f, deduction: r.recommended })
      return `Done — though that's ${usd(Math.abs(r.itemized - r.standard))} less in deductions, about ${usd(other.totalBack - r.totalBack)} less back. You can switch any time before filing.`
    },
    options: (f, r) => [
      { id: "keep", label: "Keep it", next: "retirement" },
      { id: "switch", label: `Switch to ${r.recommended}`, set: { deduction: r.recommended }, effect: confirm("deductions", "standard_vs_itemized", `${r.recommended} · ${usd(r.recommended === "itemized" ? r.itemized : r.standard)}`), next: "retirement" },
    ],
  },
  retirement: {
    focus: { section: "deductions", item: "retirement" },
    text: (f, r) => r.rothOverLimit
      ? "Your W-2 shows $23,000 to your 401(k) — maxed. I also see $7,000 into a Roth IRA, but your income is above the Roth limit, so a direct contribution would be an excess contribution (6% penalty each year).\n\nHow was the Roth funded?"
      : "Your W-2 shows $23,000 to your 401(k) — maxed. Plus $7,000 in Roth IRA contributions. Include both?",
    options: (f, r) => r.rothOverLimit
      ? [
        { id: "backdoor", label: "It was a backdoor Roth", set: { ira: "backdoor" }, effect: confirm("deductions", "retirement", "401(k) maxed", "backdoor Roth · 8606"), next: "rsu" },
        { id: "recharacterize", label: "Recharacterize to traditional", set: { ira: "recharacterize" }, effect: confirm("deductions", "retirement", "401(k) maxed", "IRA recharacterized"), next: "retirement_rechar" },
        { id: "none", label: "Just the 401(k)", reply: "Just the 401(k) — no IRA this year", set: { ira: "none" }, effect: confirm("deductions", "retirement", "401(k) maxed"), next: "rsu" },
      ]
      : [
        { id: "both", label: "Yes, include both", set: { ira: "roth" }, effect: confirm("deductions", "retirement", "401(k) maxed", "Roth IRA"), next: "rsu" },
        { id: "none", label: "Just the 401(k)", set: { ira: "none" }, effect: confirm("deductions", "retirement", "401(k) maxed"), next: "rsu" },
      ],
  },
  retirement_rechar: {
    focus: { section: "deductions", item: "retirement" },
    text: "I'll note the recharacterization on Form 8606. You'll need to ask your IRA custodian to move the $7,000 plus earnings before the filing deadline — I've added a reminder.",
    options: [{ id: "ok", label: "Will do", next: "rsu" }],
  },

  // ── planning ──
  rsu: {
    focus: { section: "planning", item: "rsu_basis" },
    skip: { when: (f) => f.brokerage === "none", tags: ["no sales this year"], next: "iso" },
    text: (f) => `Your 1099-B under-reports cost basis on 847 RSU shares by $42,103. ${f.statement === "skipped" ? "Without the year-end statement I matched sales to your vest confirmations instead." : "The year-end statement confirms the vest prices."} Adjusting the basis up means you're not taxed twice.`,
    options: [
      { id: "apply", label: "Apply the adjustment", set: { rsuAdjusted: true }, effect: confirm("planning", "rsu_basis", "basis +$42,103"), next: "iso" },
      { id: "keep", label: "Keep the broker's basis", set: { rsuAdjusted: false }, next: "rsu_keep" },
      { id: "more", label: "Tell me more", next: "rsu_more" },
    ],
  },
  rsu_more: {
    focus: { section: "planning", item: "rsu_basis" },
    text: "When RSUs vest, their value is taxed as wages on your W-2 — that becomes your cost basis. Brokers often report $0 basis, so selling looks like pure profit. The adjustment adds the vest value back so only the gain after vesting is taxed.",
    options: reask("rsu"),
  },
  rsu_keep: {
    focus: { section: "planning", item: "rsu_basis" },
    text: (f, r) => {
      const fixed = computeReturn({ ...f, rsuAdjusted: true })
      return `If we keep the broker's basis, $42,103 of income you already paid tax on gets taxed again — about ${usd(fixed.totalBack - r.totalBack)} extra. Are you sure?`
    },
    options: [
      { id: "apply", label: "Apply the adjustment instead", set: { rsuAdjusted: true }, effect: confirm("planning", "rsu_basis", "basis +$42,103"), next: "iso" },
      { id: "keep", label: "Keep the broker's basis", set: { rsuAdjusted: false }, effect: confirm("planning", "rsu_basis", "broker basis", "not adjusted"), next: "iso" },
    ],
  },
  iso: {
    focus: { section: "planning", item: "iso_amt" },
    text: "You exercised 1,200 ISOs in Q3 at a $52 strike when they were worth $89 — a $44,400 AMT preference. That puts you $11,840 into AMT. You'll pay it this year and get it back as a credit in later years.",
    options: [
      { id: "amt", label: "Apply", reply: "Apply the AMT and carry the credit forward", set: { iso: "amt" }, effect: confirm("planning", "iso_amt", "$11,840 AMT", "carryforward"), next: "pfic" },
      { id: "sold", label: "I sold them the same year", set: { iso: "disqualifying" }, next: "iso_sold" },
      { id: "none", label: "I didn't exercise any ISOs", set: { iso: "none" }, effect: na("planning", "iso_amt", "no exercise"), next: "pfic" },
      { id: "more", label: "Tell me more", next: "iso_more" },
    ],
  },
  iso_more: {
    focus: { section: "planning", item: "iso_amt" },
    text: "Exercising ISOs isn't taxed under regular rules, but the spread between strike and market value counts for the alternative minimum tax. If the AMT is higher than your regular tax, you pay the difference — then claim it back as a credit (Form 8801) in years when you're not in AMT.",
    options: reask("iso"),
  },
  iso_sold: {
    focus: { section: "planning", item: "iso_amt" },
    text: "Then it's a disqualifying disposition — no AMT, but the $44,400 spread is taxed as ordinary income. Tech Corp should have added it to your W-2; I'll make sure it isn't counted twice.",
    options: [{ id: "ok", label: "Got it", effect: confirm("planning", "iso_amt", "disqualifying", "+$44,400 income"), next: "pfic" }],
  },
  pfic: {
    focus: { section: "planning", item: "pfic" },
    skip: { when: (f) => !f.pfic, tags: [], next: "state" },
    text: "Your Indian mutual funds are PFICs. Mark-to-market taxes the yearly gain as ordinary income ($2,300 this year) but keeps things simple. The default method defers tax until you sell, then adds an interest charge. The election is hard to undo.",
    options: [
      { id: "mtm", label: "Use mark-to-market", set: { pficMethod: "mtm" }, effect: confirm("planning", "pfic", "mark-to-market", "+$2,300"), next: "state" },
      { id: "default", label: "Use the default method", set: { pficMethod: "default" }, effect: confirm("planning", "pfic", "excess distribution"), next: "state" },
      { id: "cpa", label: "Flag for a CPA review", set: { pficMethod: "cpa" }, effect: confirm("planning", "pfic", "CPA review"), next: "state" },
    ],
  },
  state: {
    focus: { section: "planning", item: "state_tax" },
    text: (f) => ({
      CA: "Running your California return alongside the federal. Standard CA conformity rules apply.",
      TX: "You'll file a part-year California return (540NR) for the months before your move. Texas has no state income tax, so that's it.",
      NY: "You'll file part-year returns in both states — California 540NR and New York IT-203 — and your income is split by your move date.",
    })[f.residency],
    options: (f) => [
      { id: "proceed", label: "Proceed", effect: confirm("planning", "state_tax", ...({ CA: ["CA · standard conformity"], TX: ["CA 540NR", "TX no income tax"], NY: ["CA 540NR", "NY IT-203"] })[f.residency]), next: "draft" },
      { id: "more", label: "Tell me more", next: "state_more" },
    ],
  },
  state_more: {
    focus: { section: "planning", item: "state_tax" },
    text: (f) => f.residency === "CA"
      ? "California taxes capital gains as ordinary income and doesn't allow the federal SALT deduction for state income tax, so your CA return uses its own itemized total. I'll carry everything across from the federal return."
      : "Each state taxes the income you earned while living there. Wages are split by your move date, and investment income follows your residency on the day it was received.",
    options: reask("state"),
  },

  // ── draft & filing ──
  draft: {
    focus: { section: "draft" },
    text: "Got everything I need. Preparing your draft return now — you'll see the progress on the right.",
    auto: { after: 5000, next: "ready" },
  },
  ready: {
    focus: { section: "draft" },
    text: (f, r) => {
      const line = (label: string, n: number) => `${label} ${n >= 0 ? "refund" : "balance due"}: ${usd(n)}`
      return [
        "Your return is ready.",
        [line("Federal", r.fedRefund), line("California", r.caRefund), ...(r.hasNY ? [line("New York", r.nyRefund)] : [])].join("\n"),
        r.totalBack >= 0 ? "Review the summary or the draft before filing." : "You'll owe overall — I can schedule the payment for April 15 when you file.",
      ].join("\n\n")
    },
    options: [
      { id: "file", label: "Review and file", next: "efile" },
      { id: "summary", label: "See the summary", effect: { canvasTab: "summary" }, next: "after_summary" },
      { id: "draft", label: "Open the draft 1040", effect: { canvasTab: "draft" }, next: "after_draft" },
    ],
  },
  after_summary: {
    text: (f, r) => `The summary is on the right — ${usd(r.totalIncome)} in income, ${usd(r.deduction + r.adjustments)} in deductions, and ${usd(r.credits)} in credits.`,
    options: [
      { id: "file", label: "Review and file", next: "efile" },
      { id: "draft", label: "Open the draft 1040", effect: { canvasTab: "draft" }, next: "after_draft" },
    ],
  },
  after_draft: {
    text: "Here's your draft Form 1040. Every line ties back to what we confirmed.",
    options: [
      { id: "file", label: "Review and file", next: "efile" },
      { id: "summary", label: "See the summary", effect: { canvasTab: "summary" }, next: "after_summary" },
    ],
  },
  efile: {
    text: (f, r) => `I'll e-file your ${r.hasNY ? "federal, California and New York" : "federal and California"} returns together${r.fbarRequired ? ", plus your FBAR with FinCEN" : ""}. Sign Form 8879 to authorize the submission.${r.totalBack < 0 ? `\n\nYou'll owe ${usd(-r.totalBack)} in total — I'll schedule it from your checking account for April 15.` : ""}`,
    options: [
      { id: "sign", label: "Sign and e-file", next: "filed" },
      { id: "wait", label: "Not yet", next: "not_yet" },
    ],
  },
  not_yet: {
    text: "No rush — your draft is saved. You have until April 15, and I'll remind you a week before.",
    options: [
      { id: "file", label: "File now after all", next: "efile" },
      { id: "summary", label: "See the summary", effect: { canvasTab: "summary" }, next: "after_summary" },
    ],
  },
  filed: {
    text: (f, r) => {
      const owed = [r.fedRefund, r.caRefund, r.hasNY ? r.nyRefund : 0].filter(n => n < 0).reduce((sum, n) => sum - n, 0)
      return [
        "Submitted ✓",
        [
          "The IRS usually accepts within 24–48 hours.",
          r.fedRefund > 0 ? `Your ${usd(r.fedRefund)} federal refund should arrive by direct deposit in about 21 days.` : null,
          owed > 0 ? `${usd(owed)} in balances due is scheduled for April 15.` : null,
          "I'll notify you when each return is accepted.",
        ].filter(Boolean).join(" "),
      ].join("\n\n")
    },
  },
}
