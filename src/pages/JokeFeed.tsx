import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PostDTO } from '@/types/PostDTO';
import { UserDTO } from '@/types/UserDTO';
import Comment from '@/components/Comment';
import { useNavigate } from 'react-router-dom';


interface JokeCardProps {
  joke: PostDTO & { user: UserDTO };
  commentName: { id: number; name: string; surname: string } [];
  onLike: (userId: number, jokeId: number) => void;
  onComment: (userId: number, jokeId: number, comment: string) => void;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke, onLike, onComment, commentName }) => {
  const [showPunchline, setShowPunchline] = useState<boolean>(false);
  const [showComments, setshowComments] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');



  const navigate = useNavigate();

  return (
    <Card className="mb-4">
      <CardHeader className="flex items-start cursor-pointer" onClick={() => navigate(`/profile/${joke.userId}`)}>
        <Avatar className="mr-2">
          <AvatarFallback>{joke.user.name[0]}{joke.user.surname[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{joke.user.name} {joke.user.surname}</h3>
          <p className="text-sm text-gray-500">{new Date(joke.createdAt).toLocaleString()}</p>
        </div>
      </CardHeader>
      <br />
      <CardContent className='flex flex-col items-start'>
        <p className="text-lg font-medium mb-2">{joke.setup}</p>
        {showPunchline && <p className="text-lg italic">{joke.punchline}</p>}
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => setShowPunchline(!showPunchline)}
        >
          {showPunchline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {showPunchline ? 'Hide punchline' : 'Show punchline'}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between items-center flex-col">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              onLike(joke.userId, joke.id);
            }} 
            className="flex items-center"
          >
            <ThumbsUp 
              size={20} 
              className="mr-2"
            />
            {joke.likes.count}
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => setshowComments(!showComments)}
          >
            <MessageCircle size={20} className="mr-2" />
            {joke.comments.length}
          </Button>
        </div>
          {showComments && (
            <div className="mt-2 w-full">
              {joke.comments.map((comment) => (
                <Comment 
                key={`${joke.id}-${comment.id}`} 
                comment={comment} 
                userName={commentName} 
                onLike={() => {console.log('Like clicked');}} 
              />
              ))}
            </div>
          )}
        <div className="flex-1 ml-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button onClick={() => {
            onComment(joke.userId, joke.id, comment);
            setComment('');
          }} className="mt-2">
            Post Comment
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface JokeFeedProps {
  jokes: (PostDTO & { user: UserDTO })[];
  commentNames: {
    id: number;
    name: string;
    surname: string;
    }[];
  onLike: (userId: number, jokeId: number) => void;
  onComment: (userId: number, jokeId: number, comment: string) => void;
}

const JokeFeed: React.FC<JokeFeedProps> = ({ jokes, onLike, onComment, commentNames }) => {
  const sortedJokes = jokes.sort((a, b) => b.likes.count - a.likes.count);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {sortedJokes.map(joke => (
        <JokeCard key={joke.id} joke={joke} onLike={onLike} onComment={onComment} commentName={commentNames} />
      ))}
    </div>
  );
};

export default JokeFeed;