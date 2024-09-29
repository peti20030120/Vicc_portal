import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import JokeFeed from './pages/JokeFeed';
import UserProfile from './pages/UserProfile';
import PostJokeModal from './pages/PostJokeModal';
import { UserDTO } from './types/UserDTO';
import { PostDTO } from './types/PostDTO';
import { addFriend, getAllData, handleComment, handleLike, handlePostJoke, registerUser, removeFriend } from './service/dataService';
import LoginRegisterPage from './pages/LoginRegisterPage';

const App = () => {
  const mockData = 
  {
  "id": 9999999,
  "name": "User65",
  "surname": "Surname65",
  "email": "user65@example.com",
  "likes": {
    "count": 17,
    "likedByUsers": [
      22,
      19,
      75,
      88,
      93,
      33,
      58,
      97,
      7,
      82,
      15,
      28,
      79,
      57,
      80,
      49,
      69
    ]
  },
  "password": "SWHZ4Vzk",
  "posts": [
    {
      "id": 1,
      "title": "Post Title 1",
      "setup": "Post setup for post 1",
      "punchline": "Punchline for post 1",
      "createdAt": "2024-09-24T08:37:13.131434",
      "updatedAt": "2024-09-06T08:37:13.131439",
      "userId": 65,
      "likes": {
        "count": 19,
        "likedByUsers": [
          15,
          84,
          91,
          78,
          14,
          34,
          96,
          100,
          58,
          17,
          19,
          25,
          4,
          57,
          31,
          24,
          50,
          37,
          16
        ]
      },
      "comments": [
        {
          "id": 1,
          "text": "This is comment 1",
          "userId": 78,
          "createdAt": "2024-08-29T08:37:13.131476",
          "likeCount": 1
        }
      ]
    }
  ],
  "friends": [
    95,
    12,
    68,
    37,
    10,
    13,
    25,
    52,
    1,
    42
  ],
  "bio": "This is a sample bio for User65."
  };

  const [currentUser, setCurrentUser] = useState<UserDTO>(mockData);
  const [jokes, setJokes] = useState<PostDTO[]>([]);
  const [isPostJokeModalOpen, setIsPostJokeModalOpen] = useState(false);
  const [data, setData] = useState<UserDTO[]>([]);
  const [liked,  setLiked] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = useCallback( async () => {
    console.log('fetching data');
    const datas = await getAllData();
    setData(datas);
    setRefresh(false);
  }, [currentUser]);
  
  useEffect(() => {
    fetchData();
  }, [refresh, refreshTrigger]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (Array.isArray(data)) {
      const allJokes: PostDTO[] = data.flatMap(user => user.posts);
      setJokes(allJokes);
    } else {
      console.error('Data is not an array:', data);
    }
  }, [data]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredUsers(data);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = data.filter(user =>
        `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`.includes(lowerCaseQuery)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleLikeClick = async (userId: number, jokeId: number) => {
    setLiked(!liked);
    console.log('app liked ',liked);
    try {
      handleLike(userId, jokeId, currentUser.id);
      setData(await getAllData());
      setRefresh(true);
      triggerRefresh();
  } catch (error) {
      console.error('Error liking joke:', error);
    }
    setRefresh(false);
    await getAllData();
  };

  const handleCommentSubmit = async (userId: number, jokeId: number, comment: string) => {
    try {
      const currentUserId = currentUser.id;
      handleComment(userId, jokeId, comment, currentUserId);
      setData(await getAllData());
      setRefresh(true);
      triggerRefresh();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setRefresh(false);
    await getAllData();
  };

  const handlePostJokeSubmit = async (joke: {setup: string; punchline: string }) => {
    const userId = currentUser.id;
    try {
      handlePostJoke(userId, joke.setup, joke.punchline);
      setData(await getAllData());
      setRefresh(true);
      setIsPostJokeModalOpen(false);
      triggerRefresh();
    } catch (error) {
      console.error('Error posting joke:', error);

    }
    setRefresh(false);
    await getAllData();
  };

  const handleAddFriend = async (userId: number) => {
    try {
      await addFriend(currentUser.id, userId);
      setData(await getAllData());
      console.log('added: ',data)
      console.log('Friend added:', userId);
      setRefresh(true);
      triggerRefresh();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
    setRefresh(false);
    await getAllData();
  };

  const handleRemoveFriend = async (userId: number) => {
    try {
      await removeFriend(currentUser.id, userId);
      setData(await getAllData());
      console.log('removed: ',data)
      console.log('Friend removed:', userId);
      setRefresh(true);
      triggerRefresh();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
    setRefresh(false);
    await getAllData();
  };

  const handleLogin = (user: { email: string; password: string }) => {
      if (data.find((u) => u.email === user.email && user.password === u.password) as UserDTO) {
        console.log('Logged in user:', data.find((u) => u.email === user.email && user.password === u.password) as UserDTO);
        setCurrentUser(data.find((u) => u.email === user.email && user.password === u.password) as UserDTO);
      }else{
        alert('Wrong email or password!');
        setCurrentUser(mockData);
      }
      console.log('Logged in user:', user);
  };

  const handleRegister = async (newUser: UserDTO) => {
    try {
      await registerUser(newUser);
      setData(await getAllData());
      setCurrentUser(newUser);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        { currentUser.id === 9999999 ? (
          <LoginRegisterPage 
            onLogin={handleLogin}
            onRegister={handleRegister} 
          />
        ) : (
          <>
            <Navbar 
              onOpenPostJoke={() => setIsPostJokeModalOpen(true)}
              onSearch={handleSearch}
              filteredUsers={filteredUsers}
              currentUser={currentUser}
            />
            <Routes>
              <Route path="/" element={
                currentUser && jokes.length > 0 ? (
                  <JokeFeed 
                    jokes={jokes
                      .filter(joke => currentUser.friends.includes(joke.userId))
                      .map(joke => ({
                        ...joke,
                        user: data.find(user => user.id === joke.userId) as UserDTO
                      }))}
                    onLike={handleLikeClick}
                    onComment={handleCommentSubmit}
                    commentNames={data.map(user => ({
                      id: user.id,
                      name: user.name,
                      surname: user.surname,
                    }))}
                  />
                ) : (
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                  </div>
                )
              } />
              <Route path="/profile/me" element={
                <UserProfile
                  user={data}
                  currentUser={currentUser}
                  onAddFriend={handleAddFriend}
                  onRemoveFriend={handleRemoveFriend}
                  onLike={handleLikeClick}
                  onComment={handleCommentSubmit}
                  isItYourProfile={true}
                />
              } />
              <Route path="/profile/:userId" element={
                <UserProfile 
                  user={data}
                  currentUser={currentUser}
                  onAddFriend={handleAddFriend}
                  onRemoveFriend={handleRemoveFriend}
                  onLike={handleLikeClick}
                  onComment={handleCommentSubmit}
                  isItYourProfile={false}
                />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <PostJokeModal 
              isOpen={isPostJokeModalOpen}
              onClose={() => setIsPostJokeModalOpen(false)}
              onPostJoke={handlePostJokeSubmit}
            />
          </>
        )}
      </div>
    </Router>
  );
};
export default App;