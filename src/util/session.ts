import { dummyUsers } from "./dummy-data";
import { User } from "./user";

export interface Session {
  user: User | null;
}

export function getSession(): Session {
  // Simulating a logged-in user with a default workspace
  //   const noSession = null;
  //   const userWithNoDefaultWorkspace = dummyUsers[0];
  const userWithWorkspaceSlug = dummyUsers[1];
  //   const userWithWorkspaceSubdomain = dummyUsers[2];
  //   const userWith2Workspaces = dummyUsers[1];
  return {
    user: userWithWorkspaceSlug,
  };
}
