export interface UserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface IPost {
  title: string;
  content: string;
  authorId: string;
}
