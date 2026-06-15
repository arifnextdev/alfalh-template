"use client";

import { useEffect, useRef, useState } from "react";
import SingleHadithPoster, {
  DEFAULT_HADITH_FONT_SIZE,
  type SingleHadith,
} from "./SingleHadithPoster";
import ResponsiveA4 from "./ResponsiveA4";
import { exportA4Png } from "./exportPng";

/**
 * SingleHadithPosterEditor
 * ------------------------
 * Customization surface for <SingleHadithPoster /> (2:3 portrait, one hadith).
 * Owns all editable fields and renders a screen-only controls panel beside the
 * live, print-ready preview. Supports Print/PDF and PNG export.
 */

// 140mm × 210mm at 96 CSS dpi.
const POSTER_PX = { width: 529, height: 794 } as const;

export interface SingleHadithPosterEditorProps {
  title?: string;
  hadith?: SingleHadith;
  importantMessage?: string;
  footerMessage?: string;
  organizationName?: string;
  contact?: string;
  logo?: string;
  qrCode?: string;
}

const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/svg+xml";
type ImageSlot = "logo" | "qr";

export default function SingleHadithPosterEditor({
  title: initialTitle = "ইসলামিক উপদেশ",
  hadith: initialHadith = { text: "", reference: "" },
  importantMessage: initialImportant = "",
  footerMessage: initialFooter = "",
  organizationName: initialOrg = "আল-ফালাহ ফাউন্ডেশন",
  contact: initialContact = "",
  logo: initialLogo = "/logo.png",
  qrCode: initialQr = "",
}: SingleHadithPosterEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [hadith, setHadith] = useState<SingleHadith>(initialHadith);
  const [importantMessage, setImportantMessage] = useState(initialImportant);
  const [footerMessage, setFooterMessage] = useState(initialFooter);
  const [organizationName, setOrganizationName] = useState(initialOrg);
  const [contact, setContact] = useState(initialContact);
  const [logo, setLogo] = useState(initialLogo);
  const [qrCode, setQrCode] = useState(initialQr);
  const [exporting, setExporting] = useState(false);

  const posterRef = useRef<HTMLElement>(null);
  const objectUrls = useRef<Record<ImageSlot, string | null>>({
    logo: null,
    qr: null,
  });

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      Object.values(urls).forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, []);

  function handleUpload(
    slot: ImageSlot,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const prev = objectUrls.current[slot];
    if (prev) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(file);
    objectUrls.current[slot] = url;
    (slot === "logo" ? setLogo : setQrCode)(url);
  }

  function clearImage(slot: ImageSlot) {
    const prev = objectUrls.current[slot];
    if (prev) URL.revokeObjectURL(prev);
    objectUrls.current[slot] = null;
    (slot === "logo" ? setLogo : setQrCode)("");
  }

  function updateHadith(patch: Partial<SingleHadith>) {
    setHadith((prev) => ({ ...prev, ...patch }));
  }

  async function downloadPng() {
    const node = posterRef.current;
    if (!node || exporting) return;
    setExporting(true);
    try {
      await exportA4Png(node, "single-hadith-poster.png", 3, POSTER_PX);
    } catch (err) {
      console.error("PNG export failed", err);
      alert("দুঃখিত — PNG তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setExporting(false);
    }
  }

  const fontSize = hadith.fontSize ?? DEFAULT_HADITH_FONT_SIZE;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* ---- Controls (screen only) ------------------------------------- */}
      <aside className="w-full shrink-0 space-y-4 rounded-lg bg-white p-5 shadow-sm lg:w-96 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-800">
            পোস্টার সম্পাদনা
          </h2>
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
              className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-800"
            >
              Print / PDF
            </button>
          </div>
        </div>

        <Field label="শিরোনাম (Title)">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>

        {/* Single hadith */}
        <fieldset className="space-y-2 rounded-md border border-gray-200 p-3">
          <legend className="px-1 text-xs font-semibold text-gray-700">
            হাদিস (Hadith)
          </legend>
          <textarea
            value={hadith.text}
            onChange={(e) => updateHadith({ text: e.target.value })}
            rows={5}
            placeholder="হাদিসের বর্ণনা…"
            className={`${inputCls} resize-y`}
          />
          <input
            type="text"
            value={hadith.reference}
            onChange={(e) => updateHadith({ reference: e.target.value })}
            placeholder="সূত্র (যেমন: সহিহ বুখারি: ৬০৯৮)"
            className={inputCls}
          />
          <div className="flex items-center gap-2 pt-1">
            <span className="shrink-0 text-xs font-medium text-gray-600">
              ফন্ট সাইজ
            </span>
            <input
              type="range"
              min={10}
              max={56}
              step={0.5}
              value={fontSize}
              onChange={(e) =>
                updateHadith({ fontSize: Number(e.target.value) })
              }
              className="h-1.5 flex-1 cursor-pointer accent-green-700"
            />
            <input
              type="number"
              min={10}
              max={56}
              step={0.5}
              value={fontSize}
              onChange={(e) =>
                updateHadith({ fontSize: Number(e.target.value) })
              }
              className="w-16 rounded-md border border-gray-300 bg-white px-1.5 py-1 text-xs text-gray-900"
            />
            <span className="shrink-0 text-xs text-gray-500">pt</span>
          </div>
        </fieldset>

        <Field label="গুরুত্বপূর্ণ বার্তা (Important message)">
          <textarea
            value={importantMessage}
            onChange={(e) => setImportantMessage(e.target.value)}
            rows={3}
            className={`${inputCls} resize-y`}
          />
        </Field>

        <Field label="ফুটার বার্তা (Footer message)">
          <input
            type="text"
            value={footerMessage}
            onChange={(e) => setFooterMessage(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="সংগঠনের নাম (Organization)">
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="যোগাযোগ (Contact)">
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="ফোন / ওয়েবসাইট / ঠিকানা"
            className={inputCls}
          />
        </Field>

        <ImageField
          label="লোগো (Logo — PNG / SVG / JPG)"
          hasImage={Boolean(logo)}
          accept={ACCEPTED_IMAGE_TYPES}
          onUpload={(e) => handleUpload("logo", e)}
          onClear={() => clearImage("logo")}
        />

        <ImageField
          label="QR কোড (QR image)"
          hasImage={Boolean(qrCode)}
          accept={ACCEPTED_IMAGE_TYPES}
          onUpload={(e) => handleUpload("qr", e)}
          onClear={() => clearImage("qr")}
        />
      </aside>

      {/* ---- Live preview ----------------------------------------------- */}
      <div className="min-w-0 flex-1">
        <ResponsiveA4 width={POSTER_PX.width} height={POSTER_PX.height}>
          <SingleHadithPoster
            ref={posterRef}
            title={title}
            hadith={hadith}
            importantMessage={importantMessage}
            footerMessage={footerMessage}
            organizationName={organizationName}
            contact={contact}
            logo={logo}
            qrCode={qrCode}
          />
        </ResponsiveA4>
      </div>
    </div>
  );
}

/* ---- Helpers (screen only) ---------------------------------------------- */

const inputCls =
  "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400";

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

function ImageField({
  label,
  hasImage,
  accept,
  onUpload,
  onClear,
}: {
  label: string;
  hasImage: boolean;
  accept: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={accept}
          onChange={onUpload}
          className="block w-full text-xs text-gray-600 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-gray-200"
        />
        {hasImage ? (
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
  );
}
