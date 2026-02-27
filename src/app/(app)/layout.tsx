import { Header } from "@/app/(app)/layout/header";
import { Sidebar } from "@/app/(app)/layout/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-area">
      <Header />
      <Sidebar />
      <div className="content">{children}</div>
    </main>
  );
}
