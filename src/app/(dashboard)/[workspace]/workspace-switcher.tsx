"use client";

import { useState } from "react";
import { Workspace } from "@/util/workspace";
import { useRouter } from "next/navigation";

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
}

export function WorkspaceSwitcher({
  currentWorkspace,
  workspaces,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const switchToWorkspace = (workspace: Workspace) => {
    const host = window.location.host;
    const isLocalhost = host.includes("localhost");
    const protocol = `http${isLocalhost ? "" : "s"}`;
    const domain = isLocalhost
      ? "localhost"
      : host.split(".").slice(-2).join(".");

    const newUrl = workspace.subdomain
      ? `${protocol}://${workspace.subdomain}`
      : `${protocol}://app.${domain}/${workspace.slug}`;

    // Use router.push for client-side navigation
    router.push(newUrl);
  };

  const ProBadge = (
    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">
      Pro
    </span>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded hover:bg-zinc-900"
      >
        <span>{currentWorkspace.name}</span>
        {currentWorkspace.subscription.plan === "pro" && ProBadge}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-64 mt-1 bg-zinc-900 rounded-md shadow-lg border border-zinc-900">
          <div className="p-2">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => switchToWorkspace(workspace)}
                className={`flex items-center justify-between gap-2 w-full text-left p-2 rounded hover:bg-zinc-800 ${
                  workspace.id === currentWorkspace.id ? "bg-zinc-900" : ""
                }`}
              >
                {workspace.name}
                <div className="flex gap-2 items-center">
                  {workspace.subscription.plan === "pro" && ProBadge}
                  {workspace.id === currentWorkspace.id && (
                    <svg
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
