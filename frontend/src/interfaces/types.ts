export type UserRole = 'ADMIN' | 'USER';

export interface UserProfile {
  id: number;       
  username: string; 
  role: UserRole;   
}

export interface AuthResponse {
  access_token: string; 
  user: UserProfile;    
}

export interface Field {
  id: number;           
  name: string;         
  pricePerHour: number; 
  type: string;         
}