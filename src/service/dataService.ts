import { UserDTO } from '../types/UserDTO';
import { PostDTO } from '../types/PostDTO';
import { CommentDTO } from '../types/CommentDTO';

const API_URL = '/api';

async function fetchData(): Promise<UserDTO[]> {
  const response = await fetch(`${API_URL}/users_data_with_bio.json`);
  return await response.json();
}

export async function saveData(data: UserDTO[]): Promise<void> {
  await fetch(`${API_URL}/save_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function initializeData(): Promise<void> {
  const data = await fetchData();
  console.log(data);
}

export async function handleLike(userId: number, jokeId: number, currentUserId: number): Promise<void> {
  const data = await fetchData();
  const joke = data[userId-1].posts[jokeId-1];
  const alreadyLiked = joke.likes.likedByUsers.includes(currentUserId) ? true : false;
  
  if (!alreadyLiked) {
    joke.likes.count += 1;
    joke.likes.likedByUsers.push(currentUserId);
  } else {
    joke.likes.count -= 1;
    joke.likes.likedByUsers = joke.likes.likedByUsers.filter(id => id !== currentUserId);
  }
  
  await saveData(data);
  await getAllData();
}

export async function handleComment(userId: number, jokeId: number, commentText: string, currentUserId: number): Promise<void> {
  const data = await fetchData();
  const joke = data[userId - 1].posts[jokeId - 1];
  const newComment: CommentDTO = {
    id: Math.max(0, ...joke.comments.map(c => c.id)) + 1,
    text: commentText,
    userId: currentUserId,
    createdAt: new Date().toISOString(),
    likeCount: 0
  };
  joke.comments.push(newComment);
  await saveData(data);
  await getAllData();
}

export async function handlePostJoke(userId: number, setup: string, punchline: string): Promise<void> {
  const data = await fetchData();
  const user = data[userId - 1];
  const newJoke: PostDTO = {
    id: Math.max(0, ...user.posts.map(p => p.id)) + 1,
    title: `Joke ${user.posts.length + 1}`,
    setup,
    punchline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: userId,
    likes: { count: 0, likedByUsers: [] },
    comments: []
  };
  user.posts.push(newJoke);
  await saveData(data);
  await getAllData();
}

export async function addFriend(currentUserId: number, friendUserId: number): Promise<void> {
    const data = await fetchData();
    const currentUser = data.find(user => user.id === currentUserId);
    if (currentUser && !currentUser.friends.includes(friendUserId)) {
      currentUser.friends.push(friendUserId);
      await saveData(data);
    }
    await getAllData();
}

  export async function removeFriend(currentUserId: number, friendUserId: number): Promise<void> {
    const data = await fetchData();
    const currentUser = data.find(user => user.id === currentUserId);
    if (currentUser) {
      currentUser.friends = currentUser.friends.filter(id => id !== friendUserId);
      await saveData(data);
    }
    await getAllData();
}
  export async function registerUser(newUser: UserDTO): Promise<void> {
    const data = await fetchData();

    const existingUser = data.find(user => user.email === newUser.email);
    if (existingUser) {
      throw new Error('User with the same email or username already exists.');
    }

    newUser.id = Math.max(0, ...data.map(user => user.id)) + 1;
    newUser.posts = [];
    newUser.friends = [];
    
    data.push(newUser);
    await saveData(data);
    await getAllData();
}

export async function getAllData(): Promise<UserDTO[]> {
  return await fetchData();
}