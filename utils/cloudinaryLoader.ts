import type { ImageLoaderProps } from 'next/image'

// Cloudinary resizes and picks the format itself, so Vercel's image optimizer (a capped quota on the free plan) isn't
// needed. Local images, just the cover photo, are small enough to serve as they are; the width only quiets Next's warning.
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith('https://res.cloudinary.com/')) return `${src}?w=${width}`
  return src.replace(/\/image\/upload\/(?:(?:c|w|h|q|f)_[^/]*\/)?/, `/image/upload/f_auto,q_${quality || 'auto'},c_limit,w_${width}/`)
}
