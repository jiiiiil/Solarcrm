import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { UsersRound, Plus, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function CommunityScreen() {
  const { communityPosts, addCommunityPost } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    category: 'Discussion',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommunityPost({
      ...formData,
      likes: 0,
      comments: 0,
    });
    toast.success('Post created');
    setShowForm(false);
    setFormData({ author: '', title: '', content: '', category: 'Discussion' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Community</h2>
          <p className="text-sm text-gray-500 mt-1">Installer network & knowledge sharing</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Author Name</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Discussion</option>
                <option>Question</option>
                <option>Guide</option>
                <option>News</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Post</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {communityPosts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-semibold">{post.author[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{post.author}</span>
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.createdAt}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {communityPosts.length === 0 && (
          <Card className="p-8 text-center">
            <UsersRound className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
