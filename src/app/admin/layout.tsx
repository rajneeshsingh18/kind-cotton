import { SidebarNav } from "./_components/SidebarNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
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
      {/* Main Content */}
      <div className="flex flex-col">
        {/* We can add a header here later if needed */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}