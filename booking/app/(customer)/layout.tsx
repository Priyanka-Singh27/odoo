import AppHeader from "@/components/shared/AppHeader";
import AppSidebar from "@/components/shared/AppSidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
