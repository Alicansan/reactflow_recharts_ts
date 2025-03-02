export interface User {
  id: string;
  name: string;
  role: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
}
