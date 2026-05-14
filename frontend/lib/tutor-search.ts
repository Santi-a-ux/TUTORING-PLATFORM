export interface TutorSearchRecord {
  user_id: string;
  display_name?: string;
  full_name?: string;
  bio?: string;
  specialties?: string[];
  categories?: string[];
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  carro: [
    "auto",
    "autos",
    "vehiculo",
    "vehiculos",
    "vehículo",
    "vehículos",
    "automovil",
    "automoviles",
    "automóvil",
    "automóviles",
    "mecanica",
    "mecanico",
    "mecánica",
    "mecánico",
    "taller",
    "motor",
    "conducir",
    "manejar",
    "licencia",
    "reparacion",
    "reparación",
    "arreglar",
    "arreglo",
    "carro",
    "carros",
  ],
  mecanica: [
    "carro",
    "carros",
    "auto",
    "autos",
    "vehiculo",
    "vehiculos",
    "vehículo",
    "vehículos",
    "taller",
    "motor",
    "conducir",
    "manejar",
    "reparacion",
    "reparación",
    "arreglar",
    "arreglo",
  ],
  conducir: ["manejar", "manejo", "licencia", "auto", "carro", "vehiculo", "vehículo"],
  manejar: ["conducir", "manejo", "licencia", "auto", "carro", "vehiculo", "vehículo"],
};

const ACCENT_MAP: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (char) => ACCENT_MAP[char] ?? char)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function singularize(token: string) {
  if (token.length <= 3) {
    return token;
  }

  if (token.endsWith("es") && token.length > 4) {
    return token.slice(0, -2);
  }

  if (token.endsWith("s") && token.length > 3) {
    return token.slice(0, -1);
  }

  return token;
}

function expandTokens(text: string) {
  const tokens = normalizeText(text)
    .split(" ")
    .map(singularize)
    .filter(Boolean);

  const expanded = new Set<string>(tokens);

  for (const token of tokens) {
    const synonyms = SEARCH_SYNONYMS[token];
    if (!synonyms) continue;

    for (const synonym of synonyms) {
      expanded.add(normalizeText(synonym));
    }
  }

  return [...expanded];
}

export function getTutorSearchText(tutor: TutorSearchRecord) {
  return normalizeText(
    [
      tutor.display_name,
      tutor.full_name,
      tutor.bio,
      ...(tutor.specialties ?? []),
      ...(tutor.categories ?? []),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function matchesTutorSearch(tutor: TutorSearchRecord, rawQuery: string) {
  const query = normalizeText(rawQuery);
  if (!query) {
    return true;
  }

  const haystack = getTutorSearchText(tutor);
  const expandedQueryTokens = expandTokens(query);
  const haystackTokens = new Set(haystack.split(" ").map(singularize));

  if (haystack.includes(query)) {
    return true;
  }

  return expandedQueryTokens.some((token) => {
    if (!token) {
      return false;
    }

    if (haystack.includes(token)) {
      return true;
    }

    const tokenized = singularize(token);
    if (haystackTokens.has(tokenized)) {
      return true;
    }

    const synonymGroup = SEARCH_SYNONYMS[tokenized];
    return synonymGroup ? synonymGroup.some((synonym) => haystack.includes(normalizeText(synonym))) : false;
  });
}

export function buildTutorOccupationLabel(tutor: TutorSearchRecord) {
  const rawText = [tutor.bio, tutor.display_name, tutor.full_name].filter(Boolean).join(" ").trim();
  if (!rawText) {
    return tutor.specialties?.[0] || tutor.categories?.[0] || "Especialista disponible";
  }

  if (rawText.length <= 72) {
    return rawText;
  }

  return `${rawText.slice(0, 69).trim()}...`;
}

export type DiscoveredTopic = {
  token: string;
  label: string;
  count: number;
};

export function discoverTopicsFromTutors(tutors: TutorSearchRecord[], max = 12): DiscoveredTopic[] {
  const freq: Record<string, number> = {};

  for (const t of tutors) {
    const text = getTutorSearchText(t);
    const tokens = expandTokens(text);

    for (const token of tokens) {
      if (!token) continue;
      freq[token] = (freq[token] || 0) + 1;
    }

    // prefer declared specialties/categories as higher-weight tokens
    for (const s of t.specialties ?? []) {
      const toks = expandTokens(s);
      for (const tok of toks) {
        freq[tok] = (freq[tok] || 0) + 3;
      }
    }

    for (const c of t.categories ?? []) {
      const toks = expandTokens(c);
      for (const tok of toks) {
        freq[tok] = (freq[tok] || 0) + 2;
      }
    }
  }

  const items: DiscoveredTopic[] = Object.keys(freq)
    .map((k) => ({ token: k, label: k.charAt(0).toUpperCase() + k.slice(1), count: freq[k] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, max);

  return items;
}