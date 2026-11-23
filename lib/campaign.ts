const TZ = "Europe/Istanbul";

function istanbulParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day) };
}

export function campaignYear(now = new Date()) {
  return istanbulParts(now).year;
}

// Black Friday is the last Friday of November.
export function blackFridayDay(year: number) {
  const lastOfNovember = new Date(Date.UTC(year, 10, 30));
  const back = (lastOfNovember.getUTCDay() - 5 + 7) % 7;
  return 30 - back;
}

// Midnight in Istanbul (UTC+3, no DST) at the start of Black Friday.
export function blackFridayStart(year: number) {
  return new Date(Date.UTC(year, 10, blackFridayDay(year), -3));
}

export function isNovemberInIstanbul(now = new Date()) {
  return istanbulParts(now).month === 11;
}

export const CAMPAIGN_PATH = "/kasim-indirimleri";
