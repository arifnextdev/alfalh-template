import SingleHadithPosterEditor from "../components/SingleHadithPosterEditor";

/**
 * Single-hadith poster editor — 2:3 portrait (140 × 210mm), print & PNG ready.
 * One hadith as the hero element, with customizable body font size.
 */
export default function SingleHadithPage() {
  return (
    <main className="min-h-screen bg-gray-200 p-3 sm:p-6 print:bg-white print:p-0">
      <SingleHadithPosterEditor
        title="ইসলামিক উপদেশ"
        hadith={{
          text: "যে ব্যক্তি প্রতারণা করে, সে আমার দলভুক্ত (উম্মত) নয়।",
          reference: "সহীহ মুসলিম",
          fontSize: 26,
        }}
        importantMessage="সততা ও আমানতদারিতা একজন মুমিনের পরিচয়।"
        footerMessage="আল্লাহর সন্তুষ্টির উদ্দেশ্যে এই বার্তা প্রচার করুন"
        organizationName="আল-ফালাহ ফাউন্ডেশন"
        contact="www.al-falah.org"
        logo="/logo.png"
      />
    </main>
  );
}
