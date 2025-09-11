// aitypes/course_type.tsx
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  category: string;
  lessons: number;
  readTime: string;
  content: string;
  trending?: boolean;
  featured?: boolean;
  premium?: boolean;
  rating?: number;
  author?: string;
  publishDate?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  content: string;
}