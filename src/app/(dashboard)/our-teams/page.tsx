"use client";

import { Teams } from "@/components/Teams";

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-white">Our Team</h1>
        <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
          Manage your team members and their information
        </p>
      </div>
      <Teams />
    </div>
  );
}