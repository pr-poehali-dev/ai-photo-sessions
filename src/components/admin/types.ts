export interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  plan: string;
  is_admin: boolean;
  created_at: string;
}

export interface GeneratedImage {
  id: number;
  prompt: string;
  image_url: string;
  theme: string;
  model: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Stats {
  total_users: number;
  total_images: number;
  total_credits_used: number;
  active_users: number;
}

export type TabType = 'overview' | 'users' | 'images' | 'generator';
