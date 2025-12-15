import { Skeleton } from "@/shared/ui/skeleton";

export default function RoadmapLoading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* === Скелетон для хедера (RoadmapHeader) === */}
        <div className="space-y-8">
          {/* Хлібні крихти */}
          <div className="flex items-center gap-2 text-sm">
            <Skeleton className="h-5 w-16" />
            <span className="text-muted-foreground">/</span>
            <Skeleton className="h-5 w-32" />
            <span className="text-muted-foreground">/</span>
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Заголовок */}
          <div className="space-y-4">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>

        {/* === Скелетон для списку (RoadmapList) === */}
        <div className="space-y-8">
          {[...Array(2)].map((_, moduleIndex) => (
            <div key={moduleIndex} className="space-y-4">
              {/* Заголовок модуля */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
              </div>

              {/* Уроки модуля */}
              <div className="space-y-3 border-l-2 border-border pl-5">
                {[...Array(3)].map((_, lessonIndex) => (
                  // --- Скелетон для однієї картки уроку (LessonCard) ---
                  <div
                    key={lessonIndex}
                    className="min-h-30 rounded-lg border-l-4 border-muted/30 bg-card p-4 pl-0"
                  >
                    <div className="flex items-start gap-4 pl-4">
                      {/* Іконка статусу */}
                      <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-full" />

                      {/* Контент */}
                      <div className="min-w-0 flex-1 space-y-3">
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
