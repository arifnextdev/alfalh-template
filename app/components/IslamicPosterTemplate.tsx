import type { Ref } from "react";

/**
 * IslamicPosterTemplate
 * ---------------------
 * A print-perfect A4 portrait (210mm × 297mm) Islamic reminder / Hadith poster,
 * intended for outdoor notice boards, mosques, shops and community walls.
 *
 * Design language
 *   - Palette: deep green / white / black / gold (high contrast, ink-efficient).
 *   - No human or animal imagery. Subtle Islamic geometric (girih) pattern and
 *     a faint mosque silhouette as background accents only.
 *   - Clear hierarchy: large headline → hadith body → reference → highlighted
 *     message box → footer (logo / organization / QR).
 *   - Print-safe margins via an inner padded frame.
 *
 * Pure presentational component — all editing lives in <PosterEditor />.
 * Typography uses the Bangla font CSS variables defined in app/layout.tsx.
 */

const GREEN = "#0B5D34";
const GREEN_SOFT = "#EEF5EF";
const GOLD = "#B8902F";
const BLACK = "#141414";

export interface Hadith {
  text: string;
  reference: string;
  /** Body font size in points. Defaults to 15pt when unset. */
  fontSize?: number;
}

/** Default hadith body font size (pt) used when a hadith has none set. */
export const DEFAULT_HADITH_FONT_SIZE = 15;

export interface IslamicPosterTemplateProps {
  title: string;
  hadiths: Hadith[];
  importantMessage: string;
  importantLabel?: string;
  footerMessage: string;
  organizationName: string;
  contact?: string;
  /** Logo image src (PNG / SVG / JPG). */
  logo: string;
  logoAlt?: string;
  /** QR code image src; a styled placeholder is shown when empty. */
  qrCode?: string;
  /** Ref to the root A4 <article> (used for PNG export). */
  ref?: Ref<HTMLElement>;
}

/* ---- Background accents (geometric pattern + mosque silhouette) --------- */

function PosterBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Subtle 8-point girih pattern — light green strokes, ink-efficient. */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern
            id="girih"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke={GREEN} strokeWidth="0.6">
              <rect x="11" y="11" width="22" height="22" />
              <polygon points="22,4 40,22 22,40 4,22" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih)" opacity="0.05" />
      </svg>

      {/* Faint mosque silhouette behind the footer. */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 600 160"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <g fill={GREEN} opacity="0.07">
          <rect x="0" y="120" width="600" height="40" />
          {/* minarets */}
          <rect x="70" y="44" width="13" height="76" />
          <circle cx="76.5" cy="44" r="9" />
          <rect x="74.5" y="22" width="4" height="16" />
          <rect x="517" y="44" width="13" height="76" />
          <circle cx="523.5" cy="44" r="9" />
          <rect x="521.5" y="22" width="4" height="16" />
          {/* side domes */}
          <path d="M150 120 A46 56 0 0 1 242 120 Z" />
          <path d="M358 120 A46 56 0 0 1 450 120 Z" />
          {/* central onion dome */}
          <path d="M256 120 C256 68 288 40 300 24 C312 40 344 68 344 120 Z" />
          <rect x="297" y="6" width="6" height="20" />
        </g>
      </svg>
    </div>
  );
}

/* ---- Corner ornament ---------------------------------------------------- */

function Corner({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`absolute h-[10mm] w-[10mm] ${className}`}
      fill="none"
      stroke={GOLD}
      strokeWidth="1.4"
    >
      <path d="M2 14 V2 H14" />
      <path d="M7 19 V7 H19" />
      <circle cx="7" cy="7" r="1.6" fill={GOLD} stroke="none" />
    </svg>
  );
}

export default function IslamicPosterTemplate({
  title,
  hadiths,
  importantMessage,
  importantLabel = "গুরুত্বপূর্ণ বার্তা",
  footerMessage,
  organizationName,
  contact,
  logo,
  logoAlt = "Logo",
  qrCode,
  ref,
}: IslamicPosterTemplateProps) {
  return (
    <article
      ref={ref}
      style={{
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        fontFamily: "var(--font-bangla), sans-serif",
        color: BLACK,
      }}
      className="relative h-[297mm] w-[210mm] overflow-hidden bg-white shadow-lg print:shadow-none"
    >
      <PosterBackground />

      {/* Decorative double frame (gold outer + green inner) with safe margin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8mm] border-2"
        style={{ borderColor: GOLD }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10mm] border"
        style={{ borderColor: GREEN }}
      />
      <Corner className="left-[8mm] top-[8mm]" />
      <Corner className="right-[8mm] top-[8mm] rotate-90" />
      <Corner className="bottom-[8mm] right-[8mm] rotate-180" />
      <Corner className="bottom-[8mm] left-[8mm] -rotate-90" />

      {/* ---- Content (print-safe inner padding) ---------------------------- */}
      <div className="relative flex h-full flex-col px-[18mm] py-[16mm]">
        {/* Header */}
        <header className="text-center">
          <div
            className="mx-auto mb-[3mm] h-[1.2mm] w-[24mm] rounded-full"
            style={{ backgroundColor: GOLD }}
          />
          <h1
            style={{
              fontFamily: "var(--font-bangla-serif), serif",
              color: GREEN,
              fontSize: "30pt",
            }}
            className="font-bold leading-tight"
          >
            {title}
          </h1>
          <div className="mt-[3mm] flex items-center justify-center gap-[3mm]">
            <span
              className="h-[0.5mm] w-[26mm]"
              style={{ backgroundColor: GREEN }}
            />
            <span
              className="text-[14pt]"
              style={{ color: GOLD }}
              aria-hidden
            >
              ❖
            </span>
            <span
              className="h-[0.5mm] w-[26mm]"
              style={{ backgroundColor: GREEN }}
            />
          </div>
        </header>

        {/* Hadith list */}
        <section className="flex flex-1 flex-col justify-center gap-[6mm] py-[6mm]">
          {hadiths.map((h, i) => (
            <figure key={i} className="text-center">
              <blockquote
                className="font-medium leading-snug"
                style={{
                  color: BLACK,
                  fontSize: `${h.fontSize ?? DEFAULT_HADITH_FONT_SIZE}pt`,
                }}
              >
                {h.text}
              </blockquote>
              <figcaption
                className="mt-[2mm] text-[11pt] font-semibold"
                style={{ color: GOLD }}
              >
                — {h.reference}
              </figcaption>
              {i < hadiths.length - 1 && (
                <div
                  aria-hidden
                  className="mx-auto mt-[5mm] h-[0.4mm] w-[40mm] opacity-60"
                  style={{ backgroundColor: GREEN }}
                />
              )}
            </figure>
          ))}
        </section>

        {/* Important highlighted message box */}
        {importantMessage ? (
          <section
            className="rounded-[2mm] border-2 px-[8mm] py-[5mm] text-center"
            style={{ borderColor: GREEN, backgroundColor: GREEN_SOFT }}
          >
            <div
              className="mb-[2mm] inline-block rounded-full px-[5mm] py-[1mm] text-[10pt] font-bold text-white"
              style={{ backgroundColor: GREEN }}
            >
              {importantLabel}
            </div>
            <p
              className="text-[13.5pt] font-bold leading-snug"
              style={{ color: GREEN }}
            >
              {importantMessage}
            </p>
          </section>
        ) : null}

        {/* Footer message */}
        {footerMessage ? (
          <p
            className="mt-[6mm] text-center text-[12.5pt] font-semibold"
            style={{ color: BLACK }}
          >
            {footerMessage}
          </p>
        ) : null}

        {/* Bottom row: logo · organization · QR */}
        <footer className="mt-[6mm] flex items-end justify-between gap-[6mm]">
          {/* Logo */}
          <div className="flex w-[42mm] flex-col items-center gap-[1.5mm]">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={logoAlt}
                className="max-h-[20mm] w-auto max-w-[40mm] object-contain"
              />
            ) : (
              <div
                className="flex h-[18mm] w-[34mm] items-center justify-center border border-dashed text-[9pt]"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                লোগো
              </div>
            )}
          </div>

          {/* Organization / contact */}
          <div className="flex-1 text-center">
            <div
              className="text-[12.5pt] font-bold"
              style={{ color: GREEN }}
            >
              {organizationName}
            </div>
            {contact ? (
              <div className="mt-[1mm] text-[9.5pt]" style={{ color: BLACK }}>
                {contact}
              </div>
            ) : null}
          </div>

          {/* QR code */}
          <div className="flex w-[42mm] flex-col items-center gap-[1.5mm]">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCode}
                alt="QR code"
                className="h-[24mm] w-[24mm] object-contain"
              />
            ) : (
              <div
                className="flex h-[24mm] w-[24mm] flex-col items-center justify-center border-2 border-dashed text-center text-[8pt] leading-tight"
                style={{ borderColor: GREEN, color: GREEN }}
              >
                <span className="text-[12pt]" aria-hidden>
                  ▣
                </span>
                QR কোড
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
