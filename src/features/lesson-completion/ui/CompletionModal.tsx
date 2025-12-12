"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Award, ArrowRight } from "lucide-react";

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  xpEarned: number;
  nextLessonUrl?: string;
}

export function CompletionModal({
  open,
  onClose,
  xpEarned,
  nextLessonUrl,
}: CompletionModalProps) {
  useEffect(() => {
    if (open && nextLessonUrl) {
      // Автозакриття через 3 секунди
      const timer = setTimeout(() => {
        window.location.href = nextLessonUrl;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, nextLessonUrl]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#44475A] border-[#8BE9FD]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#50FA7B]/10 border-2 border-[#50FA7B] flex items-center justify-center">
              <Award className="w-8 h-8 text-[#50FA7B]" />
            </div>
          </div>

          <DialogTitle className="text-center text-2xl text-[#F8F8F2]">
            Урок завершено! 🎉
          </DialogTitle>

          <DialogDescription className="text-center space-y-4">
            <div className="text-4xl font-bold text-[#50FA7B]">
              +{xpEarned} XP
            </div>
            <p className="text-[#6272A4]">
              Чудова робота! Продовжуй в тому ж дусі.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {nextLessonUrl && (
            <Button asChild className="w-full" size="lg">
              <a href={nextLessonUrl}>
                Наступний урок
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}

          <Button variant="ghost" onClick={onClose} className="w-full">
            Залишитися тут
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
