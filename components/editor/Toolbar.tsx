"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store";
import { BACKGROUNDS } from "@/lib/altarConfig";

type Props = {
  onExportPng: () => void;
  onShare: () => Promise<void> | void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenSaves: () => void;
};

export function Toolbar({
  onExportPng,
  onShare,
  onToggleFullscreen,
  isFullscreen,
  onOpenSaves,
}: Props) {
  const [savedMsg, setSavedMsg] = useState("");
  const applyDefaultLayout = useEditor((s) => s.applyDefaultLayout);
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const clearAll = useEditor((s) => s.clearAll);
  const setBackground = useEditor((s) => s.setBackground);
  const background = useEditor((s) => s.background);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);

  const flash = (m: string) => {
    setSavedMsg(m);
    window.setTimeout(() => setSavedMsg(""), 2000);
  };

  const btn =
    "rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-white/70 p-2">
      <button className={btn} onClick={applyDefaultLayout}>
        ✨ Sắp xếp gợi ý
      </button>
      <button className={btn} onClick={undo} disabled={!canUndo}>
        ↩ Hoàn tác
      </button>
      <button className={btn} onClick={redo} disabled={!canRedo}>
        ↪ Làm lại
      </button>
      <button className={btn} onClick={onToggleFullscreen}>
        {isFullscreen ? "✕ Thoát toàn màn hình" : "⛶ Toàn màn hình"}
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      <label className="text-sm text-foreground/60">Nền:</label>
      <select
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        className="rounded-md border border-border bg-white px-2 py-1.5 text-sm"
      >
        {BACKGROUNDS.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <div className="mx-1 h-6 w-px bg-border" />

      <button className={btn} onClick={onOpenSaves}>
        💾 Lưu / Mở
      </button>
      <button className={btn} onClick={onExportPng}>
        ⬇ Tải ảnh PNG
      </button>
      <button
        className={btn}
        onClick={async () => {
          await onShare();
          flash("Đã sao chép liên kết chia sẻ ✓");
        }}
      >
        🔗 Chia sẻ
      </button>
      <button
        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        onClick={() => {
          if (confirm("Xoá toàn bộ vật phẩm trên bàn thờ?")) clearAll();
        }}
      >
        🧹 Làm lại từ đầu
      </button>

      {savedMsg && (
        <span className="ml-auto text-sm font-medium text-green-700">{savedMsg}</span>
      )}
    </div>
  );
}
