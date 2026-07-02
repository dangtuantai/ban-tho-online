"use client";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không đọc được ảnh"));
    image.src = src;
  });
}

/**
 * Đọc file ảnh của người dùng thành dataURL, thu nhỏ về tối đa `maxDim` px
 * (cạnh dài nhất) để bản nháp/bản lưu không phình to. Xuất PNG để giữ nền
 * trong suốt.
 */
export async function fileToDataUrl(file: File, maxDim = 512): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await loadImage(raw);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  if (scale >= 1) return raw;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

/**
 * Xoá nền ảnh ngay trên máy người dùng (không cần dịch vụ ngoài).
 *
 * Cách làm: tìm các màu nền chủ đạo quanh mép ảnh (nền trắng studio, nền
 * caro trắng–xám của ảnh preview...), rồi flood-fill từ mép vào trong —
 * chỉ xoá vùng nền dính liền với mép, nên chi tiết trắng/xám nằm *bên trong*
 * vật phẩm không bị thủng.
 *
 * `onlyIfOpaque`: chỉ xử lý khi ảnh chưa có vùng trong suốt (dùng cho bước
 * tự động lúc tải lên; PNG đã tách nền sẵn thì giữ nguyên).
 * Kết quả đáng ngờ (xoá quá ít / gần hết ảnh) -> trả về ảnh gốc.
 */
export async function removeBackground(
  dataUrl: string,
  opts: { onlyIfOpaque?: boolean } = {},
): Promise<string> {
  const img = await loadImage(dataUrl);
  const w = img.width;
  const h = img.height;
  if (w < 4 || h < 4) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0);
  const im = ctx.getImageData(0, 0, w, h);
  const d = im.data;

  if (opts.onlyIfOpaque) {
    let transparent = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 250) transparent++;
    if (transparent > w * h * 0.005) return dataUrl; // đã tách nền sẵn
  }

  // Gom màu quanh mép (lượng tử hoá 16 mức/kênh) -> tối đa 3 màu nền chủ đạo.
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    const key = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4);
    const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n++;
    b.r += d[i];
    b.g += d[i + 1];
    b.b += d[i + 2];
    buckets.set(key, b);
  };
  for (let x = 0; x < w; x++) {
    sample(x, 0);
    sample(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    sample(0, y);
    sample(w - 1, y);
  }
  const borderCount = 2 * (w + h);
  const seeds = [...buckets.values()]
    .filter((b) => b.n >= borderCount * 0.05)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
    .map((b) => [b.r / b.n, b.g / b.n, b.b / b.n] as const);
  if (!seeds.length) return dataUrl;

  const TOL2 = 48 * 48;
  const isBg = (i: number) =>
    seeds.some(([r, g, b]) => {
      const dr = d[i] - r;
      const dg = d[i + 1] - g;
      const db = d[i + 2] - b;
      return dr * dr + dg * dg + db * db <= TOL2;
    });

  // Flood-fill 4 hướng từ toàn bộ mép ảnh.
  const mask = new Uint8Array(w * h);
  const queue: number[] = [];
  const push = (x: number, y: number) => {
    const p = y * w + x;
    if (!mask[p] && isBg(p * 4)) {
      mask[p] = 1;
      queue.push(p);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (queue.length) {
    const p = queue.pop() as number;
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  let removed = 0;
  for (let p = 0; p < mask.length; p++) removed += mask[p];
  if (removed < w * h * 0.02 || removed > w * h * 0.95) return dataUrl;

  for (let p = 0; p < mask.length; p++) if (mask[p]) d[p * 4 + 3] = 0;

  // Làm mềm mép cắt 1px cho đỡ răng cưa.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (mask[p]) continue;
      const nearRemoved =
        (x > 0 && mask[p - 1]) ||
        (x < w - 1 && mask[p + 1]) ||
        (y > 0 && mask[p - w]) ||
        (y < h - 1 && mask[p + w]);
      if (nearRemoved) d[p * 4 + 3] = Math.min(d[p * 4 + 3], 140);
    }
  }

  ctx.putImageData(im, 0, 0);
  return canvas.toDataURL("image/png");
}
