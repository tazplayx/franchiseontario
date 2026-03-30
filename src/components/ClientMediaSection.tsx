'use client'
/**
 * ClientMediaSection
 *
 * Renders the Photos & Videos section on the public franchise detail page.
 * Reads localStorage overrides on mount so admin-uploaded media appears
 * immediately without requiring a redeploy.
 */
import { useEffect, useState } from 'react'
import { Video, ImageIcon } from 'lucide-react'
import { getListingOverrides } from '@/lib/store'

interface Props {
  id: string
  seedImages?: string[]
  seedVideoUrl?: string
  logoBg: string
}

/** Convert a YouTube or Vimeo watch URL into an embeddable iframe src. */
function toEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

export default function ClientMediaSection({ id, seedImages, seedVideoUrl, logoBg }: Props) {
  const [images, setImages] = useState<string[]>(seedImages ?? [])
  const [videoUrl, setVideoUrl] = useState<string | undefined>(seedVideoUrl)

  useEffect(() => {
    const overrides = getListingOverrides()
    const override = overrides[id]
    if (override) {
      if ('mediaImages' in override && Array.isArray(override.mediaImages)) {
        setImages(override.mediaImages as string[])
      }
      if ('videoUrl' in override) {
        setVideoUrl((override.videoUrl as string) || undefined)
      }
    }
  }, [id])

  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : null
  const hasMedia = images.length > 0 || !!videoUrl

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-7">
      <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-amber-500 inline-block" />
        Photos &amp; Videos
      </h2>

      {!hasMedia && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
          <ImageIcon size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No media uploaded yet</p>
          <p className="text-xs mt-1">The franchise owner can add photos and a video via their dashboard.</p>
        </div>
      )}

      {/* Video embed */}
      {embedUrl && (
        <div className="rounded-xl overflow-hidden aspect-video mb-4 bg-gray-900">
          <iframe
            src={embedUrl}
            title="Franchise video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {/* Video URL (non-embeddable) — link out */}
      {videoUrl && !embedUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-4 text-sm text-blue-600 hover:underline"
        >
          <Video size={15} /> Watch brand video →
        </a>
      )}

      {/* Photo grid */}
      {images.length > 0 && (
        <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((src, i) => (
            <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img
                src={src}
                alt={`Gallery photo ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {hasMedia && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Photos and videos are uploaded and managed by the franchise owner.
        </p>
      )}
    </section>
  )
}
