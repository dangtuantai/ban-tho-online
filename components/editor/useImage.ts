"use client";

import { useEffect, useState } from "react";

/** Nạp ảnh từ dataURL/URL thành HTMLImageElement cho Konva. */
export function useImage(src?: string) {
  // Lưu kèm src đã nạp: src đổi -> trả về null cho tới khi ảnh mới tải xong,
  // không cần setState reset trong effect.
  const [loaded, setLoaded] = useState<{
    src?: string;
    img: HTMLImageElement;
  } | null>(null);

  useEffect(() => {
    if (!src) return;
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    const onLoad = () => setLoaded({ src, img: image });
    image.addEventListener("load", onLoad);
    image.src = src;
    return () => image.removeEventListener("load", onLoad);
  }, [src]);

  return src && loaded?.src === src ? loaded.img : null;
}
