export interface Post {
  id: number;
  title: string;
  content: string;
}

export interface PostInput {
  title: string;
  content: string;
}

export interface ApiError {
  message: string;
}
