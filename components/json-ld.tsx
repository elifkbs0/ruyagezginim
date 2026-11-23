// Product names come from scraped third-party pages, so escape "<" to keep
// a name like "</script>" from breaking out of the JSON-LD block.
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
