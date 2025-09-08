// data/aiToolsData.ts
import { AITool } from '../aitypes/ai_type';

export const aiToolsData: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.',
    image: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=GPT',
    externalUrl: 'https://chatgpt.com',
    category: 'Conversational AI',
    subcategory: 'Text Generation',
    pricing: 'Freemium',
    rating: 4.8,
    isOpenSource: false,
    isTrending: true,
    tags: ['Writing', 'Coding', 'Analysis']
  },
  {
    id: '2',
    name: 'DALL-E 3',
    description: 'Advanced AI image generator that creates stunning visuals from text descriptions.',
    image: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=DE',
    externalUrl: 'https://openai.com/dall-e-3',
    category: 'Image Generation',
    subcategory: 'Art Creation',
    pricing: 'Paid',
    rating: 4.7,
    isOpenSource: false,
    isTrending: true,
    tags: ['Art', 'Design', 'Creativity']
  },
  {
    id: '3',
    name: 'Midjourney',
    description: 'AI-powered image generation tool that creates stunning artwork from text prompts.',
    image: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=MJ',
    externalUrl: 'https://www.midjourney.com',
    category: 'Image Generation',
    subcategory: 'Art Creation',
    pricing: 'Paid',
    rating: 4.6,
    isOpenSource: false,
    isTrending: true,
    tags: ['Art', 'Digital Art', 'Creativity']
  },
  {
    id: '4',
    name: 'Stable Diffusion',
    description: 'Open-source deep learning text-to-image model for creating detailed images.',
    image: 'https://via.placeholder.com/100x100/8E44AD/FFFFFF?text=SD',
    externalUrl: 'https://stability.ai/stable-diffusion',
    category: 'Image Generation',
    subcategory: 'Art Creation',
    pricing: 'Open Source',
    rating: 4.5,
    isOpenSource: true,
    isTrending: false,
    tags: ['Open Source', 'Art', 'Free']
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    description: 'AI-powered code completion tool that helps developers write code faster.',
    image: 'https://via.placeholder.com/100x100/24292E/FFFFFF?text=GH',
    externalUrl: 'https://github.com/features/copilot',
    category: 'Development',
    subcategory: 'Code Assistant',
    pricing: 'Paid',
    rating: 4.4,
    isOpenSource: false,
    isTrending: false,
    tags: ['Coding', 'Development', 'Productivity']
  },
  {
    id: '6',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant focused on being helpful, harmless, and honest.',
    image: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=CLD',
    externalUrl: 'https://claude.ai',
    category: 'Conversational AI',
    subcategory: 'Text Generation',
    pricing: 'Freemium',
    rating: 4.6,
    isOpenSource: false,
    isTrending: false,
    tags: ['Writing', 'Analysis', 'Safety']
  },
  {
    id: '7',
    name: 'ElevenLabs',
    description: 'AI voice generation platform for creating realistic speech from text.',
    image: 'https://via.placeholder.com/100x100/9B59B6/FFFFFF?text=EL',
    externalUrl: 'https://elevenlabs.io',
    category: 'Audio Generation',
    subcategory: 'Voice Synthesis',
    pricing: 'Freemium',
    rating: 4.5,
    isOpenSource: false,
    isTrending: true,
    tags: ['Voice', 'Audio', 'Speech']
  },
  {
    id: '8',
    name: 'RunwayML',
    description: 'AI-powered video editing and generation platform for creators.',
    image: 'https://via.placeholder.com/100x100/E67E22/FFFFFF?text=RM',
    externalUrl: 'https://runwayml.com',
    category: 'Video Generation',
    subcategory: 'Video Editing',
    pricing: 'Freemium',
    rating: 4.3,
    isOpenSource: false,
    isTrending: true,
    tags: ['Video', 'Editing', 'Creative']
  },
  {
    id: '9',
    name: 'Notion AI',
    description: 'AI-powered writing assistant integrated into Notion workspace.',
    image: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=NA',
    externalUrl: 'https://notion.so/product/ai',
    category: 'Productivity',
    subcategory: 'Writing Assistant',
    pricing: 'Paid',
    rating: 4.2,
    isOpenSource: false,
    isTrending: false,
    tags: ['Productivity', 'Writing', 'Workspace']
  },
  {
    id: '10',
    name: 'Hugging Face',
    description: 'Open-source platform for machine learning models and datasets.',
    image: 'https://via.placeholder.com/100x100/FF9500/FFFFFF?text=HF',
    externalUrl: 'https://huggingface.co',
    category: 'Development',
    subcategory: 'ML Platform',
    pricing: 'Open Source',
    rating: 4.7,
    isOpenSource: true,
    isTrending: false,
    tags: ['Open Source', 'ML', 'Models']
  }
];

// ... existing code ...

export const categories = [
  { id: 'all', name: 'All', icon: '🤖', count: aiToolsData.length },
  { id: 'trending', name: 'Trending', icon: '🔥', count: aiToolsData.filter(tool => tool.isTrending).length },
  { id: 'highest_rated', name: 'Highest Rated', icon: '⭐', count: aiToolsData.filter(tool => tool.rating >= 4.5).length },
  { id: 'conversational', name: 'Conversational AI', icon: '💬', count: aiToolsData.filter(tool => tool.category === 'Conversational AI').length },
  { id: 'image', name: 'Image Generation', icon: '🎨', count: aiToolsData.filter(tool => tool.category === 'Image Generation').length },
  { id: 'development', name: 'Development', icon: '👨‍💻', count: aiToolsData.filter(tool => tool.category === 'Development').length },
  { id: 'audio', name: 'Audio Generation', icon: '🎵', count: aiToolsData.filter(tool => tool.category === 'Audio Generation').length },
  { id: 'video', name: 'Video Generation', icon: '🎬', count: aiToolsData.filter(tool => tool.category === 'Video Generation').length },
  { id: 'productivity', name: 'Productivity', icon: '⚡', count: aiToolsData.filter(tool => tool.category === 'Productivity').length },
];



export const pricingFilters = [
  { id: 'all', name: 'All Pricing', icon: '💰' },
  { id: 'free', name: 'Free', icon: '🆓' },
  { id: 'freemium', name: 'Freemium', icon: '🎁' },
  { id: 'paid', name: 'Paid', icon: '💳' },
  { id: 'opensource', name: 'Open Source', icon: '🔓' },
];


// Validate URLs on app start (development only)
if (__DEV__) {
  aiToolsData.forEach(tool => {
    if (!tool.externalUrl.startsWith('http://') && !tool.externalUrl.startsWith('https://')) {
      console.warn(`Invalid URL for ${tool.name}: ${tool.externalUrl}`);
    }
  });
}