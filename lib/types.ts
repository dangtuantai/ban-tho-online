/** Kích thước canvas thiết kế (toạ độ logic, sẽ scale responsive). */
export const STAGE_WIDTH = 960;
export const STAGE_HEIGHT = 600;

export type ItemType =
  | "anh_tho"
  | "bat_huong"
  | "den"
  | "binh_hoa"
  | "mam_ngu_qua"
  | "chen_nuoc"
  | "ong_huong"
  | "lu_huong"
  | "doi_hac"
  | "nhang";

export type Gender = "nam" | "nu";

/** Một vật phẩm trên bàn thờ. x,y là tâm vật phẩm. */
export type AltarItem = {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  /** Biến thể ảnh được chọn (đường dẫn src). Bỏ trống -> dùng biến thể đầu. */
  src?: string;
  // Dành cho ảnh thờ:
  photo?: string; // dataURL ảnh người thân
  name?: string; // tên người mất
  dates?: string; // năm sinh - năm mất
  gender?: Gender; // phục vụ quy tắc Nam tả - Nữ hữu
  /** Cách hiển thị ảnh trong khung: lấp đầy (cắt) hoặc hiện toàn ảnh. */
  photoFit?: "cover" | "contain";
  photoZoom?: number; // phóng to ảnh trong khung (mặc định 1)
  photoOffsetX?: number; // dịch ngang (-0.5..0.5 theo bề rộng khung)
  photoOffsetY?: number; // dịch dọc (-0.5..0.5 theo chiều cao khung)
  // Dành cho nhang (3 cây):
  litAt?: number; // mốc thời gian thắp (ms). Bỏ trống = chưa thắp.
  burnSeconds?: number; // thời gian cháy (giây), mặc định 180
  autoRelight?: boolean; // tự động thắp lại khi cháy hết
};

export type AltarDesign = {
  version: 1;
  background: string;
  items: AltarItem[];
  updatedAt: number;
};
