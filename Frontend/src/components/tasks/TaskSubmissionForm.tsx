'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface TaskFormData {
  title: string;
  description: string;
  type: 'article' | 'media' | 'other';
  referenceId?: string;
  status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  assignedTo?: string;
}

export function TaskSubmissionForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TaskFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const selectedType = watch('type');
  const selectedStatus = watch('status');

  // Check if user is admin
  const isAdmin = user?.roles?.some(role =>
    ['admin', 'owner', 'super-admin'].includes(role.toLowerCase())
  );

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);

      let endpoint = '/tasks';
      let requestData = data;

      if (isAdmin && data.status) {
        // Admin creating task directly - use admin endpoint
        endpoint = '/tasks/admin-create';
      }

      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestData),
      }, true);

      toast.success('Task created successfully!');
      reset();
      // Refresh the page to show the new task
      window.location.reload();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Task Type
        </label>
        <Select
          value={selectedType}
          onValueChange={(value: 'article' | 'media' | 'other') => setValue('type', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {isAdmin && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Status
          </label>
          <Select
            value={selectedStatus}
            onValueChange={(value: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed') =>
              setValue('status', value)
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select initial status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending (needs approval)</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-sm text-gray-500">
            As an admin, you can set the initial status directly
          </p>
        </div>
      )}

      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your task will be submitted for admin approval.
            You'll be notified once it's reviewed.
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : isAdmin ? 'Create Task' : 'Submit for Approval'}
      </Button>
    </form>
  );
}
