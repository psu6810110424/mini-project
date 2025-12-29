export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  access_token: string;
}

// ข้อมูลสนาม (เปลี่ยนตาม Domain ที่คุณทำ เช่น Equipment หรือ Field)
export interface Field {
  id: number;
  name: string;
  pricePerHour: number;
}