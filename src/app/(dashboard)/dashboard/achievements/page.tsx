import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Trophy, Star, Target, Medal, Zap } from 'lucide-react';
import { Metadata } from 'next';
import { cn } from '@/shared/lib/utils';
import type { AchievementRarity } from '@/entities/achievement/model/types';

export const metadata: Metadata = {
  title: 'Досягнення',
};

// TODO: Типізувати та отримувати з БД
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedAt: Date | null;
  rarity: AchievementRarity;
};

export default async function AchievementsPage() {
  // TODO: Отримати досягнення з БД
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Перші кроки',
      description: 'Завершив перший урок',
      icon: Star,
      unlocked: true,
      unlockedAt: new Date(),
      rarity: 'common',
    },
    {
      id: '2',
      title: 'Цілеспрямований',
      description: 'Завершив перший курс',
      icon: Target,
      unlocked: false,
      unlockedAt: null,
      rarity: 'rare',
    },
  ];

  const rarityColors: Record<AchievementRarity, string> = {
    common: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    rare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    epic: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    legendary: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Досягнення</h1>
        <p className="text-muted-foreground">
          Розблокуй досягнення та збирай колекцію
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unlockedCount}</p>
                <p className="text-sm text-muted-foreground">Розблоковано</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Medal className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Всього</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress}%</p>
                <p className="text-sm text-muted-foreground">Прогрес</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;

          return (
            <Card
              key={achievement.id}
              className={cn(
                'transition-all',
                achievement.unlocked
                  ? 'border-success/20 bg-success/5'
                  : 'opacity-50 grayscale'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-.between">
                  <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge className={rarityColors[achievement.rarity]}>
                    {achievement.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-success mt-2">
                    Розблоковано{' '}
                    {achievement.unlockedAt.toLocaleDateString('uk-UA')}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
