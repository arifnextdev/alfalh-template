import Link from "next/link";

/**
 * Home — template hub.
 * Lists the available print-ready, downloadable, customizable A4 templates.
 */

interface TemplateCard {
  href: string;
  name: string;
  description: string;
  size: string;
  tags: string[];
  preview: React.ReactNode;
}

const TEMPLATES: TemplateCard[] = [
  {
    href: "/poster",
    name: "ইসলামিক হাদিস পোস্টার",
    description:
      "A4 portrait Islamic reminder poster — title, multiple Hadith with references, highlighted message box, logo, organization & QR. Green / gold / white, ink-efficient.",
    size: "A4 · 210 × 297mm · Portrait",
    tags: ["Bangla", "Print-ready", "PNG export"],
    preview: <PosterPreview />,
  },
  {
    href: "/flyer",
    name: "Side-Fold Flyer",
    description:
      "A4 two-panel flyer with a dashed center fold line and 90° rotated content for side-fold printing. Editable text, sizes and uploadable logos per panel.",
    size: "A4 · 210 × 297mm · 2 panels",
    tags: ["Fold", "Print-ready", "PNG export"],
    preview: <FlyerPreview />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100">
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Al-Falah Foundation
          </p>
          <h1 className="mt-2 text-3xl font-bold text-green-800 sm:text-4xl">
            Printable Template Library
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Choose a template, customize the content, then print or download a
            high-resolution PNG. Every template is exact A4 and print-optimized.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-56 items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-50 p-4">
                {t.preview}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-green-800">{t.name}</h2>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  {t.size}
                </p>
                <p className="mt-2 flex-1 text-sm text-gray-600">
                  {t.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 transition-all group-hover:gap-2">
                  Open editor →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ---- Tiny scaled-down previews (decorative) ----------------------------- */

function PosterPreview() {
  return (
    <div className="flex h-full w-[140px] flex-col items-center rounded-sm border border-amber-300 bg-white px-3 py-3 shadow-inner">
      <div className="h-1 w-8 rounded-full bg-amber-500" />
      <div className="mt-1.5 text-center text-[7px] font-bold leading-tight text-green-800">
        সতর্কবার্তা ও ইসলামিক উপদেশ
      </div>
      <div className="mt-1 h-px w-16 bg-green-700" />
      <div className="mt-2 space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-0.5">
            <div className="h-1 w-24 rounded bg-gray-300" />
            <div className="h-1 w-16 rounded bg-gray-300" />
            <div className="ml-auto h-1 w-8 rounded bg-amber-400" />
          </div>
        ))}
      </div>
      <div className="mt-2 h-5 w-full rounded-sm border border-green-700 bg-green-50" />
      <div className="mt-auto flex w-full items-end justify-between pt-2">
        <div className="h-3 w-6 rounded-sm bg-gray-300" />
        <div className="h-2 w-10 rounded bg-green-700" />
        <div className="h-5 w-5 rounded-sm border border-green-700" />
      </div>
    </div>
  );
}

function FlyerPreview() {
  return (
    <div className="flex h-full w-[140px] rounded-sm border border-gray-300 bg-white shadow-inner">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`flex flex-1 flex-col items-center justify-center gap-2 py-4 ${
            i === 0 ? "border-r border-dashed border-gray-400" : ""
          }`}
        >
          <div className="text-[8px] font-bold tracking-wide text-gray-700 [writing-mode:vertical-rl]">
            TEXT
          </div>
          <div className="mt-auto h-3 w-8 rounded-sm bg-gray-300" />
        </div>
      ))}
    </div>
  );
}
