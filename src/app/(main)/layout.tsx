import { Suspense } from "react";
import { Header } from "@/widgets/header/ui/Header";
import { Skeleton } from "@/shared/ui/skeleton";
import { Footer } from "@/widgets/footer/ui/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<Skeleton className="h-14 md:h-16 w-full" />}>
        <Header />
      </Suspense>
      <main className="flex-1 pt-14 md:pt-16">{children}</main>
      <Footer />
    </div>
  );
}
