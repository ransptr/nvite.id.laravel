import {useEffect, useRef, useState} from 'react';
import {Film, ImageIcon, LoaderCircle, Music4, Upload, X} from 'lucide-react';
import {cn} from '@/lib/utils';

type Props = {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  accept?: string;
  kind?: 'image' | 'video' | 'audio';
};

export function PhotoUpload({
  currentUrl,
  onUploaded,
  label = 'Upload photo',
  accept = 'image/*',
  kind = 'image',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [dragging, setDragging] = useState(false);

  const compressImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return file;

    const imageBitmap = await createImageBitmap(file);
    const MAX_SIDE = 1920;
    const scale = Math.min(1, MAX_SIDE / Math.max(imageBitmap.width, imageBitmap.height));
    const width = Math.max(1, Math.round(imageBitmap.width * scale));
    const height = Math.max(1, Math.round(imageBitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(imageBitmap, 0, 0, width, height);
    imageBitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', 0.82);
    });

    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^/.]+$/, '') || 'upload'}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  };

  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    const uploadFile = kind === 'image' ? await compressImage(file) : file;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('kind', kind);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Upload failed');
      }

      const data = await response.json();
      const url = data.url;
      setPreview(url);
      onUploaded(url);
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className="space-y-2">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">{label}</span>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-[#e8ddd4]">
          {kind === 'image' ? (
            <img src={preview} alt="preview" className="h-40 w-full object-cover" />
          ) : kind === 'video' ? (
            <video src={preview} className="h-40 w-full bg-black object-cover" controls playsInline preload="metadata" />
          ) : (
            <div className="flex h-24 items-center justify-center bg-[#fdfaf6] px-4 py-3">
              <audio src={preview} className="w-full" controls preload="metadata" />
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onUploaded('');
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {e.preventDefault(); setDragging(true);}}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={cn(
            'flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition',
            dragging
              ? 'border-[#c9974a] bg-[#fdf5eb]'
              : 'border-[#e8ddd4] bg-[#fdfaf6] hover:border-[#c9974a]/60',
          )}
        >
          {uploading ? (
            <LoaderCircle className="h-5 w-5 animate-spin text-[#c9974a]" />
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4ede3]">
                {dragging ? (
                  <Upload className="h-4 w-4 text-[#c9974a]" />
                ) : kind === 'video' ? (
                  <Film className="h-4 w-4 text-[#c9974a]" />
                ) : kind === 'audio' ? (
                  <Music4 className="h-4 w-4 text-[#c9974a]" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-[#c9974a]" />
                )}
              </div>
              <span className="text-xs text-[#8a7a6e]">
                {dragging ? 'Drop to upload' : 'Click or drag to upload'}
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
