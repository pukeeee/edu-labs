import { redirect } from "next/navigation";
import { UserDashboard } from "@/widgets/user-dashboard/ui/UserDashboard";
import { createClient } from "@/shared/lib/supabase/server";
import { getDashboardData } from "@/features/get-dashboard-data/actions/get-dashboard-data.action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дашборд",
  description: "Твій особистий кабінет та трекер прогресу.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { stats, coursesInProgress, favoriteCourses, recentActivity } =
    await getDashboardData();

  if (!stats) {
    // Це може статися, якщо профіль користувача ще не створений або є помилка
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold">Не вдалося завантажити дані</h1>
        <p className="text-muted-foreground">
          Спробуйте оновити сторінку або зв&aposяжіться з підтримкою.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Вітаємо, {user.user_metadata?.full_name || user.email}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Продовжуй своє навчання та досягай нових висот
          </p>
        </div>

        {/* Dashboard */}
        <UserDashboard
          stats={stats}
          coursesInProgress={coursesInProgress}
          favoriteCourses={favoriteCourses}
          recentActivity={recentActivity}
        />
      </div>
    </div>
  );
}
