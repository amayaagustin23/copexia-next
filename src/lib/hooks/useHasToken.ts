"use client";

import { isLoggedIn } from "@/services/authService";
import { useEffect, useState } from "react";

export const useHasToken = (): boolean => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const check = async () => {
      const logged = await isLoggedIn();
      setHasToken(logged);
    };
    check();
  }, []);

  return hasToken;
};
