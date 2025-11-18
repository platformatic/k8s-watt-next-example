"use client";

import { useCallback } from "react";

export function ReloadButton() {
  "use client";
  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <a
      onClick={reload}
      href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
    >
      Reload the page
    </a>
  );
}
