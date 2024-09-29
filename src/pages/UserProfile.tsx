import React, { useEffect, useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import JokeFeed from './JokeFeed';
import { UserDTO } from '@/types/UserDTO';
import { useParams } from 'react-router-dom';

interface UserProfileProps {
    user: UserDTO[];
    currentUser: UserDTO;
    onAddFriend: (userId: number) => void;
    onRemoveFriend: (userId: number) => void;
    onLike: (userId: number, jokeId: number) => void;
    onComment: (userId: number, jokeId: number, comment: string) => void;
    isItYourProfile: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUser, onAddFriend, onRemoveFriend, onLike, onComment, isItYourProfile }) => {
    const [showAllJokes, setShowAllJokes] = useState<boolean>(false);
    
    const { userId } = useParams<{ userId: string }>();
    const userIdNumber = parseInt(userId!);
    
    const isFriend = currentUser.friends.includes(userIdNumber);

    const isItYourProfiles = currentUser.id === userIdNumber ? true : false;

    if (currentUser.id !== userIdNumber && !isItYourProfile) {
        const foundUser = user.find(user => user.id === userIdNumber);
        if (foundUser) {
            currentUser = foundUser;
        }
    }


        useEffect(() => {
            setShowAllJokes(isItYourProfiles);
        }, [isItYourProfiles]);

    

    const displayedJokes = isFriend || isItYourProfiles && showAllJokes
        ? currentUser.posts
        : currentUser.posts.sort((a, b) => b.likes.count - a.likes.count).slice(0, 5);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold">{currentUser.name} {currentUser.surname}</h2>
                    <p className="text-gray-500">{currentUser.email}</p>
                </CardHeader>
                <CardContent >
                    <p className="mb-4">{currentUser.bio}</p>
                    <div className="flex justify-between items-center">
                    { !isItYourProfiles && (
                        <Button
                            onClick={() => isFriend ? onRemoveFriend(currentUser.id) : onAddFriend(currentUser.id)}
                            className="mb-4"
                        >
                            {isFriend ? (
                                <>
                                    <UserMinus size={20} className="mr-2" />
                                    Remove Friend
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} className="mr-2" />
                                    Add Friend
                                </>
                            )}
                        </Button>
                    )}
                    {isFriend && (
                        <Button
                            onClick={() => setShowAllJokes(!showAllJokes)}
                            variant="outline"
                            className="mb-4 ml-2"
                        >
                            {showAllJokes ? 'Show Top Jokes' : 'Show All Jokes'}
                        </Button>
                    )}
                    </div>
                </CardContent>
            </Card>
            <div className="mt-8">
                {isItYourProfiles ? (
                                <>
                                    <h3 className="text-xl font-semibold mb-4">My Jokes</h3>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold mb-4">Jokes</h3>
                                </>
                            )}
                <JokeFeed
                    jokes={displayedJokes.map(joke => ({ ...joke, user: currentUser }))}
                    onLike={onLike}
                    onComment={onComment}
                    commentNames={user.map(user => ({
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                      }))}
                />
            </div>
        </div>
    );
};

export default UserProfile;