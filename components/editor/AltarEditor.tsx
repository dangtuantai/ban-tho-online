"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from "react-konva";
import type Konva from "konva";
import { useEditor } from "@/lib/store";
import { getDraft, saveDraft } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { STAGE_WIDTH, STAGE_HEIGHT, type AltarDesign } from "@/lib/types";
import { BACKGROUNDS } from "@/lib/altarConfig";
import { CanvasItem } from "./CanvasItem";
import { useImage } from "./useImage";
import { ItemLibrary } from "./ItemLibrary";
import { PhotoFrame } from "./PhotoFrame";
import { FengShuiHints } from "./FengShuiHints";
import { Toolbar } from "./Toolbar";
import { SavesPanel } from "./SavesPanel";

function encodeDesign(d: AltarDesign): string {
  // Bỏ ảnh (dataURL) khi chia sẻ qua URL để link không quá dài.
  const slim: AltarDesign = {
    ...d,
    items: d.items.map((it) => {
      const copy = { ...it };
      delete copy.photo;
      return copy;
    }),
  };
  const json = JSON.stringify(slim);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function decodeDesign(s: string): AltarDesign | null {
  try {
    const bin = atob(s);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as AltarDesign;
  } catch {
    return null;
  }
}

export default function AltarEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [scale, setScale] = useState(1);
  const [isFs, setIsFs] = useState(false);
  const [showSaves, setShowSaves] = useState(false);

  const items = useEditor((s) => s.items);
  const background = useEditor((s) => s.background);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const updateItem = useEditor((s) => s.updateItem);
  const removeItem = useEditor((s) => s.removeItem);
  const loadDesign = useEditor((s) => s.loadDesign);
  const applyDefaultLayout = useEditor((s) => s.applyDefaultLayout);
  const toDesign = useEditor((s) => s.toDesign);

  // Nạp thiết kế ban đầu: ưu tiên URL (?d=), rồi bản nháp đã lưu, rồi mẫu gợi ý.
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("d");
      if (shared) {
        const d = decodeDesign(shared);
        if (d) {
          loadDesign(d);
          return;
        }
      }
      const draft = await getDraft();
      if (draft && draft.items && draft.items.length) loadDesign(draft);
      else applyDefaultLayout();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tự động lưu bản nháp vào máy người dùng (IndexedDB), có debounce.
  useEffect(() => {
    let timer: number;
    const unsub = useEditor.subscribe(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        saveDraft(useEditor.getState().toDesign());
      }, 600);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, []);

  // Theo dõi trạng thái toàn màn hình.
  useEffect(() => {
    const onFsChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Responsive: scale stage theo container, hoặc theo màn hình khi fullscreen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      if (document.fullscreenElement) {
        setScale(
          Math.min(
            window.innerWidth / STAGE_WIDTH,
            window.innerHeight / STAGE_HEIGHT,
          ),
        );
      } else {
        setScale(Math.min(1, el.clientWidth / STAGE_WIDTH));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isFs]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Gắn Transformer vào vật phẩm đang chọn.
  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (!selectedId) {
      tr.nodes([]);
      return;
    }
    const node = stage.findOne<Konva.Node>(`#${selectedId}`);
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, items]);

  // Xoá bằng phím Delete/Backspace.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        removeItem(selectedId);
      }
      if (e.key === "Escape" && selectedId) {
        select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, removeItem, select]);

  const bg = BACKGROUNDS.find((b) => b.id === background) ?? BACKGROUNDS[0];
  const bgImage = useImage(bg.src);

  const handleExportPng = () => {
    select(null);
    requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const uri = stage.toDataURL({ pixelRatio: 2 / scale });
      const link = document.createElement("a");
      link.download = "ban-tho-cua-toi.png";
      link.href = uri;
      link.click();
      track("tai_png");
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?d=${encodeDesign(
      toDesign(),
    )}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Sao chép liên kết chia sẻ:", url);
    }
    track("chia_se");
  };

  return (
    <div className="space-y-3">
      <Toolbar
        onExportPng={handleExportPng}
        onShare={handleShare}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFs}
        onOpenSaves={() => setShowSaves(true)}
      />

      <SavesPanel open={showSaves} onClose={() => setShowSaves(false)} />

      <div className="grid gap-3 lg:grid-cols-[220px_1fr_280px]">
        {/* Thư viện vật phẩm */}
        <aside className="order-2 rounded-lg border border-border bg-white/40 p-3 lg:order-1">
          <ItemLibrary />
        </aside>

        {/* Canvas bàn thờ */}
        <div
          ref={containerRef}
          className={`order-1 overflow-hidden rounded-lg border border-border shadow-inner lg:order-2 ${
            isFs ? "flex h-screen w-screen items-center justify-center bg-[#2a0c06]" : ""
          }`}
        >
          <Stage
            ref={stageRef}
            width={STAGE_WIDTH * scale}
            height={STAGE_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) select(null);
            }}
            onTouchStart={(e) => {
              if (e.target === e.target.getStage()) select(null);
            }}
          >
            <Layer>
              {/* nền bàn thờ: gradient dự phòng (vẽ cả lúc ảnh nền đang tải) */}
              <Rect
                x={0}
                y={0}
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: STAGE_HEIGHT }}
                fillLinearGradientColorStops={[0, bg.color1, 1, bg.color2]}
              />
              {bg.src && bgImage ? (
                // Ảnh nền toàn cảnh (đã vẽ sẵn kệ gỗ)
                <KonvaImage
                  image={bgImage}
                  x={0}
                  y={0}
                  width={STAGE_WIDTH}
                  height={STAGE_HEIGHT}
                />
              ) : (
                // Nền trơn: vẽ mặt bàn tối
                <Rect
                  x={0}
                  y={STAGE_HEIGHT - 120}
                  width={STAGE_WIDTH}
                  height={120}
                  fill="rgba(0,0,0,0.18)"
                />
              )}
            </Layer>
            <Layer>
              {items.map((item) => (
                <CanvasItem
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => select(item.id)}
                  onChange={(patch, record) => updateItem(item.id, patch, record)}
                />
              ))}
              <Transformer
                ref={trRef}
                rotateEnabled
                keepRatio
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                ]}
                boundBoxFunc={(oldBox, newBox) =>
                  newBox.width < 24 || newBox.height < 24 ? oldBox : newBox
                }
              />
            </Layer>
          </Stage>
        </div>

        {/* Thuộc tính + gợi ý */}
        <aside className="order-3 space-y-4 rounded-lg border border-border bg-white/40 p-3">
          <PhotoFrame />
          <FengShuiHints />
        </aside>
      </div>
    </div>
  );
}
