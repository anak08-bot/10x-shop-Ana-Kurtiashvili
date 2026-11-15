import { useState } from "react";
import { cn } from "../../utils/cn";
import { GiltFrame } from "../ui/GiltFrame";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];
  return (
    <div>
      <GiltFrame still className="p-4">
        <div className="painting aspect-square">
          <img src={current} alt={title} width={600} height={600} className="relative size-full object-contain p-6 mix-blend-multiply drop-shadow-[0_8px_8px_rgba(60,30,0,0.25)]" />
        </div>
      </GiltFrame>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Product photos">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-pressed={i === selected}
                className={cn(
                  "size-16 overflow-hidden rounded-sm border-2 bg-tile transition-colors hover:border-gold-500",
                  i === selected ? "border-gold-500 shadow-[0_0_0_2px_var(--color-crimson-700)]" : "border-gold-700/30",
                )}
              >
                <img src={src} alt="" width={64} height={64} loading="lazy" className="size-full object-contain mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
