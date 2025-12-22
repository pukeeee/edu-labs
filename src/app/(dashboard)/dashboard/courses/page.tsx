import { CourseWithDetails } from '@/shared/lib/api/course.repository';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мої курси',
};

export default async function MyCoursesPage() {
  // TODO: Отримати курси з БД
  const coursesInProgress: CourseWithDetails[] = [];
  const coursesCompleted: CourseWithDetails[] = [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Мої курси</h1>
        <p className="text-muted-foreground">
          Керуй своїми курсами та відслідковуй прогрес
        </p>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="in-progress" className="gap-2">
            <Play className="w-4 h-4" />
            В процесі ({coursesInProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Завершені ({coursesCompleted.length})
          </TabsTrigger>
          <TabsTrigger value="recommended" className="gap-2">
            <Clock className="w-4 h-4" />
            Рекомендовані
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-4">
          {coursesInProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Відобразити картки курсів */}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Немає курсів в процесі
                </h3>
                <p className="text-muted-foreground mb-6">
                  Почни новий курс та розвивай свої навички
                </p>
                <Button asChild>
                  <Link href="/courses">Переглянути курси</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {/* TODO: Відобразити завершені курси */}
        </TabsContent>

        <TabsContent value="recommended">
          {/* TODO: Відобразити рекомендовані курси */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
