import type { Metadata } from "next";
import { buildMetadata, webApplicationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { EditorLoader } from "@/components/editor/EditorLoader";

export const metadata: Metadata = buildMetadata({
  title: "Lập bàn thờ tưởng niệm online – kéo thả & tải ảnh thờ",
  description:
    "Công cụ miễn phí giúp bạn lập bàn thờ tưởng niệm online: kéo–thả bát hương, đèn, hoa quả, tải ảnh người thân làm ảnh thờ và nhận gợi ý bài trí chuẩn phong tục.",
  path: "/thiet-ke",
});

export default function ThietKePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={webApplicationJsonLd()} />
      <header className="mb-4">
        <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
          Lập bàn thờ của bạn
        </h1>
        <p className="mt-1 text-sm text-foreground/70">
          Bấm thêm vật phẩm bên trái, kéo–thả để sắp xếp, tải ảnh người thân làm
          ảnh thờ. Thiết kế được lưu ngay trên trình duyệt của bạn.
        </p>
      </header>
      <EditorLoader />
    </div>
  );
}
