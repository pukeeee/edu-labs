import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1E1F29] to-[#282A36] p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="text-8xl font-bold text-[#8BE9FD]">404</div>

        <h1 className="text-3xl font-bold text-[#F8F8F2]">
          Сторінка не знайдена
        </h1>

        <p className="text-lg text-[#6272A4]">
          Схоже, ви перейшли за неіснуючим посиланням або сторінка була
          видалена.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <Home className="mr-2 w-5 h-5" />
            Повернутися на головну
          </Link>
        </Button>
      </div>
    </div>
  );
}
