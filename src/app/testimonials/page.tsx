"use client";

import { Testimonials } from "@/components/Testimonials";

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Testimonials Management
        </h2>
      </div>
      <Testimonials />
    </div>
  );
}