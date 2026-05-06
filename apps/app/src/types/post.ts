export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
};

export type PostInput = {
  title: string;
  content: string;
};

export type PostFormValue = {
  title: string;
  content: string;
};
