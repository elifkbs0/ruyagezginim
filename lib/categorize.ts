// Order matters: earlier categories win when a name matches several
// (e.g. "spor ayakkabı" is fashion, "telefon kılıfı" is phone accessories).
const RULES: { slug: string; keywords: string[] }[] = [
  {
    slug: "oyun-konsol",
    keywords: ["playstation", "ps5", "ps4", "xbox", "nintendo", "oyun konsol", "gamepad", "dualsense", "joystick", "oyun kolu"],
  },
  {
    slug: "bebek-oyuncak",
    keywords: ["oyuncak", "lego", "puzzle", "yapboz", "bebek bezi", "bebek arabası", "mama sandalyesi", "biberon", "emzik", "peluş"],
  },
  {
    slug: "otomotiv",
    keywords: ["oto ", "araç", "araba", "lastik", "motor yağı", "silecek", "akü", "oto koltuk", "navigasyon"],
  },
  {
    slug: "telefon-aksesuar",
    keywords: ["iphone", "galaxy s", "galaxy a", "galaxy z", "redmi", "cep telefon", "akıllı telefon", "telefon", "kılıf", "ekran koruyucu", "şarj aleti", "şarj kablo", "powerbank", "power bank"],
  },
  {
    slug: "kozmetik",
    keywords: ["oje", "nail", "ruj", "maskara", "parfüm", "edp", "edt", "krem", "şampuan", "makyaj", "fondöten", "kapatıcı", "epilasyon", "epilatör", "tıraş", "serum", "cilt", "saç kurutma", "saç düzleştirici", "fön makinesi", "deodorant", "losyon", "tırnak", "base coat", "top coat", "topcoat", "primer", "vernis", "color show", "saç şekillendirici", "airwrap", "sakal", "bakım seti"],
  },
  {
    slug: "ev-yasam",
    keywords: ["airfryer", "air fryer", "fritöz", "süpürge", "kahve makine", "blender", "tencere", "tava", "nevresim", "havlu", "fırın", "mutfak", "ütü", "çay makine", "kettle", "su ısıtıcı", "mikser", "tost makine", "buzdolabı", "çamaşır makine", "bulaşık makine", "multicooker", "pişirici", "yastık", "halı", "perde", "lamba", "airfry", "dyson", "paspas", "mop", "hepa", "filtre", "cam silme", "pişirme", "ızgara", "sıkacağı", "sıkacak", "espresso", "kahve", "çay makina", "makinası"],
  },
  {
    slug: "elektronik",
    keywords: ["macbook", "laptop", "notebook", "bilgisayar", "tablet", "ipad", "monitör", "televizyon", "smart tv", "kulaklık", "airpods", "hoparlör", "soundbar", "kamera", "fotoğraf makine", "klavye", "mouse", "akıllı saat", "smartwatch", "ssd", "harddisk", "yazıcı", "modem", "drone", "headset", "wireless", "bluetooth"],
  },
  {
    slug: "moda",
    keywords: ["ayakkabı", "sneaker", "bot", "terlik", "tişört", "t-shirt", "gömlek", "elbise", "pantolon", "jean", "mont", "ceket", "kazak", "sweatshirt", "hırka", "etek", "çanta", "cüzdan", "kemer", "gözlük"],
  },
  {
    slug: "spor-outdoor",
    keywords: ["koşu bandı", "dambıl", "dumbbell", "yoga", "pilates", "bisiklet", "kamp", "çadır", "uyku tulumu", "fitness", "protein", "spor", "termos", "scooter"],
  },
  {
    slug: "kitap-muzik",
    keywords: ["kitap", "roman", "plak", "gitar", "piyano", "keman", "kitaplık"],
  },
];

const LETTER = "a-z0-9çğıöşü";

// Turkish lowercasing turns "I" into "ı", which breaks Latin brand names like "IPHONE",
// so match against both the Turkish and the plain lowercase form.
function normalize(text: string) {
  return `${text.toLocaleLowerCase("tr-TR")} | ${text.toLowerCase()}`;
}

function matches(text: string, keyword: string) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^${LETTER}])${escaped}`).test(text);
}

export function categorize(...texts: (string | null | undefined)[]): string {
  for (const raw of texts) {
    if (!raw) continue;
    const text = normalize(raw);
    for (const rule of RULES) {
      if (rule.keywords.some((k) => matches(text, k))) return rule.slug;
    }
  }
  return "genel";
}
