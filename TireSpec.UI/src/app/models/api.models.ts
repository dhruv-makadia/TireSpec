// ── Session ──────────────────────────────────────────────
export interface CreateSessionRequest {
  websiteId: string;
}

export interface CreateSessionResponse {
  expire: string;
  jwt: string;
}

// ── Tire Scan ────────────────────────────────────────────
export interface TireData {
  brand: string;
  model: string;
  tireSize: string;
  dotCode: string;
  dotYear: string;
  loadIndex: string;
  speedRating: string;
}

export interface TireScanRequest {
  imageDataUrl?: string | null;
  manualData?: TireData | null;
}

export interface TireScanResponse {
  imageDataUrl: string | null;
  brand: string;
  model: string;
  tireSize: string;
  dotCode: string;
  dotYear: string;
  loadIndex: string;
  speedRating: string;
}

// ── Quote ────────────────────────────────────────────────
export interface QuoteRequest {
  brand: string;
  model: string;
  tireSize: string;
  dotCode: string;
  dotYear: string;
  loadIndex: string;
  speedRating: string;
}

export interface TireQuote {
  id: string;
  name: string;
  price: string;
  details: string;
  warranty: string;
  tireSize: string;
}

export interface QuoteResponse {
  recommendations: TireQuote[];
}

// ── Contact ──────────────────────────────────────────────
export interface ContactRequest {
  name?: string | null;
  phoneNumber: string;
  email?: string | null;
}

export interface ContactResponse {
  status: string;
  message: string;
}

// ── Error ────────────────────────────────────────────────
export interface ErrorResponse {
  message: string;
}
