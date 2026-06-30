"use client";

import { useEditor } from "@/lib/store";
import { evaluateLayout, type HintStatus } from "@/lib/fengshui";

const STYLE: Record<HintStatus, { icon: string; cls: string }> = {
  good: { icon: "✅", cls: "border-green-200 bg-green-50 text-green-800" },
  warn: { icon: "⚠️", cls: "border-amber-200 bg-amber-50 text-amber-800" },
  tip: { icon: "💡", cls: "border-sky-200 bg-sky-50 text-sky-800" },
};

/** Bảng gợi ý bố cục theo phong tục thờ cúng (cập nhật realtime). */
export function FengShuiHints() {
  const items = useEditor((s) => s.items);
  const hints = evaluateLayout(items);

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">
        Gợi ý bố trí
      </h2>
      {hints.length === 0 ? (
        <p className="text-xs text-foreground/50">
          Thêm vật phẩm để nhận gợi ý bài trí chuẩn phong tục.
        </p>
      ) : (
        <ul className="space-y-2">
          {hints.map((h) => {
            const st = STYLE[h.status];
            return (
              <li
                key={h.id}
                className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${st.cls}`}
              >
                <span aria-hidden>{st.icon}</span>
                <span>{h.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
