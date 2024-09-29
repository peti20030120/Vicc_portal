import { CommentDTO } from "./CommentDTO";

export interface PostDTO{
    id: number;
    title: string;
    setup: string;
    punchline: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    likes: {
        count: number;
        likedByUsers: number[];
    }
    comments: CommentDTO[];
}