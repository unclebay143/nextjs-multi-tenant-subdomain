import { getDynamicSearchParams } from "@/util/params";
import { findWorkspace, findWorkspacesByUser } from "@/util/workspace";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { getSession } from "@/util/session";

export default async function WorkspaceLayout({
  params,
  children,
}: {
  params: Promise<{
    workspace: string;
  }>;
  children: React.ReactNode;
}) {
  const { workspace } = await getDynamicSearchParams(params);
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // If accessing via subdomain, use full host for lookup
  const identifier = host.startsWith(workspace) ? host : workspace;
  const session = getSession();
  const workspaceData = await findWorkspace(identifier);
  const domain = host.includes("localhost")
    ? "localhost"
    : process.env.NEXT_PUBLIC_DOMAIN;
  const rootDomain = `http${host.includes("localhost") ? "" : "s"}://${domain}`;
  //   console.log("[workspace] param:", workspace);
  //   console.log("[host]:", host);
  //   console.log("[workspace data]:", workspaceData);

  if (
    !workspaceData ||
    !session.user ||
    workspaceData.subscription.status === "expired"
  ) {
    notFound();
  }

  const user = session.user;

  const isMember = workspaceData.members.find(
    (member) => member.userId === user?.id
  );

  if (!isMember) {
    notFound();
  }

  const userWorkspaces = findWorkspacesByUser(user);

  return (
    <div className="space-y-5 pt-5">
      <div className="flex gap items-center justify-center gap-10 w-full">
        <div className="flex flex-col">
          <p className="text-green-500">{workspaceData.name}</p>
          <span className="text-xs">workspace name</span>
        </div>
        &middot;
        <div className="flex flex-col">
          <p className="text-purple-500">/{workspaceData.slug}</p>
          <span className="text-xs">workspace slug</span>
        </div>
        &middot;
        <div className="flex flex-col">
          <p className="text-indigo-500">
            {workspaceData.subdomain ?? "Not set"}
          </p>
          <span className="text-xs">custom subdomain</span>
        </div>
      </div>
      <div className="flex flex-col gap items-center justify-center gap-10 w-full">
        {/* navigation */}
        <nav className="pt-10 flex gap-4 items-center justify-center">
          <ul className="flex gap-4 items-center">
            <li className="text-sm hover:underline text-gray-400 underline-offset-4">
              <Link href="/">Dashboard</Link>
            </li>

            <li className="text-sm hover:underline text-gray-400 underline-offset-4">
              <Link href="/overview">Overview</Link>
            </li>
            <li className="text-sm hover:underline text-gray-400 underline-offset-4">
              <a target="_blank" href={`${rootDomain}/pricing`}>
                Pricing
              </a>
            </li>
            <li className="text-sm hover:underline text-gray-400 underline-offset-4">
              <WorkspaceSwitcher
                currentWorkspace={workspaceData}
                workspaces={userWorkspaces}
              />
            </li>
          </ul>
        </nav>
        {user.name}
        {children}
      </div>
    </div>
  );
}
