"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import A4FlyerTemplate from "./A4FlyerTemplate";
import ResponsiveA4 from "./ResponsiveA4";

// A4 at 96 CSS dpi. pixelRatio bumps it to print-quality resolution.
const A4_PX = { width: 794, height: 1123 };
const EXPORT_PIXEL_RATIO = 3; // ~2382 × 3369 px PNG

/**
 * FlyerEditor
 * -----------
 * The customization surface for <A4FlyerTemplate />, kept entirely separate
 * from the flyer itself. It owns all editable state — text, text size, logo
 * (with file upload), logo size and rotation — and renders a controls panel
 * (left, screen-only) beside the live A4 preview (right).
 *
 * The controls panel is `print:hidden`, so only the flyer prints.
 */

export interface FlyerEditorProps {
  leftText?: string;
  rightText?: string;
  leftLogo?: string;
  rightLogo?: string;
  leftTextSize?: number;
  rightTextSize?: number;
  leftLogoSize?: number;
  rightLogoSize?: number;
  rotation?: 90 | -90;
}

const ACCEPTED_LOGO_TYPES = "image/png,image/jpeg,image/svg+xml";
const TEXT_SIZE = { min: 12, max: 96 }; // pt
const LOGO_SIZE = { min: 8, max: 60 }; // mm

type Side = "left" | "right";

export default function FlyerEditor({
  leftText: initialLeftText = "Left Text",
  rightText: initialRightText = "Right Text",
  leftLogo: initialLeftLogo = "/logo.png",
  rightLogo: initialRightLogo = "/logo.png",
  leftTextSize: initialLeftTextSize = 42,
  rightTextSize: initialRightTextSize = 42,
  leftLogoSize: initialLeftLogoSize = 28,
  rightLogoSize: initialRightLogoSize = 28,
  rotation: initialRotation = 90,
}: FlyerEditorProps) {
  const [leftText, setLeftText] = useState(initialLeftText);
  const [rightText, setRightText] = useState(initialRightText);
  const [leftLogo, setLeftLogo] = useState(initialLeftLogo);
  const [rightLogo, setRightLogo] = useState(initialRightLogo);
  const [leftTextSize, setLeftTextSize] = useState(initialLeftTextSize);
  const [rightTextSize, setRightTextSize] = useState(initialRightTextSize);
  const [leftLogoSize, setLeftLogoSize] = useState(initialLeftLogoSize);
  const [rightLogoSize, setRightLogoSize] = useState(initialRightLogoSize);
  const [rotation, setRotation] = useState<90 | -90>(initialRotation);
  const [exporting, setExporting] = useState(false);

  // Ref to the A4 <article>, used to rasterize the flyer to PNG.
  const flyerRef = useRef<HTMLElement>(null);

  // Track object URLs per side so we can revoke them and avoid memory leaks.
  const objectUrls = useRef<Record<Side, string | null>>({
    left: null,
    right: null,
  });

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      Object.values(urls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  function handleUpload(side: Side, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const prev = objectUrls.current[side];
    if (prev) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(file);
    objectUrls.current[side] = url;
    (side === "left" ? setLeftLogo : setRightLogo)(url);
  }

  function clearLogo(side: Side) {
    const prev = objectUrls.current[side];
    if (prev) URL.revokeObjectURL(prev);
    objectUrls.current[side] = null;
    (side === "left" ? setLeftLogo : setRightLogo)("");
  }

  async function downloadPng() {
    const node = flyerRef.current;
    if (!node || exporting) return;
    setExporting(true);
    try {
      // Capture at true A4 size regardless of the on-screen responsive scale,
      // and strip the preview's shadow/transform from the rasterized clone.
      const dataUrl = await toPng(node, {
        width: A4_PX.width,
        height: A4_PX.height,
        pixelRatio: EXPORT_PIXEL_RATIO,
        cacheBust: true,
        backgroundColor: "#ffffff",
        style: { transform: "none", margin: "0", boxShadow: "none" },
      });
      const link = document.createElement("a");
      link.download = "flyer.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed", err);
      alert("Sorry — PNG export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* ---- Controls panel (screen only) ------------------------------- */}
      <aside className="w-full shrink-0 space-y-5 rounded-lg bg-white p-5 shadow-sm lg:w-80 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-800">Customize</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadPng}
              disabled={exporting}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            >
              Print / PDF
            </button>
          </div>
        </div>

        {/* Global */}
        <Field label="Rotation">
          <select
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value) as 90 | -90)}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
          >
            <option value={90}>90° (clockwise)</option>
            <option value={-90}>-90° (counter-clockwise)</option>
          </select>
        </Field>

        <SidePanel
          title="Left panel"
          text={leftText}
          onText={setLeftText}
          textSize={leftTextSize}
          onTextSize={setLeftTextSize}
          logo={leftLogo}
          logoSize={leftLogoSize}
          onLogoSize={setLeftLogoSize}
          onUpload={(e) => handleUpload("left", e)}
          onClear={() => clearLogo("left")}
          accept={ACCEPTED_LOGO_TYPES}
        />

        <SidePanel
          title="Right panel"
          text={rightText}
          onText={setRightText}
          textSize={rightTextSize}
          onTextSize={setRightTextSize}
          logo={rightLogo}
          logoSize={rightLogoSize}
          onLogoSize={setRightLogoSize}
          onUpload={(e) => handleUpload("right", e)}
          onClear={() => clearLogo("right")}
          accept={ACCEPTED_LOGO_TYPES}
        />
      </aside>

      {/* ---- Live A4 preview (scales down on small screens) ------------- */}
      <div className="min-w-0 flex-1">
        <ResponsiveA4>
          <A4FlyerTemplate
            ref={flyerRef}
            leftText={leftText}
            rightText={rightText}
            leftLogo={leftLogo}
            rightLogo={rightLogo}
            leftTextSize={leftTextSize}
            rightTextSize={rightTextSize}
            leftLogoSize={leftLogoSize}
            rightLogoSize={rightLogoSize}
            rotation={rotation}
          />
        </ResponsiveA4>
      </div>
    </div>
  );
}

/* ---- Small presentational helpers (screen only) -------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

interface SidePanelProps {
  title: string;
  text: string;
  onText: (v: string) => void;
  textSize: number;
  onTextSize: (v: number) => void;
  logo: string;
  logoSize: number;
  onLogoSize: (v: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  accept: string;
}

function SidePanel({
  title,
  text,
  onText,
  textSize,
  onTextSize,
  logo,
  logoSize,
  onLogoSize,
  onUpload,
  onClear,
  accept,
}: SidePanelProps) {
  return (
    <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
      <legend className="px-1 text-xs font-semibold text-gray-700">
        {title}
      </legend>

      <Field label="Text">
        <textarea
          value={text}
          onChange={(e) => onText(e.target.value)}
          rows={2}
          placeholder="Enter panel text…"
          className="w-full resize-y rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </Field>

      <Field label={`Text size — ${textSize}pt`}>
        <input
          type="number"
          min={TEXT_SIZE.min}
          max={TEXT_SIZE.max}
          value={textSize}
          onChange={(e) => onTextSize(clamp(Number(e.target.value), TEXT_SIZE))}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </Field>

      <Field label="Logo (PNG / SVG / JPG)">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept={accept}
            onChange={onUpload}
            className="block w-full text-xs text-gray-600 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-gray-200"
          />
          {logo ? (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          ) : null}
        </div>
      </Field>

      <Field label={`Logo size — ${logoSize}mm`}>
        <input
          type="number"
          min={LOGO_SIZE.min}
          max={LOGO_SIZE.max}
          value={logoSize}
          onChange={(e) => onLogoSize(clamp(Number(e.target.value), LOGO_SIZE))}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </Field>
    </fieldset>
  );
}

function clamp(v: number, { min, max }: { min: number; max: number }) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
