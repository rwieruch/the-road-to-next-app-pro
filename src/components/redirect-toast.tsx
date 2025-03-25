"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { consumeCookiedByKey } from "@/actions/cookies";

const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");

      if (message) {
        toast.success(message);
      }
    };

    showCookieToast();

    const intervalId = setInterval(() => {
      showCookieToast();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null;
};

export { RedirectToast };
