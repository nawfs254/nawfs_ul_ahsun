"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  ExternalLink,
  Link2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  required?: boolean;
  aspectRatioHint?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "projects",
  label = "Image",
  required = false,
  aspectRatioHint = "16:9 or standard screenshot",
  placeholder = "Upload an image or paste URL",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP, SVG, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setImgError(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
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

  const handleClear = () => {
    onChange("");
    setImgError(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2">
      {/* Header & Label */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-muted-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Link2 size={12} />
          {showManualInput ? "Hide manual URL" : "Enter URL manually"}
        </button>
      </div>

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setImgError(false);
            }}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-blue-500 font-mono"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-muted rounded-xl transition-colors cursor-pointer"
              title="Clear input"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Image Preview Card */
        <div className="relative group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-blue-500/40 transition-all">
          <div className="relative h-44 sm:h-52 w-full bg-slate-950/40 flex items-center justify-center overflow-hidden">
            {!imgError ? (
              <img
                src={value}
                alt={label}
                className="h-full w-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-102"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <AlertCircle size={32} className="text-amber-500 mb-2" />
                <span className="text-xs font-semibold text-foreground">
                  Could not load preview
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate">
                  {value}
                </span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <RefreshCw size={12} className={isUploading ? "animate-spin" : ""} />
                Replace Image
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-white text-xs font-medium border border-white/20 shadow-md transition-all"
                title="Open original"
              >
                <ExternalLink size={12} />
                View
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                title="Remove image"
              >
                <X size={12} />
                Remove
              </button>
            </div>

            {/* Loading Indicator */}
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
                <span className="text-xs font-semibold text-foreground">
                  Uploading image...
                </span>
              </div>
            )}
          </div>

          {/* Footer with Path info */}
          <div className="px-3.5 py-2 border-t border-border/60 bg-muted/20 flex items-center justify-between text-[11px]">
            <span className="font-mono text-muted-foreground truncate max-w-[80%]" title={value}>
              {value}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold shrink-0">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
              : "border-border/80 hover:border-blue-500/50 hover:bg-muted/30 bg-muted/10"
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
              <p className="text-xs font-semibold text-foreground">
                Uploading to server...
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Optimizing and saving file...
              </p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 shadow-xs">
                <UploadCloud size={24} />
              </div>
              <p className="text-xs font-semibold text-foreground">
                <span className="text-blue-500 hover:underline">Click to browse</span> or drag and drop image
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                PNG, JPG, WebP, SVG, GIF up to 10MB ({aspectRatioHint})
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
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
