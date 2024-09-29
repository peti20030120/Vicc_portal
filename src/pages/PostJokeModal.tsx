import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface PostJokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostJoke: (joke: {setup: string; punchline: string }) => void;
}

const PostJokeModal: React.FC<PostJokeModalProps> = ({ isOpen, onClose, onPostJoke }) => {
  const [setup, setSetup] = useState<string>('');
  const [punchline, setPunchline] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onPostJoke({ setup, punchline });
    setSetup('');
    setPunchline('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a New Joke</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="setup" className="block text-sm font-medium text-gray-700">Setup</label>
            <Textarea
              id="setup"
              value={setup}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSetup(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter the setup of your joke..."
            />
          </div>
          <div className="mb-4">
            <label htmlFor="punchline" className="block text-sm font-medium text-gray-700">Punchline</label>
            <Textarea
              id="punchline"
              value={punchline}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPunchline(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter the punchline of your joke..."
            />
          </div>
          <DialogFooter>
            <Button type="submit">Post Joke</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJokeModal;