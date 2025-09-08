export interface AITool {
  id: string;
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  category: string;
  subcategory?: string;
  pricing?: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  rating: number;
  isOpenSource?: boolean;
  isTrending?: boolean;
  tags?: string[];
}