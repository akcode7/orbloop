// aitypes/course_type.tsx
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  category: string;
  readTime: string;
  content: string;
  trending?: boolean;
  featured?: boolean;
  premium?: boolean;
  rating?: number;
  author?: string;
  publishDate?: string;
}