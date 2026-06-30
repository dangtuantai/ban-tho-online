"use client";

import dynamic from "next/dynamic";

// react-konva chỉ chạy phía client -> tắt SSR.
const AltarEditor = dynamic(() => import("./AltarEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-lg border border-border bg-white/40 text-foreground/50">
      Đang tải công cụ lập bàn thờ…
    </div>
  ),
});

export function EditorLoader() {
  return <AltarEditor />;
}
