import React, { createContext, useContext, useState, useEffect } from 'react';

// API Configuration
const API_URL = 'http://localhost:5001/api';

export interface User {
  _id?: string;
  id?: string; // For backward compatibility if needed, but we'll try to use _id from MongoDB
  name: string;
  contact: string;
  role: 'citizen' | 'corporator' | 'president';
  wardNumber?: string;
  address?: string;
  houseNumber?: string;
  buildingName?: string;
  streetName?: string;
  city?: string;
  pincode?: string;
}

interface Issue {
  _id?: string;
  id?: string;
  type: 'drainage' | 'water' | 'potholes' | 'waste';
  description: string;
  photo: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  wardNumber: string;
  userId: string;
  userName: string;
  userContact: string;
  status: 'pending' | 'accepted' | 'resolved' | 'escalated';
  assignedCorporator?: string;
  createdAt: Date;
  acceptedAt?: Date;
  resolvedAt?: Date;
  workReport?: string;
  resolvedPhoto?: string;
  resolvedLocation?: { latitude: number; longitude: number };
}

interface AuthContextType {
  user: User | null;
  issues: Issue[];
  login: (contact: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  reportIssue: (issueData: any) => Promise<void>;
  acceptIssue: (issueId: string, corporatorId: string) => Promise<void>;
  resolveIssue: (issueId: string, workReport: string, photo: string, location: any) => Promise<void>;
  escalateIssue: (issueId: string) => Promise<void>;
  getUserIssues: (userId: string) => Issue[];
  getCorporatorIssues: (wardNumber: string) => Issue[];
  getEscalatedIssues: () => Issue[];
  getAllIssues: () => Issue[];
  updateUserProfile: (updatedData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from LocalStorage (Session only)
  useEffect(() => {
    const savedUser = localStorage.getItem('civix_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchIssues();
  }, []);

  // Poll for updates (every 30 seconds for simplicity, or we could just depend on actions)
  useEffect(() => {
    const interval = setInterval(fetchIssues, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_URL}/issues`);
      if (response.ok) {
        const data = await response.json();
        // Adapt MongoDB _id to id if necessary, or just use data directly
        setIssues(data.map((item: any) => ({ ...item, id: item._id })));
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  };

  const login = async (contact: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Normalize id
        const userObj = { ...userData, id: userData._id };
        setUser(userObj);
        localStorage.setItem('civix_user', JSON.stringify(userObj));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return true;
      }
      const err = await response.json();
      throw new Error(err.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civix_user');
  };

  // Profile update - strictly local for this demo unless we add a backend route
  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('civix_user', JSON.stringify(updatedUser));
  };

  const reportIssue = async (issueData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        await fetchIssues(); // Refresh list
      } else {
        throw new Error('Failed to report issue');
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptIssue = async (issueId: string, corporatorId: string) => {
    try {
      const response = await fetch(`${API_URL}/issues/${issueId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corporatorId }),
      });
      if (response.ok) await fetchIssues();
    } catch (error) {
      console.error('Error accepting issue:', error);
    }
  };

  const resolveIssue = async (issueId: string, workReport: string, photo: string, location: any) => {
    try {
      const response = await fetch(`${API_URL}/issues/${issueId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workReport, resolvedPhoto: photo, resolvedLocation: location }),
      });
      if (response.ok) await fetchIssues();
    } catch (error) {
      console.error('Error resolving issue:', error);
    }
  };

  const escalateIssue = async (issueId: string) => {
    try {
      const response = await fetch(`${API_URL}/issues/${issueId}/escalate`, {
        method: 'PATCH',
      });
      if (response.ok) await fetchIssues();
    } catch (error) {
      console.error('Error escalating issue:', error);
    }
  };

  // Helper functions to filter issues from the single source of truth
  const getUserIssues = (userId: string) => {
    // Check both id and _id to match safely
    return issues.filter(issue => (issue.userId === userId));
  };

  const getCorporatorIssues = (wardNumber: string) => {
    return issues.filter(issue => issue.wardNumber === wardNumber);
  };

  const getEscalatedIssues = () => {
    return issues.filter(issue => issue.status === 'escalated');
  };

  const getAllIssues = () => {
    return issues;
  };

  return (
    <AuthContext.Provider value={{
      user,
      issues,
      login,
      register,
      logout,
      reportIssue,
      acceptIssue,
      resolveIssue,
      escalateIssue,
      getUserIssues,
      getCorporatorIssues,
      getEscalatedIssues,
      getAllIssues,
      updateUserProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
