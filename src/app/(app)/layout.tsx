import { Header } from "@/app/(app)/layout/header/header";
import { Sidebar } from "@/app/(app)/layout/sidebar/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-area">
      <Sidebar />
      <div className="app-layout">
        <Header />
        <div>
          {children}
        </div>
      </div>
    </main>
  );
}
