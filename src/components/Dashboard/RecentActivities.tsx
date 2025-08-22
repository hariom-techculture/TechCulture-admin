'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'application' | 'enquiry' | 'contact';
  title: string;
  timestamp: string;
  status?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="col-span-12 xl:col-span-4">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  {activity.status && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
