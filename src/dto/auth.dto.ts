export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'vendedor';
}

export interface LoginDTO {
  email: string;
  password: string;
}


