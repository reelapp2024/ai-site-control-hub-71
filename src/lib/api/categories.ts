
import axios from 'axios';

const API_BASE = 'https://aibackend.todaystrends.site/admin/v1';

export interface Category {
  id: string;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE}/categories`);
  return response.data;
};
