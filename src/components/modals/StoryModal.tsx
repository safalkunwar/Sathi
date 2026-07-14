import React, { useState } from 'react';
import { Image, Camera, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { useCompanions } from '../../hooks/useFirestoreData';
import { ExperienceStory } from '../../types';

interface StoryModalProps {
  onClose: () => void;
  onPosted?: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ onClose, onPosted }) => {
  const { currentUser, postStory } = useAppContext();
  const { showToast } = useToast();
  const { companions } = useCompanions();
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [companionId, setCompanionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (value: string) => {
    setImageUrl(value);
    setImagePreview(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to post a story.');
      return;
    }
    if (!imageUrl) {
      setError('Please add a photo (upload or paste a URL).');
      return;
    }
    if (!caption.trim()) {
      setError('Please write a caption.');
      return;
    }

    setLoading(true);
    try {
      const companion = companions.find(c => c.id === companionId);
      const story: Omit<ExperienceStory, 'id'> = {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        companionId: companion?.id,
        companionName: companion?.name || '',
        imageUrl,
        caption: caption.trim(),
        timeAgo: 'Just now',
        likes: 0,
        comments: 0,
      };
      await postStory(story);
      showToast('Your story is live!', 'success');
      onPosted?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="story-modal-title">
      <div className="bg-[#17191C] border border-[#2A2D31] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#2A2D31] flex justify-between items-center bg-[#0F1113]">
          <h2 id="story-modal-title" className="text-xl font-bold text-white">Share a Moment</h2>
          <button onClick={onClose} className="text-[#8E9299] hover:text-white transition-colors" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Photo</label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#2A2D31] mb-2">
                  <img src={imagePreview} alt="Story preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setImageUrl(''); }}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full py-8 rounded-xl border-2 border-dashed border-[#2A2D31] bg-[#1E2124] text-[#8E9299] hover:border-[#C8A25E] hover:text-[#C8A25E] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Upload a photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              )}
              <div className="relative mt-2">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="url"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm"
                  placeholder="…or paste an image URL"
                />
              </div>
            </div>

            <div>
              <label htmlFor="story-caption" className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Caption</label>
              <textarea
                id="story-caption"
                rows={3}
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm resize-none"
                placeholder="What was this moment about?"
              />
            </div>

            <div>
              <label htmlFor="story-companion" className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Companion (optional)</label>
              <select
                id="story-companion"
                value={companionId}
                onChange={(e) => setCompanionId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1E2124] border border-[#2A2D31] rounded-xl text-white outline-none focus:border-[#C8A25E] text-sm"
              >
                <option value="">None</option>
                {companions.map(c => (
                  <option key={c.id} value={c.id}>{c.name}, {c.location}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] transition-colors uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting…' : 'Post Story'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
