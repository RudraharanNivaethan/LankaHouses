import { useState } from 'react'

interface GalleryImage {
  url: string
  alt?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        No images available
      </div>
    )
  }

  const active = images[activeIndex]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={active.url}
          alt={active.alt ?? `Image ${activeIndex + 1}`}
          className="h-64 w-full object-cover sm:h-80"
          loading="lazy"
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === activeIndex
                  ? 'border-brand ring-2 ring-brand/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt ?? `Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
