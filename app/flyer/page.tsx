import FlyerEditor from "../components/FlyerEditor";

/**
 * Example usage.
 *
 * The page only supplies initial values. All editing/customization lives in
 * <FlyerEditor /> (a separate controls panel), which renders the live A4
 * preview via <A4FlyerTemplate />. On print, only the flyer prints — the
 * controls panel is hidden.
 */
export default function FlyerExamplePage() {
  return (
    <main className="min-h-screen bg-gray-200 p-3 sm:p-6 print:bg-white print:p-0">
      <FlyerEditor
        leftText="Grand Opening"
        rightText="50% Off Today"
        leftLogo="/next.svg"
        rightLogo="/vercel.svg"
        leftTextSize={48}
        rightTextSize={40}
        leftLogoSize={26}
        rightLogoSize={22}
        rotation={90}
      />
    </main>
  );
}
