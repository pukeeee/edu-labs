-- ============================================================================
-- SUPABASE DATABASE SCHEMA (v2.1 - Fully Commented)
--
-- Остання ревізія: 2025-12-15
--
-- Цей файл описує повну схему бази даних для освітньої платформи.
-- Схема розроблена з урахуванням масштабованості, продуктивності та безпеки.
--
-- ОСНОВНІ ПРИНЦИПИ АРХІТЕКТУРИ:
-- 1. Зв'язок з Auth: Профілі користувачів (`public.profiles`) жорстко
--    зв'язані з `auth.users` через зовнішній ключ та тригер.
-- 2. Денормалізація: Ключові лічильники (кількість уроків, XP, рейтинг)
--    денормалізовані та зберігаються в основних таблицях (`courses`, `lessons`).
--    Це значно прискорює запити на читання.
-- 3. Автоматизація: Тригери автоматично оновлюють денормалізовані дані,
--    забезпечуючи їхню консистентність.
-- 4. Безпека: Row Level Security (RLS) увімкнено для всіх таблиць,
--    надаючи публічний доступ на читання та обмежуючи запис для
--    авторизованих користувачів лише їхніми даними.
-- 5. Інтернаціоналізація: Текстовий контент винесено в окремі таблиці
--    перекладів (`*_translations`).
-- ============================================================================


-- ============================================================================
-- РОЗДІЛ 1: ГЛОБАЛЬНІ ТИПИ (ENUMS)
-- Використання ENUM замість текстових полів покращує цілісність даних
-- та продуктивність, оскільки вони зберігаються як цілі числа.
-- ============================================================================
COMMENT ON SCHEMA public IS 'Основна схема для таблиць додатку.';

-- Рівень складності курсу
CREATE TYPE public.course_level AS ENUM ('junior', 'middle', 'senior');
-- Категорія, до якої належить курс
CREATE TYPE public.course_category AS ENUM ('qa', 'ai', 'fullstack', 'frontend', 'backend', 'gamedev', 'devops');
-- Статус публікації курсу
CREATE TYPE public.course_status AS ENUM ('draft', 'in_review', 'published', 'archived');
-- Тип уроку для відображення відповідного інтерфейсу
CREATE TYPE public.lesson_type AS ENUM ('video', 'text', 'quiz', 'practice');


-- ============================================================================
-- РОЗДІЛ 2: АВТЕНТИФІКАЦІЯ ТА КОРИСТУВАЧІ (`profiles`)
-- ============================================================================

-- Таблиця `profiles` розширює стандартну `auth.users` від Supabase,
-- додаючи специфічні для додатку поля, такі як username та XP.
CREATE TABLE public.profiles (
  -- Жорсткий зв'язок з `auth.users`. При видаленні користувача з auth,
  -- його профіль видаляється автоматично (ON DELETE CASCADE).
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Унікальний нікнейм для публічних URL та ідентифікації.
  username TEXT UNIQUE,
  -- Повне ім'я користувача.
  full_name TEXT,
  -- URL аватара користувача.
  avatar_url TEXT,
  -- Загальна кількість заробленого досвіду (XP), оновлюється тригером.
  total_xp INTEGER DEFAULT 0,
  -- Часові мітки для відстеження
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Обмеження на довжину та дозволені символи в нікнеймі.
  CONSTRAINT username_validation CHECK (char_length(username) >= 3 AND char_length(username) <= 20 AND username ~ '^[a-z0-9_]+$')
);

COMMENT ON TABLE public.profiles IS 'Публічні профілі користувачів, що розширюють `auth.users`.';
COMMENT ON COLUMN public.profiles.id IS 'Зовнішній ключ, що посилається на `auth.users.id`.';
COMMENT ON COLUMN public.profiles.total_xp IS 'Загальний досвід користувача, агрегований з усіх курсів. Оновлюється тригером.';


-- Функція-тригер для автоматичного створення профілю при реєстрації нового користувача.
-- SECURITY DEFINER дозволяє функції працювати з підвищеними правами для запису в `public.profiles`.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_username TEXT;
  is_username_taken BOOLEAN;
BEGIN
  -- 1. Визначаємо бажаний нікнейм. Пріоритет: 'username', потім 'user_name' з метаданих,
  --    в іншому випадку генеруємо тимчасовий.
  generated_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'user_name',
    'user' || substr(NEW.id::text, 1, 8)
  );

  -- 2. Перевіряємо, чи не зайнятий нікнейм. Якщо так, додаємо випадковий суфікс,
  --    поки не знайдемо унікальний варіант.
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = generated_username) INTO is_username_taken;
  WHILE is_username_taken LOOP
    generated_username := generated_username || substr(md5(random()::text), 1, 4);
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = generated_username) INTO is_username_taken;
  END LOOP;

  -- 3. Створюємо новий запис у таблиці `profiles`.
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    generated_username
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Створює запис в `public.profiles` автоматично після реєстрації користувача в `auth.users`.';

-- Тригер, що викликає `handle_new_user()` після створення нового запису в `auth.users`.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- РОЗДІЛ 3: ОСНОВНИЙ КОНТЕНТ (КУРСИ, МОДУЛІ, УРОКИ)
-- ============================================================================

-- Таблиця підтримуваних мов для перекладів.
CREATE TABLE public.languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
COMMENT ON TABLE public.languages IS 'Довідник мов, що використовуються для перекладів контенту.';
INSERT INTO public.languages (code, name) VALUES ('uk', 'Українська'), ('en', 'English');

-- Основна таблиця курсів.
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.course_status DEFAULT 'draft',
  level public.course_level,
  category public.course_category,
  thumbnail_url TEXT,
  -- Денормалізовані поля для продуктивності. Оновлюються тригерами.
  estimated_time INTEGER DEFAULT 0, -- Загальний час на проходження (хвилини)
  total_xp INTEGER DEFAULT 0, -- Загальна кількість досвіду за курс
  lessons_count INTEGER DEFAULT 0, -- Кількість опублікованих уроків
  reviews_count INTEGER DEFAULT 0, -- Кількість відгуків
  avg_rating NUMERIC(2, 1) DEFAULT 0.0, -- Середній рейтинг
  tags TEXT[], -- Теги для пошуку та фільтрації
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.courses IS 'Основна таблиця курсів з денормалізованими лічильниками для продуктивності.';
COMMENT ON COLUMN public.courses.slug IS 'Унікальний ідентифікатор курсу для URL (напр., "fullstack-javascript").';

-- Переклади для курсів.
CREATE TABLE public.course_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  what_you_will_learn TEXT[] DEFAULT '{}', -- Ключові навички, які отримає студент
  UNIQUE(course_id, language_code)
);
COMMENT ON TABLE public.course_translations IS 'Переклади назв, описів та інших текстових полів для курсів.';

-- Модулі (розділи) всередині курсу.
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0 -- Порядковий номер для сортування
);
COMMENT ON TABLE public.modules IS 'Групує уроки в логічні розділи всередині курсу.';

-- Переклади для модулів.
CREATE TABLE public.module_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(module_id, language_code)
);

-- Уроки, що є основною одиницею контенту.
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL, -- Денормалізація для зручності запитів
  slug TEXT NOT NULL,
  type public.lesson_type DEFAULT 'text',
  order_index INTEGER NOT NULL DEFAULT 0,
  estimated_time INTEGER DEFAULT 15, -- Орієнтовний час на урок (хвилини)
  xp_reward INTEGER DEFAULT 10, -- Досвід за завершення
  published BOOLEAN DEFAULT false, -- Чи доступний урок студентам
  comments_count INTEGER DEFAULT 0, -- Лічильник коментарів, оновлюється тригером
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug) -- Slug уроку має бути унікальним в межах курсу
);
COMMENT ON COLUMN public.lessons.course_id IS 'Денормалізований ключ для унікальності slug в межах курсу та для спрощення запитів.';
COMMENT ON COLUMN public.lessons.comments_count IS 'Загальна кількість коментарів до уроку. Оновлюється тригером.';

-- Переклади для уроків.
CREATE TABLE public.lesson_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content JSONB, -- Гнучкий формат для контенту (MDX, відео URL, тест)
  UNIQUE(lesson_id, language_code)
);
COMMENT ON COLUMN public.lesson_translations.content IS 'JSONB для зберігання структурованого контенту, напр.: {"type": "mdx", "body": "..."} або {"type": "video", "url": "..."}.';


-- ============================================================================
-- РОЗДІЛ 4: АКТИВНІСТЬ КОРИСТУВАЧА (ПРОГРЕС, ОБРАНЕ)
-- ============================================================================

-- Відстеження прогресу проходження уроків користувачем.
CREATE TABLE public.user_lesson_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE, -- Денормалізація для агрегації
  completed_at TIMESTAMPTZ, -- NULL, якщо не завершено. Дата, якщо завершено.
  quiz_answers JSONB, -- Відповіді на тест, якщо тип уроку 'quiz'
  PRIMARY KEY (user_id, lesson_id)
);
COMMENT ON TABLE public.user_lesson_progress IS 'Запис про проходження конкретного уроку користувачем. Основа для тригерів прогресу.';

-- Агрегований прогрес користувача по кожному курсу.
-- Оновлюється автоматично тригером `on_lesson_completed`.
CREATE TABLE public.user_course_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_lessons_count INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);
COMMENT ON TABLE public.user_course_progress IS 'Агрегований прогрес користувача по курсу. Оновлюється тригерами.';

-- Зберігання курсів, доданих користувачем в "Обране".
CREATE TABLE public.favorite_courses (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);


-- ============================================================================
-- РОЗДІЛ 5: СПІЛЬНОТА (ВІДГУКИ, КОМЕНТАРІ)
-- ============================================================================

-- Відгуки та рейтинг, які користувачі залишають до курсів.
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id) -- Один користувач - один відгук на курс
);
COMMENT ON TABLE public.course_reviews IS 'Відгуки та рейтинги користувачів для курсів.';

-- Коментарі до уроків. Підтримують вкладеність (відповіді).
CREATE TABLE public.lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE, -- Для вкладених коментарів (відповідей)
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.lesson_comments IS 'Коментарі до уроків. Поле `parent_id` дозволяє створювати ланцюжки відповідей.';


-- ============================================================================
-- РОЗДІЛ 6: ГЕЙМІФІКАЦІЯ (ДОСЯГНЕННЯ)
-- ============================================================================

-- Довідник усіх можливих досягнень в системі.
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0 -- Додатковий досвід за досягнення
);
COMMENT ON TABLE public.achievements IS 'Довідник усіх можливих досягнень (ачівок) на платформі.';

-- Таблиця-зв'язок, що показує, які досягнення заробив користувач.
CREATE TABLE public.user_achievements (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);


-- ============================================================================
-- РОЗДІЛ 7: ФУНКЦІЇ ТА ПРЕДСТАВЛЕННЯ (VIEWS/FUNCTIONS)
-- `VIEW` замінено на функцію для можливості передавати параметри (фільтр мови).
-- ============================================================================

-- Функція для отримання повного списку курсів з перекладами та даними автора.
-- Це основна функція для відображення каталогу курсів.
CREATE OR REPLACE FUNCTION public.get_courses_with_details(language_filter TEXT)
RETURNS TABLE (
  id UUID, slug TEXT, title TEXT, description TEXT, status public.course_status,
  level public.course_level, category public.course_category, thumbnail_url TEXT,
  estimated_time INTEGER, total_xp INTEGER, lessons_count INTEGER,
  reviews_count INTEGER, avg_rating NUMERIC(2, 1), tags TEXT[],
  author_name TEXT, author_avatar TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Використовуємо CTE (Common Table Expression) для вибору найкращого перекладу
  WITH ranked_translations AS (
    SELECT
      t.course_id,
      t.title,
      t.description,
      -- Ранжуємо переклади: 1) обрана мова, 2) англійська (fallback), 3) будь-яка інша
      ROW_NUMBER() OVER(PARTITION BY t.course_id ORDER BY
        CASE t.language_code
          WHEN language_filter THEN 1
          WHEN 'en' THEN 2
          ELSE 3
        END
      ) as rnk
    FROM public.course_translations t
  )
  -- Основний запит, що з'єднує курси з перекладами та профілями авторів
  SELECT
    c.id, c.slug, rt.title, rt.description, c.status, c.level, c.category,
    c.thumbnail_url, c.estimated_time, c.total_xp, c.lessons_count,
    c.reviews_count, c.avg_rating, c.tags, p.full_name as author_name,
    p.avatar_url as author_avatar
  FROM public.courses c
  LEFT JOIN ranked_translations rt ON c.id = rt.course_id AND rt.rnk = 1 -- Беремо тільки найкращий переклад
  LEFT JOIN public.profiles p ON c.author_id = p.id;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_courses_with_details(TEXT) IS 'Отримує деталізований список курсів з перекладами та інформацією про автора. Приймає код мови як параметр.';


-- ============================================================================
-- РОЗДІЛ 8: ТРИГЕРИ ТА АВТОМАТИЗАЦІЯ
-- Цей розділ містить функції та тригери, що забезпечують цілісність
-- денормалізованих даних.
-- ============================================================================

-- 8.1. Функція для автоматичного оновлення поля `updated_at`.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Автоматично встановлює поточний час в поле `updated_at` при оновленні запису.';

-- 8.2. Функція для перерахунку статистики курсу (уроки, xp, час).
CREATE OR REPLACE FUNCTION public.update_course_stats()
RETURNS TRIGGER AS $$
DECLARE
  course_uuid UUID;
BEGIN
  course_uuid := COALESCE(NEW.course_id, OLD.course_id);

  UPDATE public.courses
  SET
    lessons_count = (SELECT COUNT(*) FROM public.lessons WHERE course_id = course_uuid AND published = true),
    total_xp = (SELECT COALESCE(SUM(xp_reward), 0) FROM public.lessons WHERE course_id = course_uuid AND published = true),
    estimated_time = (SELECT COALESCE(SUM(estimated_time), 0) FROM public.lessons WHERE course_id = course_uuid AND published = true)
  WHERE id = course_uuid;

  RETURN NULL; -- Результат не важливий, оскільки це AFTER тригер
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.update_course_stats() IS 'Перераховує лічильники `lessons_count`, `total_xp`, `estimated_time` в таблиці `courses` при зміні уроків.';

-- 8.3. Функція для перерахунку статистики відгуків курсу.
CREATE OR REPLACE FUNCTION public.update_course_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  course_uuid UUID;
BEGIN
  course_uuid := COALESCE(NEW.course_id, OLD.course_id);

  UPDATE public.courses
  SET
    reviews_count = (SELECT COUNT(*) FROM public.course_reviews WHERE course_id = course_uuid),
    avg_rating = (SELECT COALESCE(AVG(rating), 0.0) FROM public.course_reviews WHERE course_id = course_uuid)
  WHERE id = course_uuid;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.update_course_review_stats() IS 'Перераховує `reviews_count` та `avg_rating` в таблиці `courses` при зміні відгуків.';

-- 8.4. Функція для перерахунку лічильника коментарів до уроку.
CREATE OR REPLACE FUNCTION public.update_lesson_comments_count()
RETURNS TRIGGER AS $$
DECLARE
  lesson_uuid UUID;
BEGIN
  lesson_uuid := COALESCE(NEW.lesson_id, OLD.lesson_id);

  UPDATE public.lessons
  SET comments_count = (SELECT COUNT(*) FROM public.lesson_comments WHERE lesson_id = lesson_uuid)
  WHERE id = lesson_uuid;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.update_lesson_comments_count() IS 'Перераховує `comments_count` в таблиці `lessons` при додаванні/видаленні коментарів.';

-- 8.5. Функція для оновлення загального прогресу користувача.
CREATE OR REPLACE FUNCTION public.update_user_progress_on_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
  lesson_xp INTEGER;
  target_course_id UUID := COALESCE(NEW.course_id, OLD.course_id);
  target_user_id UUID := COALESCE(NEW.user_id, OLD.user_id);
BEGIN
  -- 1. Створюємо або оновлюємо агрегований запис про прогрес курсу.
  --    Використовуємо `ON CONFLICT` для атомарності операції.
  INSERT INTO public.user_course_progress (user_id, course_id, completed_lessons_count, total_xp_earned, updated_at)
  VALUES (target_user_id, target_course_id, 0, 0, NOW())
  ON CONFLICT (user_id, course_id)
  DO UPDATE SET
    completed_lessons_count = (
      SELECT COUNT(*) FROM public.user_lesson_progress
      WHERE user_id = target_user_id AND course_id = target_course_id AND completed_at IS NOT NULL
    ),
    total_xp_earned = (
      SELECT COALESCE(SUM(l.xp_reward), 0)
      FROM public.user_lesson_progress ulp
      JOIN public.lessons l ON ulp.lesson_id = l.id
      WHERE ulp.user_id = target_user_id AND ulp.course_id = target_course_id AND ulp.completed_at IS NOT NULL
    ),
    updated_at = NOW();

  -- 2. Оновлюємо загальний XP в профілі користувача, підсумовуючи XP з усіх курсів.
  UPDATE public.profiles
  SET total_xp = (
    SELECT COALESCE(SUM(total_xp_earned), 0)
    FROM public.user_course_progress
    WHERE user_id = target_user_id
  )
  WHERE id = target_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.update_user_progress_on_lesson_completion() IS 'Оновлює `user_course_progress` та `profiles.total_xp` після того, як урок позначено завершеним.';

-- 8.6. Призначення тригерів на таблиці.

-- Універсальний тригер для оновлення `updated_at` для всіх основних таблиць.
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY['profiles', 'courses', 'lessons', 'course_reviews', 'lesson_comments'];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t, t);
  END LOOP;
END;
$$;

-- Тригер на зміну уроків (додавання, оновлення, видалення)
CREATE TRIGGER on_lesson_change
  AFTER INSERT OR UPDATE OR DELETE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_course_stats();

-- Тригер на зміну відгуків
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_course_review_stats();

-- Тригер на зміну коментарів
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.lesson_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_lesson_comments_count();

-- Тригер на завершення уроку
CREATE TRIGGER on_lesson_completed
  AFTER INSERT OR UPDATE OR DELETE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_progress_on_lesson_completion();


-- ============================================================================
-- РОЗДІЛ 9: БЕЗПЕКА НА РІВНІ РЯДКІВ (ROW LEVEL SECURITY - RLS)
--
-- Головне правило:
-- - SELECT: Будь-хто (включно з анонімними користувачами) може читати всі дані.
-- - INSERT, UPDATE, DELETE: Тільки авторизовані користувачі, і лише свої дані.
-- - Контент (курси, уроки) не має політик на запис; редагування відбувається
--   через `service_role_key` (напр., з адмін-панелі або скриптів).
-- ============================================================================

-- Вмикаємо RLS для всіх таблиць, що містять дані.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- 9.1. Політики на читання (SELECT): дозволено всім (public access).
CREATE POLICY "Public read access for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read access for course_translations" ON public.course_translations FOR SELECT USING (true);
CREATE POLICY "Public read access for modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Public read access for module_translations" ON public.module_translations FOR SELECT USING (true);
CREATE POLICY "Public read access for lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public read access for lesson_translations" ON public.lesson_translations FOR SELECT USING (true);
CREATE POLICY "Public read access for user_lesson_progress" ON public.user_lesson_progress FOR SELECT USING (true);
CREATE POLICY "Public read access for user_course_progress" ON public.user_course_progress FOR SELECT USING (true);
CREATE POLICY "Public read access for favorite_courses" ON public.favorite_courses FOR SELECT USING (true);
CREATE POLICY "Public read access for course_reviews" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "Public read access for lesson_comments" ON public.lesson_comments FOR SELECT USING (true);
CREATE POLICY "Public read access for achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read access for user_achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Public read access for languages" ON public.languages FOR SELECT USING (true);

-- 9.2. Політики на запис (INSERT, UPDATE, DELETE).

-- Користувачі можуть оновлювати тільки власний профіль.
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Користувачі можуть керувати тільки власним прогресом, обраним, досягненнями.
CREATE POLICY "Users can manage their own lesson progress" ON public.user_lesson_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own course progress" ON public.user_course_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON public.favorite_courses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Відгуки та коментарі:
-- Будь-який авторизований користувач може створювати.
-- Редагувати та видаляти може тільки власник.
CREATE POLICY "Authenticated users can create reviews" ON public.course_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own reviews" ON public.course_reviews
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.course_reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create comments" ON public.lesson_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own comments" ON public.lesson_comments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.lesson_comments
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================================
-- РОЗДІЛ 10: ІНДЕКСИ
-- Індекси для прискорення найчастіших запитів (JOIN, WHERE, ORDER BY).
-- Індекси для первинних (PK) та унікальних (UNIQUE) ключів створюються автоматично.
-- ============================================================================

-- Індекси для зв'язків та фільтрації в таблиці `courses`.
CREATE INDEX idx_courses_author_id ON public.courses (author_id);
CREATE INDEX idx_courses_category ON public.courses (category);
CREATE INDEX idx_courses_level ON public.courses (level);

-- Індекси для таблиць перекладів для швидкого пошуку за мовою.
CREATE INDEX idx_course_translations_language_code ON public.course_translations (language_code);
CREATE INDEX idx_lesson_translations_language_code ON public.lesson_translations (language_code);

-- Індекси для зв'язків між курсами, модулями та уроками.
CREATE INDEX idx_modules_course_id ON public.modules (course_id);
CREATE INDEX idx_lessons_module_id ON public.lessons (module_id);

-- Індекси для таблиць прогресу та спільноти для швидкого пошуку даних по користувачу.
CREATE INDEX idx_user_lesson_progress_lesson_id ON public.user_lesson_progress (lesson_id);
CREATE INDEX idx_course_reviews_user_id ON public.course_reviews (user_id);
CREATE INDEX idx_lesson_comments_user_id ON public.lesson_comments (user_id);
CREATE INDEX idx_lesson_comments_parent_id ON public.lesson_comments (parent_id);


-- ============================================================================
-- КІНЕЦЬ СХЕМИ
-- ============================================================================