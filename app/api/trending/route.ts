import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const [trending, topSearches] = await Promise.all([
    db.product.findMany({
      orderBy: { viewCount: "desc" },
      take: 12,
      include: {
        listings: {
          orderBy: { currentPrice: "asc" },
          take: 1,
        },
      },
    }),
    db.searchLog.findMany({
      orderBy: { count: "desc" },
      take: 10,
    }),
  ]);

  return NextResponse.json({ trending, topSearches });
}
