import { STAGE_WIDTH, type AltarItem } from "./types";

export type HintStatus = "good" | "warn" | "tip";
export type Hint = { id: string; status: HintStatus; text: string };

const CENTER = STAGE_WIDTH / 2;

/**
 * Kiểm tra bố cục bàn thờ theo các quy ước phổ biến và trả về gợi ý.
 * Lưu ý: tả/hữu tính theo hướng bàn thờ nhìn ra -> quy đổi sang góc nhìn
 * của người dùng (nhìn vào bàn thờ): Nam ở bên PHẢI, Nữ ở bên TRÁI màn hình.
 */
export function evaluateLayout(items: AltarItem[]): Hint[] {
  const hints: Hint[] = [];
  const by = (t: string) => items.filter((i) => i.type === t);

  // 1. Bát hương — trung tâm
  const batHuong = by("bat_huong");
  if (batHuong.length === 0) {
    hints.push({
      id: "bat-huong-missing",
      status: "tip",
      text: "Nên thêm bát hương — vật phẩm trung tâm của bàn thờ.",
    });
  } else {
    const offCenter = batHuong.some((b) => Math.abs(b.x - CENTER) > 70);
    hints.push(
      offCenter
        ? {
            id: "bat-huong-center",
            status: "warn",
            text: "Bát hương nên đặt chính giữa, phía trước bàn thờ.",
          }
        : {
            id: "bat-huong-center",
            status: "good",
            text: "Bát hương đã ở vị trí trung tâm.",
          },
    );
  }

  // 2. Ảnh thờ — Nam tả / Nữ hữu
  const anh = by("anh_tho");
  if (anh.length === 0) {
    hints.push({
      id: "anh-tho-tip",
      status: "tip",
      text: "Thêm ảnh thờ và tải ảnh người thân để hoàn thiện bàn thờ tưởng niệm.",
    });
  } else {
    for (const a of anh) {
      if (!a.gender) continue;
      const onRight = a.x > CENTER + 20;
      const onLeft = a.x < CENTER - 20;
      if (a.gender === "nam" && onLeft) {
        hints.push({
          id: `nam-${a.id}`,
          status: "warn",
          text: `Ảnh "${a.name || "Nam"}" (Nam) nên đặt bên phải màn hình (Nam tả).`,
        });
      } else if (a.gender === "nu" && onRight) {
        hints.push({
          id: `nu-${a.id}`,
          status: "warn",
          text: `Ảnh "${a.name || "Nữ"}" (Nữ) nên đặt bên trái màn hình (Nữ hữu).`,
        });
      } else {
        hints.push({
          id: `gender-${a.id}`,
          status: "good",
          text: `Ảnh "${a.name || (a.gender === "nam" ? "Nam" : "Nữ")}" đặt đúng quy tắc Nam tả – Nữ hữu.`,
        });
      }
    }
  }

  // 3. Đèn/nến — nên đặt thành đôi đối xứng
  const den = by("den");
  if (den.length === 1) {
    hints.push({
      id: "den-pair",
      status: "tip",
      text: "Đèn/nến thường đặt thành đôi đối xứng hai bên bát hương.",
    });
  } else if (den.length >= 2) {
    hints.push({
      id: "den-ok",
      status: "good",
      text: "Đôi đèn/nến tạo sự cân đối hai bên.",
    });
  }

  // 4. Đông bình – Tây quả (bình hoa bên trái, mâm quả bên phải màn hình)
  const hoa = by("binh_hoa");
  const qua = by("mam_ngu_qua");
  if (hoa.length && qua.length) {
    const hoaLeft = hoa.every((h) => h.x < CENTER);
    const quaRight = qua.every((q) => q.x > CENTER);
    hints.push(
      hoaLeft && quaRight
        ? { id: "dong-binh-tay-qua", status: "good", text: "Bố cục Đông bình – Tây quả hợp lý." }
        : {
            id: "dong-binh-tay-qua",
            status: "tip",
            text: "Theo lối Đông bình – Tây quả: bình hoa một bên, mâm quả bên còn lại.",
          },
    );
  }

  return hints;
}
