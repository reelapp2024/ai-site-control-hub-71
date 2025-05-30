
import axios from 'axios';

const API_BASE = 'https://aibackend.todaystrends.site/admin/v1';

export interface Tag {
  id: string;
  name: string;
}

export const getTags = async (): Promise<Tag[]> => {
  const response = await axios.get(`${API_BASE}/tags`);
  return response.data;
};
