import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Статистика",
};

export default async function StatsPage() {
  // TODO: Отримати детальну статистику з БД

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Статистика</h1>
        <p className="text-muted-foreground">
          Відслідковуй свій прогрес та досягнення
        </p>
      </div>

      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Розділ статистики в розробці
        </h2>
        <p className="text-muted-foreground mt-2">
          Незабаром тут з&aposявляться детальні графіки вашої активності.
        </p>
      </div>
    </div>
  );
}
