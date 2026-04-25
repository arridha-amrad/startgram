import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  aspectRatio: string;
  url: Array<string>;
  children: React.ReactNode;
  isLocked?: boolean;
  isDragEnabled?: boolean;
};

export default function EmblaProvider({
  aspectRatio,
  url,
  children,
  isLocked = false,
  isDragEnabled = true,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: true,
  });

  const [scrollSnaps, setScrollSnaps] = useState<Array<number>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  // Gunakan reInit untuk merubah opsi secara dinamis
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ watchDrag: !isLocked && isDragEnabled });
    }
  }, [emblaApi, isLocked, isDragEnabled]);

  useEffect(() => {
    if (!emblaApi) return;

    const t = setTimeout(() => {
      onInit(emblaApi);
      onSelect(emblaApi);
    }, 0);

    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);

    return () => {
      clearTimeout(t);
      emblaApi
        .off("reInit", onInit)
        .off("reInit", onSelect)
        .off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="group relative w-full">
      <div
        style={{ aspectRatio }}
        className={cn("overflow-hidden")}
        ref={emblaRef}
      >
        {children}
      </div>

      {!isLocked && url.length > 1 && (
        <>
          <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 transition-opacity duration-150 ease-in group-hover:opacity-100">
            <Button
              onClick={() => emblaApi?.scrollPrev()}
              variant="secondary"
              size="icon"
            >
              <ChevronLeft />
            </Button>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 transition-opacity duration-150 ease-in group-hover:opacity-100">
            <Button
              onClick={() => emblaApi?.scrollNext()}
              variant="secondary"
              size="icon"
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1">
            {scrollSnaps.map((_, i) => (
              <div
                key={i}
                className={`${
                  i === selectedIndex ? "bg-foreground" : "bg-foreground/50"
                } size-2 rounded-full`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
