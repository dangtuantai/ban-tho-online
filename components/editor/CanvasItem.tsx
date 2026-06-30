"use client";

import { useEffect, useRef, useState } from "react";
import {
  Group,
  Rect,
  Text,
  Image as KonvaImage,
  Path,
  Circle,
  Line,
  Ellipse,
} from "react-konva";
import Konva from "konva";
import { ITEM_SPEC_MAP } from "@/lib/altarConfig";
import type { AltarItem } from "@/lib/types";

/** Ngọn lửa cháy tự động (flicker) cho đèn/nến. */
function Flame({ y }: { y: number }) {
  const ref = useRef<Konva.Group>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = frame.time / 1000;
      const sy = 1 + Math.sin(t * 10) * 0.14 + Math.sin(t * 23) * 0.05;
      const sx = 1 - (sy - 1) * 0.4;
      node.scaleX(sx);
      node.scaleY(sy);
      node.opacity(0.9 + Math.sin(t * 7) * 0.1);
    }, node.getLayer());
    anim.start();
    return () => {
      anim.stop();
    };
  }, []);
  return (
    <Group ref={ref} x={0} y={y} listening={false}>
      <Circle y={-12} radius={13} fill="#ff8a1f" opacity={0.22} />
      <Path data="M0 0 C8 -7 7 -20 0 -27 C-7 -20 -8 -7 0 0 Z" fill="#ff6a00" />
      <Path data="M0 -3 C5 -9 4 -18 0 -23 C-4 -18 -5 -9 0 -3 Z" fill="#ffd23a" />
      <Path data="M0 -6 C3 -10 2 -16 0 -19 C-2 -16 -3 -10 0 -6 Z" fill="#fff3b0" />
    </Group>
  );
}

/**
 * Ba cây nhang cháy theo thời gian: đốm lửa tụt dần, toả khói.
 * Khi cháy hết (hết thời gian) sẽ tự gọi onBurnedOut để biến mất.
 */
function Incense({
  item,
  onBurnedOut,
}: {
  item: AltarItem;
  onBurnedOut: () => void;
}) {
  const lit = Boolean(item.litAt);
  const durMs = (item.burnSeconds ?? 180) * 1000;
  const [, force] = useState(0);
  const cb = useRef(onBurnedOut);
  cb.current = onBurnedOut;

  // Vòng lặp vẽ lại để khói/đốm lửa chuyển động khi đang cháy.
  useEffect(() => {
    if (!lit) return;
    let raf = 0;
    const loop = () => {
      force((n) => (n + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [lit, item.litAt]);

  // Hẹn giờ biến mất khi cháy hết.
  useEffect(() => {
    if (!lit) return;
    const remaining = (item.litAt as number) + durMs - Date.now();
    const t = window.setTimeout(() => cb.current(), Math.max(0, remaining));
    return () => window.clearTimeout(t);
  }, [lit, item.litAt, durMs]);

  // Hình học: 3 cây nhang cắm trong bát hương
  const baseY = 30; // mặt bát (nơi cắm nhang)
  const topY = -52; // đầu nhang khi còn đầy đủ
  const sticks = [
    { bx: -5, tx: -13 },
    { bx: 0, tx: 0 },
    { bx: 5, tx: 13 },
  ];
  const now = Date.now();
  const p = lit ? Math.min(1, (now - (item.litAt as number)) / durMs) : 0;
  const remain = 1 - p; // tỉ lệ còn lại

  // khói bốc lên từ đốm lửa giữa
  const emberCenterY = baseY + (topY - baseY) * remain;
  const smoke = lit
    ? Array.from({ length: 6 }, (_, i) => {
        const phase = ((now / 1000) * 0.45 + i / 6) % 1;
        return {
          x: Math.sin(now / 600 + i) * 6 * phase,
          y: emberCenterY - 6 - phase * 52,
          r: 2 + phase * 8,
          opacity: (1 - phase) * 0.35,
        };
      })
    : [];

  return (
    <Group listening={false}>
      {/* bát hương (thân) */}
      <Path
        data={`M-26 ${baseY} Q0 ${baseY + 40} 26 ${baseY} Z`}
        fill="#c89b2f"
        stroke="#5a3a10"
        strokeWidth={2}
      />
      {/* chữ Thọ giản lược */}
      <Circle y={baseY + 16} radius={7} stroke="#7a5408" strokeWidth={2} />
      {/* các cây nhang (chỉ hiện khi đang cháy; cháy hết thì tan, bát hương ở lại) */}
      {lit &&
        sticks.map((s, i) => {
          const ex = s.bx + (s.tx - s.bx) * remain;
          const ey = baseY + (topY - baseY) * remain;
          return (
            <Group key={i}>
              <Line
                points={[s.bx, baseY, ex, ey]}
                stroke="#6b4a2a"
                strokeWidth={2.4}
                lineCap="round"
              />
              {remain > 0.02 && (
                <Circle
                  x={ex}
                  y={ey}
                  radius={2.8}
                  fill="#ff7a18"
                  shadowColor="#ff7a18"
                  shadowBlur={6}
                />
              )}
            </Group>
          );
        })}
      {/* miệng bát (che chân nhang) */}
      <KonvaRim baseY={baseY} />
      {/* đế bát */}
      <Rect x={-12} y={baseY + 36} width={24} height={7} cornerRadius={2} fill="#a87412" stroke="#5a3a10" strokeWidth={1} />
      {/* khói */}
      {smoke.map((sm, i) => (
        <Circle key={`s${i}`} x={sm.x} y={sm.y} radius={sm.r} fill="#d8d2c4" opacity={sm.opacity} />
      ))}
    </Group>
  );
}

/** Miệng bát hương (ellipse) vẽ đè để che chân nhang. */
function KonvaRim({ baseY }: { baseY: number }) {
  return (
    <>
      <Ellipse y={baseY} radiusX={28} radiusY={7} fill="#f0d069" stroke="#5a3a10" strokeWidth={2} />
      <Ellipse y={baseY} radiusX={21} radiusY={4.5} fill="#a87412" />
    </>
  );
}

/** Nạp ảnh từ dataURL/URL thành HTMLImageElement cho Konva. */
function useImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    const onLoad = () => setImg(image);
    image.addEventListener("load", onLoad);
    return () => image.removeEventListener("load", onLoad);
  }, [src]);
  return img;
}

const FRAME_W = 130;
const FRAME_H = 160;

type Props = {
  item: AltarItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<AltarItem>, record?: boolean) => void;
};

export function CanvasItem({ item, isSelected, onSelect, onChange }: Props) {
  const spec = ITEM_SPEC_MAP[item.type];
  const photo = useImage(item.type === "anh_tho" ? item.photo : undefined);
  const image = useImage(
    item.type === "anh_tho" ? undefined : item.src ?? spec.variants[0].src,
  );

  const commonGroupProps: Partial<Konva.NodeConfig> = {
    id: item.id,
    name: "altar-item",
    x: item.x,
    y: item.y,
    scaleX: item.scale,
    scaleY: item.scale,
    rotation: item.rotation,
    draggable: true,
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Group;
    const scale = node.scaleX();
    onChange({
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scale: Math.max(0.25, scale),
    });
  };

  // Ảnh thờ: ảnh người thân (không viền) + tên / ngày
  if (item.type === "anh_tho") {
    // Ảnh chiếm trọn khung, không viền trang trí
    const innerW = FRAME_W;
    const innerH = FRAME_H;
    const innerX = -FRAME_W / 2;
    const innerY = -FRAME_H / 2;

    // Tính vị trí & kích thước vẽ ảnh theo chế độ fit + zoom + offset
    let drawW = innerW;
    let drawH = innerH;
    let drawX = innerX;
    let drawY = innerY;
    if (photo) {
      const fit = item.photoFit ?? "cover";
      const zoom = item.photoZoom ?? 1;
      const offX = item.photoOffsetX ?? 0;
      const offY = item.photoOffsetY ?? 0;
      const base =
        fit === "contain"
          ? Math.min(innerW / photo.width, innerH / photo.height)
          : Math.max(innerW / photo.width, innerH / photo.height);
      const s = base * zoom;
      drawW = photo.width * s;
      drawH = photo.height * s;
      drawX = innerX + innerW / 2 - drawW / 2 + offX * innerW;
      drawY = innerY + innerH / 2 - drawH / 2 + offY * innerH;
    }

    return (
      <Group
        {...commonGroupProps}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {photo ? (
          // Cắt ảnh theo vùng khung (clip), ảnh có thể zoom/dịch tự do
          <Group clipX={innerX} clipY={innerY} clipWidth={innerW} clipHeight={innerH}>
            <Rect x={innerX} y={innerY} width={innerW} height={innerH} fill="#ece3d2" />
            <KonvaImage image={photo} x={drawX} y={drawY} width={drawW} height={drawH} />
          </Group>
        ) : (
          <>
            <Rect
              x={innerX}
              y={innerY}
              width={innerW}
              height={innerH}
              fill="#ece3d2"
            />
            <Text
              text={"🖼️\nẢnh thờ"}
              x={innerX}
              y={innerY}
              width={innerW}
              height={innerH}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill="#8a7a5c"
            />
          </>
        )}
        {/* dải tên dưới đáy ảnh */}
        <Rect
          x={innerX}
          y={FRAME_H / 2 - 30}
          width={FRAME_W}
          height={30}
          fill="rgba(0,0,0,0.45)"
        />
        <Text
          text={item.name || "Tên người mất"}
          x={-FRAME_W / 2}
          y={FRAME_H / 2 - 27}
          width={FRAME_W}
          align="center"
          fontSize={13}
          fontStyle="bold"
          fill="#ffffff"
        />
        <Text
          text={item.dates || ""}
          x={-FRAME_W / 2}
          y={FRAME_H / 2 - 13}
          width={FRAME_W}
          align="center"
          fontSize={11}
          fill="#f0e0c0"
        />
      </Group>
    );
  }

  // Nhang: 3 cây cháy theo thời gian + khói + tự biến mất
  if (item.type === "nhang") {
    const w = spec.w;
    const h = spec.h;
    return (
      <Group
        {...commonGroupProps}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect x={-w / 2} y={-h / 2} width={w} height={h} fill="transparent" />
        {/* Cháy hết: tự thắp lại nếu bật, ngược lại tắt nhang (bát hương vẫn ở lại) */}
        <Incense
          item={item}
          onBurnedOut={() =>
            onChange({ litAt: item.autoRelight ? Date.now() : undefined })
          }
        />
        {isSelected && (
          <Text
            text={spec.name}
            x={-w}
            y={h / 2}
            width={w * 2}
            align="center"
            fontSize={12}
            fill="#fff"
          />
        )}
      </Group>
    );
  }

  // Vật phẩm thường: ảnh minh hoạ SVG
  const w = spec.w;
  const h = spec.h;
  return (
    <Group
      {...commonGroupProps}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* vùng chạm trong suốt để dễ chọn cả khi ảnh chưa tải */}
      <Rect x={-w / 2} y={-h / 2} width={w} height={h} fill="transparent" />
      {image ? (
        <KonvaImage image={image} x={-w / 2} y={-h / 2} width={w} height={h} />
      ) : (
        <Rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          cornerRadius={6}
          fill="rgba(255,255,255,0.08)"
        />
      )}
      {spec.isCandle && <Flame y={-h / 2 + 20} />}
      {isSelected && (
        <Text
          text={spec.name}
          x={-w}
          y={h / 2 + 2}
          width={w * 2}
          align="center"
          fontSize={12}
          fill="#fff"
        />
      )}
    </Group>
  );
}
