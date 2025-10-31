import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface UserInput {
  name: string;
  email: string;
  password?: string; // Make password optional
  roles: string[];
  isActive: boolean; // Add isActive property
  role?: string; // For form compatibility
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersAPI = {
  // Get all users
  getAll: async (): Promise<{ data: User[] }> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Get single user
  get: async (id: string): Promise<{ data: User }> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (userData: UserInput): Promise<{ data: User }> => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  // Update user
  update: async (id: string, userData: Partial<UserInput>): Promise<{ data: User }> => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};

export default usersAPI;
