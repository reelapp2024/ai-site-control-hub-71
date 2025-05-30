
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

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}
