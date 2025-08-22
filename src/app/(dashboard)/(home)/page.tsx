"use client"
import React, { Suspense } from "react";
import { Users, Briefcase, FileText, Mail, PhoneCall } from 'lucide-react';
import { StatsCard } from "@/components/Cards/StatsCard";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { DashboardChart } from "@/components/Dashboard/DashboardChart";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const fetchCount = async (endpoint: string) => {
      const res = await fetch(`${baseUrl}${endpoint}`, { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      const data = await res.json();
      return data.count || 0;
    };

    const fetchRecentItems = async (endpoint: string) => {
      const res = await fetch(`${baseUrl}${endpoint}`, { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      return res.json();
    };

    const [
      userCount, 
      jobCount, 
      applicationCount, 
      enquiryCount, 
      contactCount,
      recentApplications,
      recentEnquiries,
      activityData
    ] = await Promise.all([
      fetchCount('/api/user/count'),
      fetchCount('/api/job-post/count'),
      fetchCount('/api/job-application/count'),
      fetchCount('/api/enquiry/count'),
      fetchCount('/api/contact/count'),
      fetchRecentItems('/api/job-application/recent'),
      fetchRecentItems('/api/enquiry/recent'),
      fetchRecentItems('/api/stats/activity')
    ]);

    return {
      userCount,
      jobCount,
      applicationCount,
      enquiryCount,
      contactCount,
      recentActivities: [
        ...recentApplications.map((app: any) => ({
          id: app._id,
          type: 'application',
          title: `New application for ${app.jobTitle}`,
          timestamp: app.createdAt,
          status: app.status
        })),
        ...recentEnquiries.map((enq: any) => ({
          id: enq._id,
          type: 'enquiry',
          title: `New enquiry: ${enq.message}`,
          timestamp: enq.createdAt,
          status: enq.status
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10),
      activityData: activityData.slice(-30) // Last 30 days of activity
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      userCount: 0,
      jobCount: 0,
      applicationCount: 0,
      enquiryCount: 0,
      contactCount: 0,
      recentActivities: [],
      activityData: []
    };
  }
}


export default function Home() {
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 15*60*1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error loading dashboard data</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard 
          title="Total Users"
          value={stats.userCount}
          icon={Users}
          description="Total registered users"
        />
        <StatsCard 
          title="Job Posts"
          value={stats.jobCount}
          icon={Briefcase}
          description="Active job postings"
        />
        <StatsCard 
          title="Applications"
          value={stats.applicationCount}
          icon={FileText}
          description="Job applications received"
        />
        <StatsCard 
          title="Enquiries"
          value={stats.enquiryCount}
          icon={Mail}
          description="Total enquiries"
        />
        <StatsCard 
          title="Contacts"
          value={stats.contactCount}
          icon={PhoneCall}
          description="Contact messages"
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <DashboardChart 
          data={stats.activityData} 
          className="col-span-12 xl:col-span-8"
        />
        
        <RecentActivities 
          activities={stats.recentActivities}
        />
      </div>
    </>
  );
}
