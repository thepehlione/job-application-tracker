// data/applicationApiRepo.ts
import type { JobApplication } from "@/types/application";

const BASE_URL = "/api/applications";

export const applicationApiRepo = {
  async getAll(): Promise<JobApplication[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("GET failed");
    return res.json();
  },

  async getById(id: string): Promise<JobApplication | null> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

      console.log("GET BY ID:", id, res.status);

      if (res.status === 404) {
        return null; // kayıt yok
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("getById failed:", res.status, text);
        // UI çökmesin diye hata fırlatmıyoruz
        return null;
      }

      return res.json();
    } catch (err) {
      console.error("getById error:", err);
      return null;
    }
  },

  async create(
    data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">
  ) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Create failed");
    return res.json();
  },

  async update(id: string, data: Partial<JobApplication>) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");
    return true;
  },
};
