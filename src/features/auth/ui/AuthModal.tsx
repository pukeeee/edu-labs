"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { useAuthModalStore } from "../model/auth-modal.store";
import { AuthButton } from "./AuthButton";

/**
 * Модальне вікно для автентифікації.
 * Стан (відкрито/закрито) керується через `useAuthModalStore`.
 */
export function AuthModal() {
  const { isOpen, close } = useAuthModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Потрібна автентифікація</DialogTitle>
          <DialogDescription>
            Щоб продовжити, увійдіть у свій акаунт. Це відкриє доступ до
            збереження прогресу, досягнень та інших можливостей платформи.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AuthButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
