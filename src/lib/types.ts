export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  width: number;
  height: number;
  format: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  type: string;
  url: string;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  content: Record<string, any>;
  is_premium: boolean;
  created_at: string;
}

export type ProjectFormat = 'banner' | 'video' | 'svg' | 'html';

export interface CreateProjectData {
  name: string;
  description?: string;
  width: number;
  height: number;
  format: ProjectFormat;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  content?: Record<string, any>;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    shape?: 'rectangle' | 'circle';
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    imageUrl?: string;
  };
}