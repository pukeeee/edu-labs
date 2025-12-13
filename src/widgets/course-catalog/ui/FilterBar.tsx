"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Search, Filter, LayoutGrid } from "lucide-react";
import type { Level, Category } from "@/shared/types/common";
import {
  LEVELS,
  LEVEL_NAMES,
  CATEGORIES,
  CATEGORY_NAMES,
} from "@/shared/config/filters";

/**
 * @property onFilterChange - Функція зворотного виклику, що викликається при зміні фільтрів.
 * @returns {JSX.Element} - Компонент, що відображає панель фільтрів для курсів.
 */
interface FilterBarProps {
  onFilterChange: (filters: {
    level: Level | "all";
    category: Category | "all";
    search: string;
  }) => void;
}

/**
 * Компонент FilterBar надає користувачам можливість фільтрувати та шукати курси.
 * Він включає поле пошуку, а також випадаючі списки для фільтрації за рівнем та категорією.
 */
export function FilterBar({ onFilterChange }: FilterBarProps) {
  // Стан для зберігання поточних значень фільтрів
  const [level, setLevel] = useState<Level | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  /**
   * Обробляє зміни у фільтрах та викликає onFilterChange з оновленими даними.
   * @param {Level | "all"} [newLevel] - Новий рівень складності.
   * @param {Category | "all"} [newCategory] - Нова категорія.
   * @param {string} [newSearch] - Новий пошуковий запит.
   */
  const handleFilterChange = (
    newLevel?: Level | "all",
    newCategory?: Category | "all",
    newSearch?: string,
  ) => {
    const filters = {
      level: newLevel ?? level,
      category: newCategory ?? category,
      search: newSearch ?? search,
    };
    onFilterChange(filters);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Поле для повнотекстового пошуку курсів */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Шукати курси..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange(undefined, undefined, e.target.value);
          }}
          className="w-full border-transparent bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Контейнер для фільтрів рівня та категорії */}
      <div className="flex flex-row gap-4 sm:flex-1">
        {/* Випадаючий список для фільтрації за рівнем складності */}
        <div className="flex-1">
          <Select
            value={level}
            onValueChange={(value) => {
              const newLevel = value as Level | "all";
              setLevel(newLevel);
              handleFilterChange(newLevel);
            }}
          >
            <SelectTrigger className="w-full border-transparent bg-input text-foreground focus:ring-2 focus:ring-ring">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <SelectValue placeholder="Рівень" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-muted-foreground bg-popover text-popover-foreground"
            >
              <SelectItem value="all">Усі рівні</SelectItem>
              {LEVELS.map((levelValue) => (
                <SelectItem key={levelValue} value={levelValue}>
                  {LEVEL_NAMES[levelValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Випадаючий список для фільтрації за категорією */}
        <div className="flex-1">
          <Select
            value={category}
            onValueChange={(value) => {
              const newCategory = value as Category | "all";
              setCategory(newCategory);
              handleFilterChange(undefined, newCategory);
            }}
          >
            <SelectTrigger className="w-full border-transparent bg-input text-foreground focus:ring-2 focus:ring-ring">
              <LayoutGrid className="mr-2 h-4 w-4 text-primary" />
              <SelectValue placeholder="Категорія" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-muted-foreground bg-popover text-popover-foreground"
            >
              <SelectItem value="all">Усі категорії</SelectItem>
              {CATEGORIES.map((categoryValue) => (
                <SelectItem key={categoryValue} value={categoryValue}>
                  {CATEGORY_NAMES[categoryValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
