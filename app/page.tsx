import Link from "next/link"

const demos = [
  {
    href: "/onboarding",
    label: "Onboarding",
    description: "Upload flow, document parsing states, analysis, and ready screen.",
  },
  {
    href: "/thrive-ai",
    label: "Thrive AI",
    description: "Tax planning and filing workspace with chat-driven guidance.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf8] px-6 py-12 text-[#11110f]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col justify-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-[#817b70]">
          Thrive UI Preview
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">
          Onboarding and Thrive AI demos
        </h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group rounded-lg border border-[#ded9cf] bg-white p-6 transition hover:border-[#11110f] hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">{demo.label}</h2>
                <span className="text-lg transition group-hover:translate-x-1">
                  -&gt;
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#676258]">
                {demo.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
