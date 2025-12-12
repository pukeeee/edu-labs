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
import { Search, Filter } from "lucide-react";
import type { Level, Category } from "@/shared/types/common";

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
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6272A4]" />
        <Input
          type="search"
          placeholder="Шукати курси..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange(undefined, undefined, e.target.value);
          }}
          className="pl-10 bg-[#44475A] border-[#44475A] text-[#F8F8F2]"
        />
      </div>

      {/* Фільтр рівня */}
      <Select
        value={level}
        onValueChange={(value) => {
          const newLevel = value as Level | "all";
          setLevel(newLevel);
          handleFilterChange(newLevel);
        }}
      >
        <SelectTrigger className="w-full sm:w-45 bg-[#44475A] border-[#44475A]">
          <Filter className="mr-2 w-4 h-4" />
          <SelectValue placeholder="Рівень" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Усі рівні</SelectItem>
          <SelectItem value="junior">Junior</SelectItem>
          <SelectItem value="middle">Middle</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
        </SelectContent>
      </Select>

      {/* Фільтр категорії */}
      <Select
        value={category}
        onValueChange={(value) => {
          const newCategory = value as Category | "all";
          setCategory(newCategory);
          handleFilterChange(undefined, newCategory);
        }}
      >
        <SelectTrigger className="w-full sm:w-45 bg-[#44475A] border-[#44475A]">
          <SelectValue placeholder="Категорія" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Усі категорії</SelectItem>
          <SelectItem value="qa">QA</SelectItem>
          <SelectItem value="ai">AI</SelectItem>
          <SelectItem value="fullstack">Fullstack</SelectItem>
          <SelectItem value="frontend">Frontend</SelectItem>
          <SelectItem value="backend">Backend</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
