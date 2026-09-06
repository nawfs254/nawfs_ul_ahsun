"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Link2,
  AlertCircle,
  Images,
  Trash2,
} from "lucide-react";

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  label?: string;
}

export default function GalleryUpload({
  images = [],
  onChange,
  folder = "projects",
  label = "Gallery Screenshots",
}: GalleryUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [showManualAdd, setShowManualAdd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      setErrorMessage("No valid image files found to upload.");
      return;
    }

    // Check sizes
    const oversized = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      setErrorMessage(`Some files (${oversized.map((f) => f.name).join(", ")}) exceed 10MB limit.`);
      return;
    }

    setIsUploading(true);
    setUploadCount(fileArray.length);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("folder", folder);
      for (const file of fileArray) {
        formData.append("files", file);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      const newUrls: string[] = data.urls || (data.url ? [data.url] : []);
      onChange([...images, ...newUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload gallery images");
    } finally {
      setIsUploading(false);
      setUploadCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualUrl.trim();
    if (!trimmed) return;

    // Support comma-separated URLs as well
    const urls = trimmed
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    onChange([...images, ...urls]);
    setManualUrl("");
    setShowManualAdd(false);
  };

  const handleClearAll = () => {
    if (images.length === 0) return;
    if (confirm("Are you sure you want to remove all gallery screenshots?")) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold text-muted-foreground">
            {label}
          </label>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {images.length} {images.length === 1 ? "screenshot" : "screenshots"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowManualAdd(!showManualAdd)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Link2 size={12} />
            {showManualAdd ? "Hide URL input" : "Add by URL"}
          </button>

          {images.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-medium text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Manual URL addition box */}
      {showManualAdd && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/20 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste URL or comma-separated URLs (e.g. /projects/erp/1.png, /projects/erp/2.png)"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-mono"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddManualUrl(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Gallery Screenshots Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((imgUrl, idx) => (
            <div
              key={`${imgUrl}-${idx}`}
              className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-blue-500/50 transition-all flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative h-28 w-full bg-slate-950/40 overflow-hidden flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt={`Screenshot ${idx + 1}`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Show broken placeholder
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />

                {/* Index badge */}
                <div className="absolute top-1.5 left-1.5 rounded-md bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-xs">
                  #{idx + 1}
                </div>

                {/* Overlay with reorder & view controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <div className="flex justify-end gap-1">
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded bg-slate-800/90 text-white hover:bg-slate-700"
                      title="Open full image"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded bg-red-600/90 text-white hover:bg-red-600 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, "left")}
                      className="p-1 rounded bg-white/90 text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move earlier"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <span className="text-[10px] font-semibold text-white/90">
                      Slide {idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, "right")}
                      className="p-1 rounded bg-white/90 text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move later"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* URL Caption */}
              <div className="px-2 py-1 bg-muted/20 border-t border-border/50 text-[10px] font-mono text-muted-foreground truncate" title={imgUrl}>
                {imgUrl.split("/").pop()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-file Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : "border-border/80 hover:border-blue-500/50 hover:bg-muted/30 bg-muted/10"
        }`}
      >
        {isUploading ? (
          <div className="py-2 flex flex-col items-center justify-center">
            <Loader2 size={24} className="animate-spin text-blue-500 mb-1.5" />
            <p className="text-xs font-semibold text-foreground">
              Uploading {uploadCount} {uploadCount === 1 ? "screenshot" : "screenshots"}...
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Writing to server storage...
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-xs shrink-0">
              <Images size={20} />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-foreground">
                <span className="text-blue-500 hover:underline">Click to upload screenshots</span> or drag multiple images here
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PNG, JPG, WebP up to 10MB each. Select multiple files at once for gallery carousel.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Multi-file Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
