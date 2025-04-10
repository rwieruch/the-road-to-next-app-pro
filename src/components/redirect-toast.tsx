"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { consumeCookiedByKey } from "@/actions/cookies";

const tryParseJsonObject = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const RedirectToast = () => {
  const pathname = usePathname();

  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");

      if (message) {
        const toastData = tryParseJsonObject(message);

        toast.success(
          typeof toastData === "string" ? (
            message
          ) : (
            <span>
              <Link href={toastData.link} className="underline">
                {toastData.message}
              </Link>
            </span>
          )
        );
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};

export { RedirectToast };
