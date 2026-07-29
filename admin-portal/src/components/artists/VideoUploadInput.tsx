"use client";

import { useState, useRef } from 'react';
import { Upload, Loader2, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function VideoUploadInput({ value, onChange, placeholder }: VideoUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Invalid Format",
        description: "Please select a video file.",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `File exceeds the 100MB limit.`,
      });
      return;
    }

    setUploading(true);
    try {
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      });
      const urlResult = await urlRes.json();
      if (!urlRes.ok) throw new Error(urlResult.error || 'Failed to get upload URL');

      const { signedUrl, url } = urlResult;
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      onChange(url);
      toast({
        title: "Success",
        description: "Video uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative flex-1 group/input flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-12 rounded-l-xl bg-slate-50/50 border-r border-slate-100 flex items-center justify-center text-slate-300 group-focus-within/input:text-orange-500 transition-all">
        <PlayCircle size={14} />
      </div>
      <Input
        placeholder={placeholder}
        className="h-11 pl-16 pr-12 rounded-xl border-slate-100 bg-slate-50/30 font-medium focus:bg-white focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all text-[11px] shadow-inner"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={uploading}
      />
      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors disabled:opacity-50"
        title="Upload Video"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
      </button>
    </div>
  );
}
