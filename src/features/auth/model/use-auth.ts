import { useUser } from "@/entities/session/model/session.store";
import { useAuthModalStore } from "./auth-modal.store";

/**
 * Хук, що надає функцію-обгортку для перевірки автентифікації
 * перед виконанням дії.
 */
export const useAuth = () => {
  const user = useUser();
  const { open } = useAuthModalStore();

  /**
   * Функція вищого порядку для захисту дій.
   * @param action - Функція, яка має бути виконана, якщо користувач авторизований.
   * @returns Нова функція, яка або виконає дію, або відкриє модальне вікно.
   */
  const withAuthCheck = <T extends (...args: unknown[]) => void>(action: T) => {
    return (...args: Parameters<T>) => {
      if (user) {
        action(...args);
      } else {
        open();
      }
    };
  };

  return { withAuthCheck };
};
