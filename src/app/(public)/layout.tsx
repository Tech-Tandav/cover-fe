import { Header } from "@/components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { SiteSettingsProvider } from "@/components/custom/SiteSettingsProvider";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteSettingsProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-6 md:py-10">
          {children}
        </main>
        <Footer />
      </div>
    </SiteSettingsProvider>
  );
}
