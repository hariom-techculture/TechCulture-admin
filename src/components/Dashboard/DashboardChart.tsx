'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  date: string;
  applications: number;
  enquiries: number;
}

interface DashboardChartProps {
  data: DataPoint[];
  className?: string;
}

export function DashboardChart({ data, className }: DashboardChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#2563eb" 
              strokeWidth={2} 
              name="Job Applications"
            />
            <Line 
              type="monotone" 
              dataKey="enquiries" 
              stroke="#16a34a" 
              strokeWidth={2}
              name="Enquiries"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
