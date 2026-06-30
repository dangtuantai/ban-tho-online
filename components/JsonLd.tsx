/** Render JSON-LD structured data. Dữ liệu tĩnh do ta kiểm soát nên an toàn. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
