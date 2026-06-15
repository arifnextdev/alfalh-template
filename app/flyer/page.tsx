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
        leftText="Al-Falah Foundation"
        rightText="Al-Falah Foundation"
        leftLogo="/logo.png"
        rightLogo="/logo.png"
        leftTextSize={48}
        rightTextSize={48}
        leftLogoSize={26}
        rightLogoSize={26}
        rotation={90}
      />
    </main>
  );
}
