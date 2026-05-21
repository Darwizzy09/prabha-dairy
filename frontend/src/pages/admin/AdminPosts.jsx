import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Send, X, Loader2, Sparkles } from 'lucide-react';

export default function AdminPosts() {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle image selection and create a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL so the admin can see the photo before posting
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !caption.trim()) {
      toast.error('Please provide both an image and a caption.');
      return;
    }

    setIsUploading(true);

    // We MUST use FormData when sending files to the backend
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', caption);

    try {
      await axios.post('https://prabha-dairy.vercel.app/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Update posted successfully! 🎉');
      
      // Reset form
      setCaption('');
      handleRemoveImage();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('Failed to post update. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Create Update</h1>
            <p className="text-gray-500 font-medium">Post photos and news to your social feed.</p>
          </div>
        </div>

        {/* Uploader Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Photo</label>
              
              {!imagePreview ? (
                <label className="relative border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-brand/50 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 group-hover:text-brand group-hover:scale-110 transition-all mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <p className="font-bold text-gray-700">Click to upload a photo</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG, up to 5MB</p>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-cover" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Caption Text Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Caption</label>
              <textarea
                rows="4"
                placeholder="Write something engaging about this photo..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isUploading || !imageFile || !caption.trim()}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                isUploading || !imageFile || !caption.trim() 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isUploading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Uploading to Cloudinary...</>
              ) : (
                <><Send size={20} /> Post Update</>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}