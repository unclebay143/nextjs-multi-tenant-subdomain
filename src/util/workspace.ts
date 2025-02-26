import { dummyWorkspaces } from "./dummy-data";
import { User } from "./user";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  members: WorkspaceMember[];
  subscription: {
    plan: "free" | "pro";
    status: "active" | "expired";
  };
}

export interface WorkspaceMember {
  userId: string;
  role: "owner" | "admin" | "member";
}

export function findWorkspaceBySubdomain(subdomain: string) {
  return dummyWorkspaces.find((w) => w.subdomain?.includes(subdomain));
}

export function findWorkspaceBySlug(slug: string) {
  return dummyWorkspaces.find((w) => w.slug === slug);
}

// function isSubdomain(identifier: string): boolean {
//   return identifier.includes(".");
// }

function getSubdomainFromHost(host: string): string {
  return host.split(".")[0];
}

export async function findWorkspace(identifier: string) {
  // Clean the identifier if it's a full host
  const cleanIdentifier = identifier.includes(".")
    ? getSubdomainFromHost(identifier)
    : identifier;

  // Try finding by subdomain first, then by slug
  return (
    findWorkspaceBySubdomain(cleanIdentifier) ||
    findWorkspaceBySlug(cleanIdentifier)
  );
}

export function findWorkspacesByUser(user: User) {
  return dummyWorkspaces.filter((workspace) =>
    workspace.members.some((member) => member.userId === user.id)
  );
}
