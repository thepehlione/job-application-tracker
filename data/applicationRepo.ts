"use client"

const STORAGE_KEY = "job-application-data";
import type { JobApplication } from "@/types/application";


function load():JobApplication[]{
    if(typeof window === "undefined") return [];

    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    
    try{
        const parsed = JSON.parse(raw);
        if(!Array.isArray(parsed)) return [];
        return parsed as JobApplication[];
    }catch{
        return [];
    }
}

function save(items: JobApplication[]): void {
    if(typeof window === "undefined") return;


    try{
        const json = JSON.stringify(items);
        localStorage.setItem(STORAGE_KEY,json);

    }catch(err){
        console.error("Failed to save job applications",err);
    }
}


export const applicationRepo = {
    getAll(): JobApplication[]{
        return load();
    },

    getApplicationById(id:string):JobApplication | undefined {
        const items = load();
        return items.find((app)=>app.id === id);
    },

    createApplication(data: Omit<JobApplication,"id" | "createdAt" | "updatedAt">): JobApplication {
        const items = load();
        const now = new Date().toISOString();

        const newItem:JobApplication = {
            id:crypto.randomUUID(),
            createdAt:now,
            updatedAt:now,
            ...data,
        };

        items.push(newItem);
        save(items);
        return newItem;
    },

    updateApplication(id:string,data:Partial<Omit<JobApplication,"id" | "createdAt">>): JobApplication | undefined {

        const items = load();
        const index = items.findIndex((app)=> app.id === id);
        if(index === -1) return undefined;


        const updated:JobApplication = {
            ...items[index],
            ...data,
            updatedAt:new Date().toISOString(),
        };

        items[index] = updated;
        save(items);
        return updated;


    },

    deleteApplication(id:string):boolean{
        const items = load();
        const next = items.filter((app)=>app.id !== id);
        if(next.length === items.length) return false;

        save(next);
        return true;
    }
}