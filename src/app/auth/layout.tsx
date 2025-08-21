"use client";

import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
            <main className="w-full max-w-[1440px] p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
