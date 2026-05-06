import { Post, PostInput } from '../types/post';
import { request } from './http';

export const postsApi = {
  getAll: () => request('/posts') as Promise<Post[]>,
  getOne: (postId: number) => request(`/posts/${postId}`) as Promise<Post>,
  create: (payload: PostInput) =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<Post>,
  update: (postId: number, payload: PostInput) =>
    request(`/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }) as Promise<Post>,
  remove: (postId: number) =>
    request(`/posts/${postId}`, {
      method: 'DELETE',
    }) as Promise<void>,
};
