"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Check, Loader2 } from "lucide-react";
import { CompletionModal } from "./CompletionModal";

interface CompleteButtonProps {
  lessonId: string;
  xpReward: number;
  onComplete?: () => void;
}

export function CompleteButton({
  lessonId,
  xpReward,
  onComplete,
}: CompleteButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      // API виклик для збереження прогресу
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      setShowModal(true);
      onComplete?.();
    } catch (error) {
      console.error("Помилка завершення уроку:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleComplete}
        disabled={isCompleting}
        size="lg"
        className="w-full sm:w-auto bg-[#50FA7B] text-[#282A36] hover:bg-[#50FA7B]/90"
      >
        {isCompleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Збереження...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Позначити як завершене
          </>
        )}
      </Button>

      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        xpEarned={xpReward}
      />
    </>
  );
}
