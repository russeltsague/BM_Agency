'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { TaskSubmissionForm } from '@/components/tasks/TaskSubmissionForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Users } from 'lucide-react';
import Link from 'next/link';

export default function TasksPage() {
  const { user, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && user) {
      router.push('/admin/tasks')
    }
  }, [user, isHydrated, router])

  if (!isHydrated) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center py-8">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4">Task Management</h1>
            <p className="text-gray-600 mb-8">
              Submit tasks for review and track their progress. Login required to access task management.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Access Task Management</CardTitle>
              <CardDescription>
                You need to be logged in to submit and track tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to Access Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>

      <Tabs defaultValue="my-tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="submit-task">Submit New Task</TabsTrigger>
        </TabsList>

        <TabsContent value="my-tasks">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">My Tasks</h2>
            <TaskList />
          </div>
        </TabsContent>

        <TabsContent value="submit-task">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Submit New Task</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <TaskSubmissionForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
