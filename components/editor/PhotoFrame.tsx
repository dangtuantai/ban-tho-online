"use client";

import { useRef } from "react";
import { useEditor } from "@/lib/store";
import { ITEM_SPEC_MAP } from "@/lib/altarConfig";

/** Bảng thuộc tính của vật phẩm đang chọn (gồm tải ảnh cho ảnh thờ). */
export function PhotoFrame() {
  const fileRef = useRef<HTMLInputElement>(null);
  const items = useEditor((s) => s.items);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const updateItem = useEditor((s) => s.updateItem);
  const removeItem = useEditor((s) => s.removeItem);
  const bringForward = useEditor((s) => s.bringForward);
  const sendBackward = useEditor((s) => s.sendBackward);

  const selected = items.find((i) => i.id === selectedId);

  if (!selected) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white/40 p-4 text-center text-xs text-foreground/50">
        Chọn một vật phẩm trên bàn thờ để chỉnh sửa.
      </div>
    );
  }

  const spec = ITEM_SPEC_MAP[selected.type];
  const currentSrc = selected.src ?? spec.variants[0].src;

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateItem(selected.id, { photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-white/60 p-4">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentSrc} alt={spec.name} className="h-8 w-8 object-contain" />
        <span className="text-sm font-semibold">{spec.name}</span>
        <button
          onClick={() => select(null)}
          className="ml-auto rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
        >
          ✓ Xong
        </button>
      </div>

      {/* Bộ chọn mẫu (biến thể) */}
      {spec.variants.length > 1 && (
        <div>
          <label className="block text-xs text-foreground/60">Chọn mẫu</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {spec.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => updateItem(selected.id, { src: v.src })}
                title={v.name}
                className={`flex flex-col items-center gap-1 rounded-md border p-2 ${
                  currentSrc === v.src
                    ? "border-primary bg-muted"
                    : "border-border bg-white"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.src} alt={v.name} className="h-9 w-9 object-contain" />
                <span className="text-[10px] leading-tight text-foreground/70">
                  {v.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.type === "nhang" && (
        <div className="space-y-2 rounded-md border border-border bg-white/70 p-2">
          <span className="text-xs font-semibold text-foreground/70">
            Thời gian cháy
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                [30, "30 giây"],
                [60, "1 phút"],
                [180, "3 phút"],
                [300, "5 phút"],
                [600, "10 phút"],
                [1800, "30 phút"],
              ] as const
            ).map(([sec, label]) => (
              <button
                key={sec}
                onClick={() =>
                  updateItem(selected.id, { burnSeconds: sec, litAt: Date.now() })
                }
                className={`rounded-md border px-2 py-1.5 text-xs ${
                  (selected.burnSeconds ?? 180) === sec
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Nhập số phút tuỳ ý */}
          <label className="block text-xs text-foreground/60">
            Hoặc nhập số phút
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0.1}
              step={0.5}
              value={Number(((selected.burnSeconds ?? 180) / 60).toFixed(2))}
              onChange={(e) => {
                const mins = parseFloat(e.target.value);
                if (!isNaN(mins) && mins > 0) {
                  updateItem(selected.id, {
                    burnSeconds: Math.round(mins * 60),
                    litAt: Date.now(),
                  });
                }
              }}
              className="w-24 rounded-md border border-border bg-white px-2 py-1.5 text-sm"
            />
            <span className="text-sm text-foreground/60">phút</span>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.autoRelight ?? false}
              onChange={(e) =>
                updateItem(selected.id, {
                  autoRelight: e.target.checked,
                  // Bật khi nhang đã tàn -> thắp lại ngay
                  ...(e.target.checked && !selected.litAt
                    ? { litAt: Date.now() }
                    : {}),
                })
              }
              className="h-4 w-4 accent-primary"
            />
            <span>🔁 Tự động thắp lại khi cháy hết</span>
          </label>

          <button
            onClick={() => updateItem(selected.id, { litAt: Date.now() })}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            🔥 Thắp lại
          </button>
          <p className="text-[11px] text-foreground/50">
            Nhang cháy dần, toả khói. Hết giờ sẽ tự thắp lại (nếu bật) hoặc tàn,
            bát hương vẫn ở lại.
          </p>
        </div>
      )}

      {selected.type === "anh_tho" && (
        <div className="space-y-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {selected.photo ? "Đổi ảnh người thân" : "📷 Tải ảnh người thân"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickPhoto}
          />
          <label className="block text-xs text-foreground/60">Họ tên</label>
          <input
            type="text"
            value={selected.name ?? ""}
            placeholder="VD: Cụ Nguyễn Văn A"
            onChange={(e) => updateItem(selected.id, { name: e.target.value }, false)}
            className="w-full rounded-md border border-border bg-white px-2 py-1.5 text-sm"
          />
          <label className="block text-xs text-foreground/60">Năm sinh – năm mất</label>
          <input
            type="text"
            value={selected.dates ?? ""}
            placeholder="VD: 1940 – 2020"
            onChange={(e) => updateItem(selected.id, { dates: e.target.value }, false)}
            className="w-full rounded-md border border-border bg-white px-2 py-1.5 text-sm"
          />
          <label className="block text-xs text-foreground/60">Giới tính (cho gợi ý Nam tả – Nữ hữu)</label>
          <div className="flex gap-2">
            {(["nam", "nu"] as const).map((g) => (
              <button
                key={g}
                onClick={() => updateItem(selected.id, { gender: g })}
                className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                  selected.gender === g
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white"
                }`}
              >
                {g === "nam" ? "Nam" : "Nữ"}
              </button>
            ))}
          </div>

          {/* Chỉnh ảnh trong khung */}
          {selected.photo && (
            <div className="space-y-2 rounded-md border border-border bg-white/70 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/70">
                  Chỉnh ảnh trong khung
                </span>
                <button
                  onClick={() =>
                    updateItem(selected.id, {
                      photoZoom: 1,
                      photoOffsetX: 0,
                      photoOffsetY: 0,
                    })
                  }
                  className="text-[11px] text-primary hover:underline"
                >
                  Đặt lại
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["cover", "Lấp đầy khung"],
                    ["contain", "Hiện toàn ảnh"],
                  ] as const
                ).map(([f, label]) => (
                  <button
                    key={f}
                    onClick={() => updateItem(selected.id, { photoFit: f })}
                    className={`rounded-md border px-2 py-1.5 text-xs ${
                      (selected.photoFit ?? "cover") === f
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label className="block text-xs text-foreground/60">
                Phóng to ảnh
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.02}
                value={selected.photoZoom ?? 1}
                onChange={(e) =>
                  updateItem(selected.id, { photoZoom: Number(e.target.value) }, false)
                }
                className="w-full"
              />

              <label className="block text-xs text-foreground/60">Dịch ngang</label>
              <input
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={selected.photoOffsetX ?? 0}
                onChange={(e) =>
                  updateItem(selected.id, { photoOffsetX: Number(e.target.value) }, false)
                }
                className="w-full"
              />

              <label className="block text-xs text-foreground/60">Dịch dọc</label>
              <input
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={selected.photoOffsetY ?? 0}
                onChange={(e) =>
                  updateItem(selected.id, { photoOffsetY: Number(e.target.value) }, false)
                }
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-xs text-foreground/60">Kích thước</label>
        <input
          type="range"
          min={0.4}
          max={2.5}
          step={0.05}
          value={selected.scale}
          onChange={(e) => updateItem(selected.id, { scale: Number(e.target.value) }, false)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => bringForward(selected.id)}
          className="rounded-md border border-border bg-white px-2 py-1.5 text-xs hover:bg-muted"
        >
          ⬆ Lên lớp trên
        </button>
        <button
          onClick={() => sendBackward(selected.id)}
          className="rounded-md border border-border bg-white px-2 py-1.5 text-xs hover:bg-muted"
        >
          ⬇ Xuống lớp dưới
        </button>
      </div>

      <button
        onClick={() => removeItem(selected.id)}
        className="w-full rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        🗑️ Xoá vật phẩm
      </button>
    </div>
  );
}
