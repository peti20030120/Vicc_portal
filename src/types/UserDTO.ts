import { PostDTO } from "./PostDTO";

export interface UserDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
    likes: {
        count: number;
        likedByUsers: number[];
    }
    password: string;
    posts: PostDTO[]; 
    friends: number[];
    bio: string;
  }