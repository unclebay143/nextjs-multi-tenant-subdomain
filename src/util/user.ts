export interface User {
  id: string;
  email: string;
  name: string;
  defaultWorkspace: string | null; // workspace slug or subdomain
}
