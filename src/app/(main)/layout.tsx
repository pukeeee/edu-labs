import { Header } from "@/widgets/header/ui/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-14 md:pt-16">{children}</main>
    </div>
  );
}
