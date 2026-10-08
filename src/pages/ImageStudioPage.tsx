import React, { useState, useEffect } from 'react';
import { imageService } from '../services/imageService';
import { ImageItem } from '../types';
import { Button } from '../components/ui/Button';
import { Sparkles, Download, Trash2 } from 'lucide-react';

export const ImageStudioPage: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageItem['aspectRatio']>('16:9');
  const [style, setStyle] = useState<ImageItem['style']>('Digital Art');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    imageService.getImages().then(setImages);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    try {
      await imageService.generateImage(prompt, aspectRatio, style);
      const list = await imageService.getImages();
      setImages(list);
      setPrompt('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await imageService.deleteImage(id);
    const list = await imageService.getImages();
    setImages(list);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Image Studio</h1>
        <p className="text-xs text-slate-400 mt-1">Generate high-definition artwork, mockups, and visual graphics with DALL-E 3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Control Panel */}
        <div className="p-6 rounded-3xl bg-[#0B0F1F]/80 backdrop-blur-2xl border border-white/10 space-y-5 h-fit shadow-xl shadow-indigo-500/5">
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" /> Prompt Settings
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Prompt Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={4}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '16:9', '9:16'] as ImageItem['aspectRatio'][]).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      aspectRatio === ar
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-indigo-400/30 shadow-md shadow-indigo-500/20'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Art Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ImageItem['style'])}
                className="w-full p-2.5 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
              >
                <option value="Digital Art">Digital Art</option>
                <option value="Photorealistic">Photorealistic</option>
                <option value="Vivid">Vivid Concept</option>
                <option value="Anime">Anime Illustration</option>
              </select>
            </div>

            <Button type="submit" isLoading={generating} className="w-full">
              <span>Generate Studio Image</span>
            </Button>
          </form>
        </div>

        {/* Right Gallery */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white">Generated Gallery ({images.length})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
                <img src={img.url} alt={img.prompt} className="w-full h-52 object-cover" />
                <div className="p-3 bg-[#0F172A] text-white space-y-1">
                  <div className="text-xs truncate font-medium">{img.prompt}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{img.style} • {img.aspectRatio}</span>
                    <div className="flex space-x-2">
                      <a href={img.url} target="_blank" download className="hover:text-white">
                        <Download className="h-3.5 w-3.5" />
                      </a>
                      <button onClick={() => handleDelete(img.id)} className="hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
