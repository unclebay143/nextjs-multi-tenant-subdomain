import { User } from "./user";
import { Workspace } from "./workspace";

export const dummyWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    subdomain: "acme.localhost",
    members: [{ userId: "2", role: "owner" }],
    subscription: {
      plan: "pro",
      status: "active",
    },
  },
  {
    id: "2",
    name: "Startup Inc",
    slug: "startup-inc",
    subdomain: null,
    members: [{ userId: "2", role: "member" }],
    subscription: {
      plan: "free",
      status: "active",
    },
  },
  {
    id: "3",
    name: "Vercel Inc",
    slug: "vercel-inc",
    subdomain: null,
    members: [
      { userId: "3", role: "owner" },
      { userId: "2", role: "admin" },
    ],
    subscription: {
      plan: "free",
      status: "active",
    },
  },
];

export const dummyUsers: User[] = [
  {
    id: "1",
    email: "user2@example.com",
    name: "👵 Jane Doe",
    defaultWorkspace: null,
  },
  {
    id: "2",
    email: "user@example.com",
    name: "👨‍🦳 John Doe",
    defaultWorkspace: "startup-inc",
  },
  {
    id: "3",
    email: "user3@example.com",
    name: "🦮 Stone Cold",
    defaultWorkspace: "acme.localhost",
  },
];
