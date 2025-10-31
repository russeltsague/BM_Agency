export interface Author {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string | { name: string; email: string; _id?: string };
  category?: string;
  tags?: string[];
  image?: string;
  published: boolean;
  featured?: boolean;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  rejectionReason?: string;
  stateHistory?: Array<{
    from: string; // Making from required
    to: string;   // Making to required
    timestamp: string;
    changedBy: string;
    reason?: string;
  }>;
  metadata?: {
    wordCount: number;
    readingTime: number;
    lastModifiedBy: string;
    version: number;
  };
}
