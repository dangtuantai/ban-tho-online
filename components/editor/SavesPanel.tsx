"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "@/lib/store";
import {
  listDesigns,
  saveDesign,
  deleteDesign,
  type SavedDesign,
} from "@/lib/storage";
import type { AltarDesign } from "@/lib/types";

type Props = { open: boolean; onClose: () => void };

export function SavesPanel({ open, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const toDesign = useEditor((s) => s.toDesign);
  const loadDesign = useEditor((s) => s.loadDesign);
  const setSaved = useEditor((s) => s.setSaved);
  const savedId = useEditor((s) => s.savedId);
  const savedName = useEditor((s) => s.savedName);

  const [name, setName] = useState("");
  const [list, setList] = useState<SavedDesign[]>([]);
  const [msg, setMsg] = useState("");

  const refresh = () => listDesigns().then(setList);

  useEffect(() => {
    if (open) {
      setName(savedName || "");
      refresh();
    }
  }, [open, savedName]);

  if (!open) return null;

  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(""), 2000);
  };

  const handleSave = async (asNew: boolean) => {
    const rec = await saveDesign(
      name || "Bàn thờ của tôi",
      toDesign(),
      asNew ? undefined : savedId ?? undefined,
    );
    setSaved(rec.id, rec.name);
    flash("Đã lưu vào máy của bạn ✓");
    refresh();
  };

  const handleLoad = (rec: SavedDesign) => {
    loadDesign(rec.design);
    setSaved(rec.id, rec.name);
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá bản lưu này?")) return;
    await deleteDesign(id);
    if (savedId === id) setSaved(null, "");
    refresh();
  };

  const handleExportFile = () => {
    const data = JSON.stringify(toDesign(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || "ban-tho").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(String(reader.result)) as AltarDesign;
        loadDesign(d);
        setSaved(null, file.name.replace(/\.json$/i, ""));
        flash("Đã nạp từ file ✓");
        onClose();
      } catch {
        flash("File không hợp lệ ✗");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-xl bg-background p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-primary">
            Bàn thờ của tôi
          </h2>
          <button onClick={onClose} className="text-xl text-foreground/50 hover:text-foreground">
            ✕
          </button>
        </div>

        <p className="mb-3 text-xs text-foreground/60">
          Mọi thứ được lưu ngay trên máy của bạn (không gửi lên server).
        </p>

        {/* Lưu bản hiện tại */}
        <div className="rounded-lg border border-border bg-white/60 p-3">
          <label className="block text-xs text-foreground/60">Tên bàn thờ</label>
          <input
            type="text"
            value={name}
            placeholder="VD: Bàn thờ gia tiên"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-white px-2 py-1.5 text-sm"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => handleSave(false)}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              💾 {savedId ? "Cập nhật bản này" : "Lưu vào máy"}
            </button>
            {savedId && (
              <button
                onClick={() => handleSave(true)}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted"
              >
                ➕ Lưu thành bản mới
              </button>
            )}
            <button
              onClick={handleExportFile}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted"
            >
              ⬇ Tải file sao lưu
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted"
            >
              ⬆ Nạp từ file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
          {msg && <p className="mt-2 text-sm font-medium text-green-700">{msg}</p>}
        </div>

        {/* Danh sách bản đã lưu */}
        <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Các bản đã lưu ({list.length})
        </h3>
        {list.length === 0 ? (
          <p className="text-sm text-foreground/50">Chưa có bản lưu nào.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((rec) => (
              <li
                key={rec.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  savedId === rec.id ? "border-primary bg-muted" : "border-border bg-white/60"
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{rec.name}</div>
                  <div className="text-xs text-foreground/50">
                    {rec.design.items?.length ?? 0} vật phẩm
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleLoad(rec)}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Mở
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100"
                  >
                    Xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
