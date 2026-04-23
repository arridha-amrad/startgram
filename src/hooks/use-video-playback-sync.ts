import { useEffect } from "react"

export function useVideoPlaybackSync(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isManuallyPaused: boolean,
  setIsPlaying: (playing: boolean) => void
) {
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const checkPlayback = (isFullyVisible: boolean) => {
      const isTabActive = !document.hidden
      const shouldPlay = isFullyVisible && isTabActive && !isManuallyPaused

      if (shouldPlay) {
        if (video.paused) {
          video.play().catch(() => setIsPlaying(false))
          setIsPlaying(true)
        }
      } else {
        if (!video.paused) {
          video.pause()
          setIsPlaying(false)
        }
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        checkPlayback(entry.isIntersecting && entry.intersectionRatio >= 0.6)
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        rootMargin: "0px",
      }
    )

    const handleVisibility = () => {
      const rect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      if (rect.height === 0) return

      const visibleHeight =
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
      const visibleRatio = visibleHeight / rect.height
      checkPlayback(visibleRatio >= 0.6)
    }

    let lastDialogOpen = !!document.querySelector('[role="dialog"]')
    const modalObserver = new MutationObserver(() => {
      const isDialogOpen = !!document.querySelector('[role="dialog"]')
      if (isDialogOpen === lastDialogOpen) return
      lastDialogOpen = isDialogOpen

      if (isDialogOpen) {
        if (!video.paused) {
          video.pause()
          setIsPlaying(false)
        }
      } else {
        handleVisibility()
      }
    })

    io.observe(container)
    document.addEventListener("visibilitychange", handleVisibility)

    modalObserver.observe(document.body, { childList: true, subtree: true })

    // Initial check
    handleVisibility()

    return () => {
      io.disconnect()
      modalObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [isManuallyPaused, videoRef, containerRef, setIsPlaying])
}
