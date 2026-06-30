"use client";

import { ITEM_SPECS } from "@/lib/altarConfig";
import { useEditor } from "@/lib/store";

/** Thư viện vật phẩm — bấm để thêm vào giữa bàn thờ. */
export function ItemLibrary() {
  const addItem = useEditor((s) => s.addItem);

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">
        Vật phẩm thờ cúng
      </h2>
      <p className="mb-3 text-xs text-foreground/50">
        Bấm để thêm, rồi kéo–thả để sắp xếp.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ITEM_SPECS.map((spec) => (
          <button
            key={spec.type}
            onClick={() => addItem(spec.type)}
            title={spec.meaning}
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white/60 p-3 text-center transition-colors hover:border-primary hover:bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spec.variants[0].src}
              alt={spec.name}
              className="h-12 w-12 object-contain"
            />
            {spec.variants.length > 1 && (
              <span className="text-[10px] text-foreground/40">
                {spec.variants.length} mẫu
              </span>
            )}
            <span className="text-xs font-medium text-foreground/80">
              {spec.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
