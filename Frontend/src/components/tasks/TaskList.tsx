'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { apiRequest } from '@/lib/api';
import { Task } from '@/types/task';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiRequest('/tasks/my-tasks', {}, true);
        setTasks(data.data.tasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusMap[status] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <Card key={task._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                {getStatusBadge(task.status)}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Type: {task.type.charAt(0).toUpperCase() + task.type.slice(1)}</p>
                <p>
                  Submitted by {task.submittedBy?.name || 'Unknown'} on{' '}
                  {new Date(task.submittedAt).toLocaleDateString()}
                </p>
                {task.assignedTo && (
                  <p>Assigned to: {task.assignedTo.name}</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{task.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Last updated: {formatDate(task.updatedAt)}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
