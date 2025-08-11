import { Header } from "@/components/shared/header/index";
import { Footer } from "@/components/shared/footer/Footer";
import { QuickViewModal } from "@/components/modules/products/QuickViewModal";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
{/*       <Header /> */}
      <main className="flex-grow">
        {children}
      </main>
{/*       <Footer /> */}

      {/* Render the modal here so it's globally available */}
      <QuickViewModal />
    </div>
  );
}