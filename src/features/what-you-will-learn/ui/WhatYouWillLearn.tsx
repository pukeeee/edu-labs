import { getCourseLearnItems } from "@/shared/lib/api/course.repository";
import { Card, CardContent } from "@/shared/ui/card";

/**
 * Серверний компонент, що відображає секцію "Що ти вивчиш".
 * Він самостійно отримує дані з репозиторію.
 * @param courseSlug - Слаг курсу для отримання даних.
 * @param lang - Код мови ('uk' або 'en').
 */
export async function WhatYouWillLearn({
  courseSlug,
  lang,
}: {
  courseSlug: string;
  lang: string;
}) {
  const items = await getCourseLearnItems(courseSlug, lang);

  // Не рендеримо компонент, якщо немає даних
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card className="border-card bg-card">
      <CardContent className="space-y-4 px-6">
        <h2 className="text-2xl font-bold text-foreground">Що ти вивчиш</h2>
        <ul className="space-y-3 text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 text-success">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
