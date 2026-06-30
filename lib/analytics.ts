"use client";

/**
 * Gửi sự kiện tới Google Analytics (nếu đã cấu hình NEXT_PUBLIC_GA_ID).
 * An toàn khi GA chưa bật: tự bỏ qua, không lỗi.
 */
type Params = Record<string, string | number | boolean>;

export function track(event: string, params?: Params) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params ?? {});
}
