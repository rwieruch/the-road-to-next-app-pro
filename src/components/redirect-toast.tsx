"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { deleteCookieByKey, getCookieByKey } from "@/actions/cookies";

const RedirectToast = () => {
  const pathname = usePathname();

  useEffect(() => {
    const showCookieToast = async () => {
      const message = await getCookieByKey("toast");

      if (message) {
        toast.success(
          <div
            className="[&_a]:underline"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        );

        await deleteCookieByKey("toast");
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};

export { RedirectToast };
