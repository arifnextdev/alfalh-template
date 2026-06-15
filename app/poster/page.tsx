import PosterEditor from "../components/PosterEditor";

/**
 * Islamic Hadith poster editor — A4 portrait, print & PNG ready.
 * The page supplies the example content; all editing happens in <PosterEditor />.
 */
export default function PosterPage() {
  return (
    <main className="min-h-screen bg-gray-200 p-3 sm:p-6 print:bg-white print:p-0">
      <PosterEditor
        title="সতর্কবার্তা ও ইসলামিক উপদেশ"
        hadiths={[
          {
            text: "মুনাফিকের নিদর্শন হলো তিনটি: কথা বললে মিথ্যা বলে, প্রতিশ্রুতি দিলে তা ভঙ্গ করে এবং তার কাছে আমানত রাখলে তা খেয়ানত করে।",
            reference: "সহিহ বুখারি: ৬০৯৮",
          },
          {
            text: "যে ব্যক্তি প্রতারণা করে, সে আমার দলভুক্ত (উম্মত) নয়।",
            reference: "সহীহ মুসলিম",
          },
          {
            text: "সুদদাতা, সুদ-গ্রহীতা, সুদ-লেখক ও সাক্ষী সবাই সমান অপরাধী।",
            reference: "বুখারী ও মুসলিম",
          },
        ]}
        importantMessage="সুদ ইসলামের দৃষ্টিতে জঘন্যতম হারাম ও গুনাহের কাজ, যা ব্যক্তি, পরিবার ও সমাজের অর্থনৈতিক ভারসাম্য নষ্ট করে।"
        footerMessage="আল্লাহর সন্তুষ্টির উদ্দেশ্যে এই বার্তা প্রচার করুন"
        organizationName="আল-ফালাহ ফাউন্ডেশন"
        contact="www.al-falah.org"
        logo="/logo.png"
      />
    </main>
  );
}
