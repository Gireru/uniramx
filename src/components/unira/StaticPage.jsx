import PublicHeader from "@/components/unira/PublicHeader";
import Footer from "@/components/unira/Footer";

export default function StaticPage({ titulo, children }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="max-w-[760px] mx-auto px-4 md:px-6 py-10">
        <h1 className="font-serif-cond text-4xl md:text-[56px] md:leading-[60px]">{titulo}</h1>
        <div className="mt-6 space-y-4 text-[16px] leading-6 text-foreground">{children}</div>
      </main>
      <Footer />
    </div>
  );
}