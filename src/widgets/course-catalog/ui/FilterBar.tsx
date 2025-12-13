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

interface FilterBarProps {
  onFilterChange: (filters: {
    level: Level | "all";
    category: Category | "all";
    search: string;
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [level, setLevel] = useState<Level | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

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
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Пошук */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6272A4]" />
        <Input
          type="search"
          placeholder="Шукати курси..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange(undefined, undefined, e.target.value);
          }}
          className="w-full border-transparent bg-[#44475A] pl-10 text-[#F8F8F2] placeholder:text-[#6272A4] focus:ring-2 focus:ring-[#8BE9FD]"
        />
      </div>

      {/* Огортка для фільтрів */}
      <div className="flex flex-row gap-4 sm:flex-1">
        {/* Фільтр рівня */}
        <div className="flex-1">
          <Select
            value={level}
            onValueChange={(value) => {
              const newLevel = value as Level | "all";
              setLevel(newLevel);
              handleFilterChange(newLevel);
            }}
          >
            <SelectTrigger className="w-full border-transparent bg-[#44475A] text-[#F8F8F2] focus:ring-2 focus:ring-[#8BE9FD]">
              <Filter className="mr-2 h-4 w-4 text-[#8BE9FD]" />
              <SelectValue placeholder="Рівень" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-[#6272A4] bg-[#44475A] text-[#F8F8F2]"
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

        {/* Фільтр категорії */}
        <div className="flex-1">
          <Select
            value={category}
            onValueChange={(value) => {
              const newCategory = value as Category | "all";
              setCategory(newCategory);
              handleFilterChange(undefined, newCategory);
            }}
          >
            <SelectTrigger className="w-full border-transparent bg-[#44475A] text-[#F8F8F2] focus:ring-2 focus:ring-[#8BE9FD]">
              <LayoutGrid className="mr-2 h-4 w-4 text-[#8BE9FD]" />
              <SelectValue placeholder="Категорія" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-[#6272A4] bg-[#44475A] text-[#F8F8F2]"
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
