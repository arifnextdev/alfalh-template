import FlyerEditor from "../components/FlyerEditor";

/**
 * Side-fold flyer page.
 *
 * Supplies initial values only. All editing lives in <FlyerEditor /> (a
 * separate controls panel), which renders one landscape reading-panel per copy
 * via <FoldPanelTemplate />. Each copy shares the same design + foundation info
 * with its own changeable title; all copies download together as one PDF or PNG
 * (optionally rotated for the physical fold).
 */
export default function FlyerExamplePage() {
  return (
    <main className="min-h-screen bg-gray-200 p-3 sm:p-6 print:bg-white print:p-0">
      <FlyerEditor
        orgName="Al-Falah Foundation"
        contact="+880 1234-567890 · alfalah.org"
        address="123 Main Road, Dhaka"
        logo="/logo.png"
        titles={["Title"]}
        titleSize={120}
        rotation={90}
      />
    </main>
  );
}
