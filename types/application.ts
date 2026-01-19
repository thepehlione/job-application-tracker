
export type ApplicationStatus =
  | "wishlist"   
  | "applied"    
  | "interview" 
  | "offer"      
  | "rejected";  

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string;
  status: ApplicationStatus;
  link?: string;      
  source?: string;    
  salary?: string;   
  notes?: string;

  createdAt: string;
  updatedAt: string;
}
