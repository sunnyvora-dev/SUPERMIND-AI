import React, { useState, useEffect } from 'react';
import { imageService } from '../services/imageService';
import { ImageItem } from '../types';
import { Button } from '../components/ui/Button';
import { Sparkles, Download, Trash2, Image as ImageIcon, Copy, Check, X, Maximize2, Loader2 } from 'lucide-react';

export const ImageStudioPage: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageItem['aspectRatio']>('16:9');
  const [style, setStyle] = useState<ImageItem['style']>('Digital Art');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

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

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewImage?.id === id) setPreviewImage(null);
    await imageService.deleteImage(id);
    const list = await imageService.getImages();
    setImages(list);
  };

  const handleCopyPrompt = (text: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight">
          AI Image Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#77736B] mt-1">
          Synthesize high-fidelity digital art, photorealistic portraits, and concept graphics with Grok Imagine & Flux AI. All creations are automatically preserved in your account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Control Panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-5 h-fit shadow-2xs">
          <div className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F05A3C]" /> Prompt Studio Settings
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717] dark:text-[#D2CFC7]">Prompt Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision (e.g., 'A majestic cybernetic white tiger in neo-Tokyo with rain reflections')..."
                rows={4}
                className="w-full p-3 bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] resize-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717] dark:text-[#D2CFC7]">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '16:9', '9:16'] as ImageItem['aspectRatio'][]).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      aspectRatio === ar
                        ? 'bg-[#F05A3C] text-white border-[#F05A3C] shadow-2xs'
                        : 'bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] border-[#DCD6CA] dark:border-[#33312B] hover:bg-[#EAE5D9] dark:hover:bg-[#252421]'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717] dark:text-[#D2CFC7]">Artistic Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ImageItem['style'])}
                className="w-full p-2.5 bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] outline-none focus:border-[#F05A3C] cursor-pointer"
              >
                <option value="Digital Art">Digital Art (High Detail)</option>
                <option value="Photorealistic">Photorealistic (8K Photography)</option>
                <option value="Vivid">Vivid Concept (Cinematic Lighting)</option>
                <option value="Anime">Anime (Makoto Shinkai Style)</option>
              </select>
            </div>

            <Button type="submit" isLoading={generating} className="w-full">
              <span>{generating ? 'Synthesizing Image...' : 'Generate Studio Image'}</span>
            </Button>
          </form>
        </div>

        {/* Right Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6] flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#F05A3C]" />
              <span>Saved Account Gallery ({images.length})</span>
            </h3>
            <span className="text-[11px] text-[#77736B] font-mono">Synced with Database</span>
          </div>

          {/* Active Generation Shimmer Card */}
          {generating && (
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#F05A3C] flex items-center space-x-3 animate-pulse">
              <Loader2 className="h-5 w-5 text-[#F05A3C] animate-spin shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#F05A3C]">Generating New Masterpiece...</div>
                <div className="text-[11px] text-[#77736B] truncate">Synthesizing visual diffusion prompt with Grok & Flux AI</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && !generating && (
            <div className="p-12 rounded-2xl border border-dashed border-[#DCD6CA] dark:border-[#33312B] text-center space-y-3 bg-[#FAF8F3] dark:bg-[#1E1E1C]">
              <div className="h-12 w-12 rounded-2xl bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] text-[#F05A3C] flex items-center justify-center mx-auto shadow-2xs">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h4 className="text-base font-serif font-medium text-[#171717] dark:text-[#F4F0E6]">No images generated yet</h4>
              <p className="text-xs text-[#77736B] max-w-sm mx-auto">
                Type a prompt on the left and click "Generate Studio Image", or ask SuperMind in Chat to generate images. All created assets are stored directly in your account.
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setPreviewImage(img)}
                className="group relative rounded-2xl overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-2xs hover:border-[#F05A3C] transition-all cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-video bg-black/40">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F3] dark:bg-[#1E1E1C] border-t border-[#DCD6CA] dark:border-[#33312B] space-y-1.5">
                  <div className="text-xs font-semibold text-[#171717] dark:text-[#F4F0E6] truncate" title={img.prompt}>
                    {img.prompt}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#77736B]">
                    <span>{img.style} • {img.aspectRatio}</span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopyPrompt(img.prompt, img.id, e)}
                        className="p-1 rounded-md hover:bg-[#EAE5D9] dark:hover:bg-[#252421] text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors"
                        title="Copy Prompt"
                      >
                        {copiedId === img.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        download={`supermind-${img.id}.png`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-md hover:bg-[#EAE5D9] dark:hover:bg-[#252421] text-[#77736B] hover:text-[#F05A3C] transition-colors"
                        title="Download Image"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(img.id, e)}
                        className="p-1 rounded-md hover:bg-[#F05A3C]/10 text-[#77736B] hover:text-[#F05A3C] transition-colors"
                        title="Delete from Account"
                      >
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

      {/* Fullscreen Lightbox Modal on Touch / Click */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-[#0B0F1F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 truncate max-w-md">{previewImage.prompt}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60">
              <img
                src={previewImage.url}
                alt={previewImage.prompt}
                className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>{previewImage.style} • {previewImage.aspectRatio}</span>
              <div className="flex items-center space-x-2">
                <a
                  href={previewImage.url}
                  download={`supermind-${previewImage.id}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Full Resolution</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
