"use client";

import { createClient } from "@/shared/lib/supabase/client";
import { Button } from "@/shared/ui/button";

/**
 * Кнопка для автентифікації через Google.
 */
export function AuthButton() {
  const supabase = createClient();

  const handleLoginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Після успішного входу в Google, користувач буде перенаправлений
        // на цей URL, де ми завершимо процес автентифікації на стороні сервера.
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleLoginWithGoogle} variant="outline">
      Увійти через Google
    </Button>
  );
}
