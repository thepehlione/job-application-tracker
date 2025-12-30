
export type ApplicationStatus =
  | "wishlist"   // daha başvurmadım
  | "applied"    // başvuru yaptım
  | "interview"  // mülakat sürecinde
  | "offer"      // teklif geldi
  | "rejected";  // olumsuz

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string;
  status: ApplicationStatus;
  link?: string;      // ilan linki
  source?: string;    // LinkedIn, Kariyer.net vs
  salary?: string;    // istersen string bırak
  notes?: string;

  createdAt: string;
  updatedAt: string;
}
