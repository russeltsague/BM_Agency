export interface Task {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'media' | 'other';
  referenceId?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  updatedAt: string;
  completedAt?: string;
  feedback?: string;
  history: Array<{
    status: string;
    changedBy: string | {
      _id: string;
      name: string;
      email: string;
    };
    changedAt: string;
    note?: string;
  }>;
}
