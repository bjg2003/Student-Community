export type ResourceType = 'book' | 'video' | 'link' | 'software';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  uploadedBy: string;
  uploadedById: string;
  uploadedByPic?: string;
  uploadedAt: Date;
  tags?: string[];
  fileSize?: string;
  fileType?: string;
}

export interface ResourceContribution {
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  tags?: string[];
  file?: File;
}

export interface DBResource {
  id: number;
  file_name: string;
  description?: string;
  url?: string;
  uploaded_by: string;
  created_at: string;
  tags?: string;
}

export interface DBContribution {
  id: number;
  content: string;
  file: string;
  send_data: string;
  user_id: number;
}