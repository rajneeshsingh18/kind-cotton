import { SidebarNav } from "./_components/SidebarNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar (Fixed on the left) */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <h1 className="text-lg font-bold">KindCotton Admin</h1>
          </div>
          <div className="flex-1 p-4">
            <SidebarNav />
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* The main content now dynamically adjusts its bottom padding on mobile */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur p-2">
        <SidebarNav />
      </div>
    </div>
  );
}