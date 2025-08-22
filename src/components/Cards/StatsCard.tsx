'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  change?: number;
}

export function StatsCard({ title, value, icon: Icon, description, change }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
            {change !== undefined && (
              <span className={change > 0 ? "text-green-500" : "text-red-500"}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
