export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  access_token: string;
}

export interface Field {
  id: number;
  name: string;
  pricePerHour: number;
}