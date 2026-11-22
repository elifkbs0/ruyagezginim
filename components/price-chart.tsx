"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { formatPrice, PLATFORMS } from "@/lib/utils";

interface PricePoint {
  date: string;
  platform: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
}

const PLATFORM_COLORS: Record<string, string> = {
  TRENDYOL: "#F27A1A",
  HEPSIBURADA: "#FF6000",
  AMAZON: "#FF9900",
  N11: "#6B3FA0",
  CICEKSEPETI: "#E91E8C",
};

export function PriceChart({ data }: PriceChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl text-gray-400 text-sm">
        Fiyat geçmişi henüz yok
      </div>
    );
  }

  // Group by date and pivot by platform
  const dateMap = new Map<string, Record<string, number>>();
  const platforms = new Set<string>();

  for (const point of data) {
    platforms.add(point.platform);
    const existing = dateMap.get(point.date) ?? {};
    existing[point.platform] = point.price;
    dateMap.set(point.date, existing);
  }

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, prices]) => ({
      date: format(new Date(date), "dd MMM", { locale: tr }),
      ...prices,
    }));

  const platformList = Array.from(platforms);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ebff" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#888" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
          tick={{ fontSize: 11, fill: "#888" }}
          tickLine={false}
          axisLine={false}
          width={45}
        />
        <Tooltip
          formatter={(value, name) => [
            formatPrice(Number(value)),
            PLATFORMS[String(name) as keyof typeof PLATFORMS]?.label ?? String(name),
          ]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e8e0f7",
            boxShadow: "0 4px 12px rgba(108,63,197,0.1)",
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(value) =>
            PLATFORMS[value as keyof typeof PLATFORMS]?.label ?? value
          }
          iconType="circle"
          iconSize={8}
        />
        {platformList.map((platform) => (
          <Line
            key={platform}
            type="monotone"
            dataKey={platform}
            stroke={PLATFORM_COLORS[platform] ?? "#6C3FC5"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
