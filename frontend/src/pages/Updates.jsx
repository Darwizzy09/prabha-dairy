import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Sparkles, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Updates() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👉 FIX 1: Initialize likes from LocalStorage so they survive page changes
  const [likedPosts, setLikedPosts] = useState(() => {
    const savedLikes = localStorage.getItem('prabha_liked_posts');
    return savedLikes ? new Set(JSON.parse(savedLikes)) : new Set();
  });

  // 👉 FIX 2: Save likes to LocalStorage every time the Set changes
  useEffect(() => {
    localStorage.setItem('prabha_liked_posts', JSON.stringify([...likedPosts]));
  }, [likedPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://prabha-dairy.vercel.app/api/posts');
        setPosts(response.data);
      } catch (error) {
        toast.error("Failed to load updates");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    if (likedPosts.has(postId)) return;

    setPosts(posts.map(post => 
      post._id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    setLikedPosts(new Set([...likedPosts, postId]));

    try {
      await axios.put(`https://prabha-dairy.vercel.app/api/posts/${postId}/like`);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  // 👉 FIX 3: The Native Share Function
  const handleShare = async (post) => {
    const shareData = {
      title: 'Prabha Dairy',
      text: `Check out this update from Prabha Dairy: "${post.caption}"`,
      url: window.location.href
    };

    // Check if the device supports the native sharing menu (Mobile phones do!)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled the share, fail silently
        console.log("Share cancelled", error);
      }
    } else {
      // Fallback for Desktop: Copy link to clipboard
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      toast.success("Copied to clipboard!", { icon: '📋' });
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-full mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Prabha Dairy Community</h1>
          <p className="text-gray-500 font-medium">Behind the scenes, fresh batches, and latest news.</p>
        </div>

        <div className="space-y-10">
          {loading ? (
            <div className="text-center py-12 text-brand font-bold animate-pulse text-xl">Loading updates...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-gray-100 text-gray-500">
              No updates yet. Check back soon!
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                
                <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand text-white font-black rounded-full flex items-center justify-center shadow-md">
                      P
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Prabha Dairy</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-50">
                  <img 
                    src={post.image} 
                    alt="Update from Prabha Dairy" 
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 transition-colors ${likedPosts.has(post._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                      <Heart size={24} className={likedPosts.has(post._id) ? 'fill-current' : ''} />
                      <span className="font-bold">{post.likes || 0}</span>
                    </button>
                    {/* 👉 FIX 4: Wire up the Share Button */}
                    <button 
                      onClick={() => handleShare(post)}
                      className="text-gray-500 hover:text-brand transition-colors"
                      title="Share this update"
                    >
                      <Share2 size={22} />
                    </button>
                  </div>

                  <div className="text-gray-800 leading-relaxed">
                    <span className="font-black mr-2">Prabha Dairy</span>
                    {post.caption}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}