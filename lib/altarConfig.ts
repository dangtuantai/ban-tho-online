import { STAGE_WIDTH, type ItemType } from "./types";

export type Variant = { id: string; name: string; src: string };

export type ItemSpec = {
  type: ItemType;
  name: string;
  /** Các biến thể (mẫu mã) để người dùng lựa chọn. */
  variants: Variant[];
  /** Kích thước hiển thị cơ bản (px ở scale 1). */
  w: number;
  h: number;
  /** Mô tả ý nghĩa - hiển thị tooltip & phục vụ SEO ngữ nghĩa. */
  meaning: string;
  isPhoto?: boolean;
  /** Là cây đèn/nến -> hiển thị hiệu ứng lửa cháy tự động. */
  isCandle?: boolean;
};

const A = "/assets/altar";

/** Danh mục vật phẩm thờ cúng (thư viện kéo–thả). */
export const ITEM_SPECS: ItemSpec[] = [
  {
    type: "anh_tho",
    name: "Ảnh thờ",
    variants: [{ id: "vang", name: "Khung vàng", src: `${A}/anh_tho.svg` }],
    w: 100,
    h: 120,
    meaning: "Di ảnh người đã khuất. Đặt theo quy tắc Nam tả – Nữ hữu.",
    isPhoto: true,
  },
  {
    type: "bat_huong",
    name: "Bát hương",
    variants: [
      { id: "dong", name: "Đồng", src: `${A}/bat_huong.svg` },
      { id: "do", name: "Sứ đỏ", src: `${A}/bat_huong-do.svg` },
      { id: "su", name: "Sứ men lam", src: `${A}/bat_huong-su.svg` },
    ],
    w: 104,
    h: 104,
    meaning: "Trung tâm bàn thờ, đặt chính giữa phía trước, nơi cắm hương.",
  },
  {
    type: "den",
    name: "Đèn / nến",
    variants: [
      { id: "do", name: "Nến đỏ", src: `${A}/den.svg` },
      { id: "nga", name: "Nến ngà", src: `${A}/den-nga.svg` },
      { id: "vang", name: "Đèn dầu vàng", src: `${A}/den-vang.svg` },
    ],
    w: 56,
    h: 104,
    meaning: "Đôi đèn đặt hai bên bát hương, tượng trưng cho ánh sáng – linh khí.",
    isCandle: true,
  },
  {
    type: "binh_hoa",
    name: "Bình hoa",
    variants: [
      { id: "su", name: "Sứ men lam", src: `${A}/binh_hoa.svg` },
      { id: "dong", name: "Đồng hoa đỏ", src: `${A}/binh_hoa-dong.svg` },
      { id: "luc", name: "Men ngọc", src: `${A}/binh_hoa-luc.svg` },
    ],
    w: 86,
    h: 120,
    meaning: "Hoa tươi dâng cúng. Theo lối 'Đông bình – Tây quả'.",
  },
  {
    type: "mam_ngu_qua",
    name: "Mâm ngũ quả",
    variants: [
      { id: "vang", name: "Mâm vàng", src: `${A}/mam_ngu_qua.svg` },
      { id: "do", name: "Mâm sơn son", src: `${A}/mam_ngu_qua-do.svg` },
      { id: "su", name: "Mâm men lam", src: `${A}/mam_ngu_qua-su.svg` },
    ],
    w: 132,
    h: 94,
    meaning: "Ngũ quả dâng cúng, thể hiện lòng thành kính của gia đình.",
  },
  {
    type: "chen_nuoc",
    name: "Chén nước / rượu",
    variants: [
      { id: "su", name: "Chén sứ", src: `${A}/chen_nuoc.svg` },
      { id: "vang", name: "Chén vàng", src: `${A}/chen_nuoc-vang.svg` },
      { id: "luc", name: "Chén men ngọc", src: `${A}/chen_nuoc-luc.svg` },
    ],
    w: 110,
    h: 60,
    meaning: "Bộ chén đựng nước hoặc rượu cúng, đặt phía trước bát hương.",
  },
  {
    type: "ong_huong",
    name: "Ống hương",
    variants: [
      { id: "vang", name: "Ống vàng", src: `${A}/ong_huong.svg` },
      { id: "do", name: "Ống đỏ", src: `${A}/ong_huong-do.svg` },
      { id: "dong", name: "Ống đồng cổ", src: `${A}/ong_huong-dong.svg` },
    ],
    w: 72,
    h: 104,
    meaning: "Đựng hương (nhang) chưa thắp, đặt bên cạnh bàn thờ.",
  },
  {
    type: "doi_hac",
    name: "Hạc thờ",
    variants: [
      { id: "vang", name: "Hạc đồng", src: `${A}/doi_hac.svg` },
      { id: "trang", name: "Hạc trắng", src: `${A}/doi_hac-trang.svg` },
    ],
    w: 70,
    h: 132,
    meaning: "Hạc cưỡi rùa - biểu tượng trường thọ, thường đặt thành đôi hai bên.",
  },
  {
    type: "lu_huong",
    name: "Lư hương",
    variants: [
      { id: "dong", name: "Đồng vàng", src: `${A}/lu_huong.svg` },
      { id: "bronze", name: "Đồng cổ", src: `${A}/lu_huong-dong.svg` },
      { id: "ngoc", name: "Men ngọc", src: `${A}/lu_huong-ngoc.svg` },
    ],
    w: 104,
    h: 112,
    meaning: "Lư đốt trầm, tạo hương thơm trang nghiêm.",
  },
  {
    type: "nhang",
    name: "Nhang + bát hương",
    variants: [{ id: "do", name: "Nhang", src: `${A}/nhang.svg` }],
    w: 64,
    h: 124,
    meaning:
      "Ba cây nhang thắp cháy theo thời gian, toả khói; cháy hết sẽ tự tan.",
  },
];

/** Thời gian cháy mặc định của nhang (giây). */
export const DEFAULT_BURN_SECONDS = 180;

export const ITEM_SPEC_MAP: Record<ItemType, ItemSpec> = Object.fromEntries(
  ITEM_SPECS.map((s) => [s.type, s]),
) as Record<ItemType, ItemSpec>;

/** Lấy src biến thể đầu tiên của một loại vật phẩm. */
export function defaultSrc(type: ItemType): string {
  return ITEM_SPEC_MAP[type].variants[0].src;
}

/** Các mẫu nền bàn thờ (placeholder bằng màu/gradient, thay artwork sau). */
export const BACKGROUNDS = [
  { id: "go-do", name: "Gỗ sơn son", color1: "#6b1d12", color2: "#411008" },
  { id: "go-tu-nhien", name: "Gỗ tự nhiên", color1: "#8a5a2b", color2: "#5c3a18" },
  { id: "vang-gam", name: "Vàng gấm", color1: "#7a5a12", color2: "#4a3608" },
];

/**
 * Bố cục mẫu "chuẩn" – dùng cho nút "Sắp xếp gợi ý".
 * Toạ độ theo hệ STAGE_WIDTH x STAGE_HEIGHT.
 */
export function defaultLayout() {
  const cx = STAGE_WIDTH / 2;
  return [
    { type: "anh_tho" as ItemType, x: cx, y: 180, gender: "nam" as const },
    { type: "bat_huong" as ItemType, x: cx, y: 380 },
    { type: "den" as ItemType, x: cx - 200, y: 380 },
    { type: "den" as ItemType, x: cx + 200, y: 380 },
    { type: "binh_hoa" as ItemType, x: cx - 320, y: 360 },
    { type: "mam_ngu_qua" as ItemType, x: cx + 300, y: 470 },
    { type: "chen_nuoc" as ItemType, x: cx, y: 480 },
  ];
}
