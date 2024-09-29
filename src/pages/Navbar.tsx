import React, { useState } from 'react';
import { Search, PlusCircle, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { UserDTO } from '@/types/UserDTO';

interface NavbarProps {
  onOpenPostJoke: () => void;
  onSearch: (query: string) => void;
  filteredUsers: UserDTO[];
  currentUser: UserDTO;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenPostJoke, onSearch, filteredUsers, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  const OpenFeed = () => {
    navigate(`/`);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-bold text-blue-600 mr-4 cursor-pointer" onClick={OpenFeed}>JokeFeed</h1>
          <form className="flex-1 max-w-lg">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={onOpenPostJoke} variant="outline" className="flex items-center">
            <PlusCircle size={20} className="mr-2" />
            Post Joke
          </Button>
          <Button onClick={handleProfileClick} variant="ghost" className="p-2">
            <User size={24} />
          </Button>
        </div>
      </div>

      {isFocused && filteredUsers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-md font-semibold mb-2">Top Users</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredUsers.slice(0, 10).map((user) => (
              <div
                key={user.id}
                className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                onClick={() => navigate(`/profile/${user.id}`)}  // Navigates to user profile
              >
                <h3 className="text-blue-600 font-bold text-md">{user.name} {user.surname}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">{user.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
