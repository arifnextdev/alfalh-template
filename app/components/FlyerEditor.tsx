"use client";

import { useEffect, useRef, useState } from "react";
import FoldPanelTemplate from "./FoldPanelTemplate";
import ResponsiveA4 from "./ResponsiveA4";
import {
  downloadFlyersPdf,
  downloadFlyersPng,
  PANEL_PX,
  type Rotation,
} from "./exportFlyers";

/**
 * FlyerEditor
 * -----------
 * The customization surface for the side-fold flyer. It owns:
 *   - a shared "foundation" block (logo, org name, contact, address) reused on
 *     every copy,
 *   - a list of copies, each a <FoldPanelTemplate> sharing the same design with
 *     its own changeable title,
 *   - export rotation (0° / 90° / -90°) for the physical fold.
 *
 * All copies download together as one multi-page PDF or one stacked PNG. The
 * controls panel is `print:hidden`; only the panels render in the preview.
 */

export interface FlyerEditorProps {
  orgName?: string;
  contact?: string;
  address?: string;
  logo?: string;
  /** Starter titles — one panel per entry. */
  titles?: string[];
  titleSize?: number;
  rotation?: Rotation;
}

const ACCEPTED_LOGO_TYPES = "image/png,image/jpeg,image/svg+xml";
const TITLE_SIZE = { min: 16, max: 240 }; // pt

interface Copy {
  id: number;
  title: string;
  titleSize: number;
}

export default function FlyerEditor({
  orgName: initialOrgName = "Al-Falah Foundation",
  contact: initialContact = "",
  address: initialAddress = "",
  logo: initialLogo = "/logo.png",
  titles: initialTitles = ["Title"],
  titleSize: initialTitleSize = 120,
  rotation: initialRotation = 90,
}: FlyerEditorProps) {
  const [orgName, setOrgName] = useState(initialOrgName);
  const [contact, setContact] = useState(initialContact);
  const [address, setAddress] = useState(initialAddress);
  const [logo, setLogo] = useState(initialLogo);
  const [rotation, setRotation] = useState<Rotation>(initialRotation);
  const [exporting, setExporting] = useState(false);

  const nextId = useRef(initialTitles.length);
  const [copies, setCopies] = useState<Copy[]>(() =>
    initialTitles.map((title, i) => ({
      id: i,
      title,
      titleSize: initialTitleSize,
    })),
  );

  // One ref per copy panel, used to rasterize each panel for export.
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  // Track the uploaded logo's object URL so we can revoke it (avoid leaks).
  const logoUrl = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    };
  }, []);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    const url = URL.createObjectURL(file);
    logoUrl.current = url;
    setLogo(url);
  }

  function clearLogo() {
    if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    logoUrl.current = null;
    setLogo("");
  }

  function updateCopy(i: number, patch: Partial<Copy>) {
    setCopies((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function addCopy() {
    setCopies((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: nextId.current++,
          title: "Title",
          titleSize: last ? last.titleSize : initialTitleSize,
        },
      ];
    });
  }

  function removeCopy(i: number) {
    setCopies((prev) => prev.filter((_, idx) => idx !== i));
  }

  function collectNodes(): HTMLElement[] {
    return panelRefs.current
      .slice(0, copies.length)
      .filter((n): n is HTMLElement => n != null);
  }

  async function runExport(kind: "pdf" | "png") {
    const nodes = collectNodes();
    if (nodes.length === 0 || exporting) return;
    setExporting(true);
    try {
      if (kind === "pdf") {
        await downloadFlyersPdf(nodes, rotation);
      } else {
        await downloadFlyersPng(nodes, rotation);
      }
    } catch (err) {
      console.error(`${kind.toUpperCase()} export failed`, err);
      alert(`Sorry — ${kind.toUpperCase()} export failed. Please try again.`);
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
              onClick={() => runExport("png")}
              disabled={exporting}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={() => runExport("pdf")}
              disabled={exporting}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Export rotation */}
        <Field label="Export rotation (for fold)">
          <select
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value) as Rotation)}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
          >
            <option value={0}>0° (landscape, as previewed)</option>
            <option value={90}>90° (clockwise)</option>
            <option value={-90}>-90° (counter-clockwise)</option>
          </select>
        </Field>

        {/* Shared foundation info */}
        <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
          <legend className="px-1 text-xs font-semibold text-gray-700">
            Foundation info (shared)
          </legend>

          <Field label="Organization name">
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
            />
          </Field>

          <Field label="Contact (phone / website)">
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. +880… · alfalah.org"
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
            />
          </Field>

          <Field label="Address">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city"
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
            />
          </Field>

          <Field label="Logo (PNG / SVG / JPG)">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept={ACCEPTED_LOGO_TYPES}
                onChange={handleLogoUpload}
                className="block w-full text-xs text-gray-600 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-gray-200"
              />
              {logo ? (
                <button
                  type="button"
                  onClick={clearLogo}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </Field>
        </fieldset>

        {/* Per-copy titles */}
        <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <legend className="px-1 text-xs font-semibold text-gray-700">
              Copies ({copies.length})
            </legend>
            <button
              type="button"
              onClick={addCopy}
              className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              + Add copy
            </button>
          </div>

          {copies.map((copy, i) => (
            <div
              key={copy.id}
              className="space-y-2 rounded-md border border-gray-100 bg-gray-50 p-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Copy {i + 1}
                </span>
                {copies.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeCopy(i)}
                    className="rounded-md px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <Field label="Title">
                <textarea
                  value={copy.title}
                  onChange={(e) => updateCopy(i, { title: e.target.value })}
                  rows={2}
                  placeholder="Enter title…"
                  className="w-full resize-y rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400"
                />
              </Field>

              <Field label={`Title size — ${copy.titleSize}pt`}>
                <input
                  type="number"
                  min={TITLE_SIZE.min}
                  max={TITLE_SIZE.max}
                  value={copy.titleSize}
                  onChange={(e) =>
                    updateCopy(i, {
                      titleSize: clamp(Number(e.target.value), TITLE_SIZE),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
                />
              </Field>
            </div>
          ))}
        </fieldset>
      </aside>

      {/* ---- Live preview: one landscape panel per copy ----------------- */}
      <div className="min-w-0 flex-1 space-y-6">
        {copies.map((copy, i) => (
          <ResponsiveA4 key={copy.id} width={PANEL_PX.width} height={PANEL_PX.height}>
            <FoldPanelTemplate
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              title={copy.title}
              titleSize={copy.titleSize}
              orgName={orgName}
              contact={contact}
              address={address}
              logo={logo}
              logoAlt={orgName}
            />
          </ResponsiveA4>
        ))}
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

function clamp(v: number, { min, max }: { min: number; max: number }) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
