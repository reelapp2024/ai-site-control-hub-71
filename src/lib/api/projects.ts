
import axios from 'axios';

const API_BASE = 'https://aibackend.todaystrends.site/admin/v1';

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  link?: string;
  githubLink?: string;
  startDate: string;
  endDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  categoryId: string;
  tags?: string[];
}

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await axios.get(`${API_BASE}/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  const response = await axios.post(`${API_BASE}/projects`, projectData);
  return response.data;
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
  const response = await axios.put(`${API_BASE}/projects/${projectId}`, projectData);
  return response.data;
};
