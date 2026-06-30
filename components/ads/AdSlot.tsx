import { siteConfig } from "@/lib/site";

type AdSlotProps = {
  /** slot id của AdSense (data-ad-slot). Bật khi đã có tài khoản. */
  slot?: string;
  /** Nhãn để dễ nhận biết vị trí. */
  label?: string;
  className?: string;
  /** Chiều cao reserve để tránh layout-shift (CLS). */
  minHeight?: number;
};

/**
 * Ô quảng cáo "ad-ready": luôn reserve chỗ để không gây CLS.
 * - Chưa cấu hình NEXT_PUBLIC_ADSENSE_ID -> hiển thị placeholder.
 * - Đã cấu hình + có slot -> render khối <ins> AdSense (script nạp ở layout).
 */
export function AdSlot({ slot, label = "Khu vực quảng cáo", className = "", minHeight = 250 }: AdSlotProps) {
  const enabled = Boolean(siteConfig.adsenseId && slot);

  if (!enabled) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-foreground/40 ${className}`}
        style={{ minHeight }}
        aria-hidden
      >
        {label}
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block", minHeight }}
      data-ad-client={siteConfig.adsenseId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
