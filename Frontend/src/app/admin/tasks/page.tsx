'use client';

import { TaskSubmissionForm } from '@/components/tasks/TaskSubmissionForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminTasksPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/admin/login');
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !isClient) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage task submissions and approvals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              In Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-gray-500 mt-1">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-xs text-gray-500 mt-1">Created by me</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="create-task">Create Task</TabsTrigger>
        </TabsList>

        <TabsContent value="all-tasks">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Tasks</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Completed</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Types</option>
                  <option>Article</option>
                  <option>Media</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <TaskList />
          </div>
        </TabsContent>

        <TabsContent value="pending-approval">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Tasks Pending Approval</h2>
              <div className="text-sm text-gray-500">
                Tasks submitted by editors that need your review
              </div>
            </div>
            <TaskList />
          </div>
        </TabsContent>

        <TabsContent value="create-task">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Create New Task</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Admin Task Creation
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>As an admin, you can create tasks directly without approval, or set them to require approval from other admins.</p>
                    </div>
                  </div>
                </div>
              </div>
              <TaskSubmissionForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
