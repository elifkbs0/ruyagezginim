import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { slugify } from "../lib/utils";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaLibSql({ url: dbUrl });
const db = new PrismaClient({ adapter });

const DEMO_PRODUCTS = [
  {
    name: "Apple iPhone 15 128GB Siyah",
    brand: "Apple",
    category: "Telefon & Aksesuar",
    imageUrl: "https://cdn.dsmcdn.com/ty967/product/media/images/prod/QC/20231018/15/f0ce1e9e-3fe0-30b4-8f59-fc86dd25fe78/1_org_zoom.jpg",
    listings: [
      { platform: "TRENDYOL", price: 36999, original: 39999, rating: 4.7, reviews: 1842, url: "https://www.trendyol.com/apple/iphone-15-128gb-p-756342455" },
      { platform: "HEPSIBURADA", price: 37500, original: 40999, rating: 4.6, reviews: 923, url: "https://www.hepsiburada.com/apple-iphone-15-128gb-siyah-p-HBCV0000N6Z6QG" },
      { platform: "AMAZON", price: 38200, rating: 4.8, reviews: 2341, url: "https://www.amazon.com.tr/dp/B0CHXJ8P5W" },
    ],
  },
  {
    name: "Samsung Galaxy S24 256GB Phantom Black",
    brand: "Samsung",
    category: "Telefon & Aksesuar",
    imageUrl: "https://cdn.dsmcdn.com/ty1140/product/media/images/prod/QC/20240117/16/32d6f58f-5f19-3e97-8a73-5dfce4f75ab3/1_org_zoom.jpg",
    listings: [
      { platform: "TRENDYOL", price: 42999, original: 49999, rating: 4.8, reviews: 2156, url: "https://www.trendyol.com/samsung/galaxy-s24" },
      { platform: "HEPSIBURADA", price: 43500, original: 48999, rating: 4.7, reviews: 1203, url: "https://www.hepsiburada.com/samsung-galaxy-s24" },
      { platform: "N11", price: 41999, rating: 4.5, reviews: 445, url: "https://www.n11.com/samsung-galaxy-s24" },
    ],
  },
  {
    name: "Dyson V15 Detect Kablosuz Süpürge",
    brand: "Dyson",
    category: "Ev & Yaşam",
    imageUrl: "https://cdn.dsmcdn.com/ty789/product/media/images/prod/QC/20230317/12/1_org_zoom.jpg",
    listings: [
      { platform: "TRENDYOL", price: 19999, original: 24999, rating: 4.9, reviews: 3421, url: "https://www.trendyol.com/dyson/v15-detect" },
      { platform: "HEPSIBURADA", price: 20500, original: 25999, rating: 4.8, reviews: 1890, url: "https://www.hepsiburada.com/dyson-v15" },
      { platform: "AMAZON", price: 21200, original: 26999, rating: 4.7, reviews: 892, url: "https://www.amazon.com.tr/dp/dyson-v15" },
    ],
  },
  {
    name: "MacBook Air M3 15\" 256GB Uzay Grisi",
    brand: "Apple",
    category: "Elektronik",
    imageUrl: "https://cdn.dsmcdn.com/ty1200/product/media/images/prod/QC/20240310/16/macbook-air-m3.jpg",
    listings: [
      { platform: "TRENDYOL", price: 59999, original: 64999, rating: 4.9, reviews: 892, url: "https://www.trendyol.com/apple/macbook-air-m3" },
      { platform: "HEPSIBURADA", price: 61500, rating: 4.8, reviews: 445, url: "https://www.hepsiburada.com/macbook-air-m3" },
    ],
  },
  {
    name: "Xiaomi Redmi Note 13 Pro 256GB",
    brand: "Xiaomi",
    category: "Telefon & Aksesuar",
    imageUrl: "https://cdn.dsmcdn.com/ty1056/product/media/images/prod/QC/20231203/17/redmi-note-13.jpg",
    listings: [
      { platform: "TRENDYOL", price: 12999, original: 15999, rating: 4.6, reviews: 5634, url: "https://www.trendyol.com/xiaomi/redmi-note-13-pro" },
      { platform: "HEPSIBURADA", price: 13250, original: 15999, rating: 4.5, reviews: 2341, url: "https://www.hepsiburada.com/xiaomi-redmi-note-13-pro" },
      { platform: "N11", price: 12750, original: 14999, rating: 4.4, reviews: 892, url: "https://www.n11.com/xiaomi-redmi-note-13" },
      { platform: "CICEKSEPETI", price: 13100, rating: 4.3, reviews: 334, url: "https://www.ciceksepeti.com/xiaomi-redmi-note-13-pro" },
    ],
  },
  {
    name: "Sony PlayStation 5 Oyun Konsolu",
    brand: "Sony",
    category: "Oyun & Konsol",
    imageUrl: "https://cdn.dsmcdn.com/ty967/product/media/images/prod/QC/20231018/15/playstation-5.jpg",
    listings: [
      { platform: "TRENDYOL", price: 22999, original: 24999, rating: 4.9, reviews: 7823, url: "https://www.trendyol.com/sony/playstation-5" },
      { platform: "HEPSIBURADA", price: 23500, original: 25999, rating: 4.8, reviews: 4512, url: "https://www.hepsiburada.com/sony-playstation-5" },
      { platform: "AMAZON", price: 23200, original: 25999, rating: 4.9, reviews: 3421, url: "https://www.amazon.com.tr/dp/playstation-5" },
    ],
  },
  {
    name: "Nike Air Max 270 Erkek Spor Ayakkabı",
    brand: "Nike",
    category: "Spor & Outdoor",
    imageUrl: "https://cdn.dsmcdn.com/ty789/product/media/images/prod/QC/20230317/12/nike-air-max-270.jpg",
    listings: [
      { platform: "TRENDYOL", price: 2899, original: 3999, rating: 4.7, reviews: 2341, url: "https://www.trendyol.com/nike/air-max-270" },
      { platform: "HEPSIBURADA", price: 3100, original: 3999, rating: 4.6, reviews: 1203, url: "https://www.hepsiburada.com/nike-air-max-270" },
    ],
  },
  {
    name: "Bosch Serie 6 Ankastre Fırın",
    brand: "Bosch",
    category: "Ev & Yaşam",
    imageUrl: "https://cdn.dsmcdn.com/ty967/product/media/images/prod/QC/20231018/15/bosch-serie-6.jpg",
    listings: [
      { platform: "TRENDYOL", price: 14999, original: 18999, rating: 4.8, reviews: 1234, url: "https://www.trendyol.com/bosch/serie-6-firin" },
      { platform: "HEPSIBURADA", price: 15500, original: 19999, rating: 4.7, reviews: 892, url: "https://www.hepsiburada.com/bosch-serie-6-firin" },
      { platform: "N11", price: 14750, original: 18500, rating: 4.6, reviews: 445, url: "https://www.n11.com/bosch-serie-6-firin" },
    ],
  },
];

async function main() {
  console.log("Seed data yükleniyor...");

  for (const data of DEMO_PRODUCTS) {
    const slug = slugify(data.name) + "-demo";

    const product = await db.product.upsert({
      where: { slug },
      update: { updatedAt: new Date() },
      create: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        imageUrl: data.imageUrl,
        slug,
        viewCount: Math.floor(Math.random() * 500) + 50,
      },
    });

    for (const l of data.listings) {
      const listing = await db.platformListing.upsert({
        where: {
          platform_externalId: {
            platform: l.platform,
            externalId: `demo-${product.id}-${l.platform}`,
          },
        },
        update: {
          currentPrice: l.price,
          originalPrice: l.original ?? null,
          rating: l.rating,
          reviewCount: l.reviews ?? null,
          updatedAt: new Date(),
        },
        create: {
          productId: product.id,
          platform: l.platform,
          externalId: `demo-${product.id}-${l.platform}`,
          url: l.url,
          currentPrice: l.price,
          originalPrice: l.original ?? null,
          rating: l.rating,
          reviewCount: l.reviews ?? null,
          inStock: true,
        },
      });

      // Add price history (simulated 30 days)
      const basePrice = l.price;
      for (let i = 29; i >= 0; i--) {
        const variation = (Math.random() - 0.4) * 0.08;
        const historicalPrice = Math.round(basePrice * (1 + variation));
        const recordedAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);

        await db.priceHistory.create({
          data: {
            platformListingId: listing.id,
            price: historicalPrice,
            recordedAt,
          },
        });
      }
    }

    console.log(`✓ ${data.name}`);
  }

  console.log("\nSeed tamamlandı!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
