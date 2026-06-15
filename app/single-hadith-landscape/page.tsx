import SingleHadithPosterEditor from "../components/SingleHadithPosterEditor";

/**
 * Single-hadith poster editor — 3:2 landscape (210 × 140mm), print & PNG ready.
 * One hadith as the hero element, with customizable body font size.
 */
export default function SingleHadithLandscapePage() {
  return (
    <main className="min-h-screen bg-gray-200 p-3 sm:p-6 print:bg-white print:p-0">
      <SingleHadithPosterEditor
        orientation="landscape"
        title="ইসলামিক উপদেশ"
        hadith={{
          text: "যে ব্যক্তি প্রতারণা করে, সে আমার দলভুক্ত (উম্মত) নয়।",
          reference: "সহীহ মুসলিম",
          fontSize: 24,
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
