import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import { CommentDTO } from '@/types/CommentDTO';

interface CommentProps {
  comment: CommentDTO;
  userName: { id: number; name: string; surname: string }[];
  onLike: () => void;
}

const commetWithUserName = (comment: CommentDTO, userName: { id: number; name: string; surname: string }[]) => {
  const user = userName.find(u => u.id === comment.userId);
  return {
    ...comment,
    userName: user ? `${user.name} ${user.surname}` : 'Unknown User'
  };
};

const Comment: React.FC<CommentProps> = ({ comment, userName, onLike }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center flex-col">
          {/* User avatar or username */}
          <span className="mr-2">{commetWithUserName(comment, userName).userName}</span>
          <div>{comment.createdAt}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p>{comment.text}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="flex items-center" onClick={onLike}>
            <ThumbsUp size={20} className="mr-2" />
            {comment.likeCount}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Comment;