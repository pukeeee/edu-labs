import { BookOpen, Zap, TrendingUp } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#1E1F29]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#F8F8F2] mb-12">
          Як це працює
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Крок 1 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#8BE9FD]/10 border-2 border-[#8BE9FD] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#8BE9FD]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F8F8F2]">Обери курс</h3>
            <p className="text-[#6272A4]">
              Вибери курс що відповідає твоєму рівню та інтересам
            </p>
          </div>

          {/* Крок 2 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#BD93F9]/10 border-2 border-[#BD93F9] flex items-center justify-center">
              <Zap className="w-8 h-8 text-[#BD93F9]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F8F8F2]">
              Вчись у своєму темпі
            </h3>
            <p className="text-[#6272A4]">
              Проходь уроки коли зручно. Все завжди доступно онлайн
            </p>
          </div>

          {/* Крок 3 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#50FA7B]/10 border-2 border-[#50FA7B] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#50FA7B]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F8F8F2]">
              Відслідковуй прогрес
            </h3>
            <p className="text-[#6272A4]">
              Заробляй XP, підвищуй рівень та отримуй досягнення
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
