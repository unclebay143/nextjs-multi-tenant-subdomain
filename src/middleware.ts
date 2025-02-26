import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./util/session";

// Constants
const RESERVED_SUBDOMAINS = ["www", "app", "api", "admin"];
const AUTH_ROUTES = ["/login", "/signup", "/onboarding"];
const DEFAULT_PATHS = {
  overview: "/overview",
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
};

// Helper functions
function getProtocol(isLocalhost: boolean) {
  return `http${isLocalhost ? "" : "s"}`;
}

function buildUrl(path: string, host: string, isLocalhost: boolean) {
  return `${getProtocol(isLocalhost)}://${host}${path}`;
}

function getWorkspaceUrl(
  defaultWorkspace: string,
  host: string,
  isLocalhost: boolean
) {
  const protocol = getProtocol(isLocalhost);
  const domain = isLocalhost
    ? "localhost"
    : host.split(".").slice(-2).join(".");

  // If it contains dots, it's a subdomain
  return defaultWorkspace.includes(".")
    ? `${protocol}://${defaultWorkspace}`
    : `${protocol}://app.${domain}/${defaultWorkspace}`;
}

function getDomainInfo(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000";
  const isLocalhost = host.includes("localhost");
  const parts = host.split(".");
  const isSubdomain = parts.length > (isLocalhost ? 1 : 2);
  const subdomain = isSubdomain ? parts[0] : null;

  return { url, host, domain, subdomain, isLocalhost };
}

export async function middleware(request: NextRequest) {
  const { url, host, subdomain, isLocalhost } = getDomainInfo(request);
  const session = getSession();

  // console.log("🔍 Request Info:", {
  //   pathname: url.pathname,
  //   host,
  //   subdomain,
  //   isLocalhost,
  //   fullUrl: request.url,
  //   session: session.user,
  // });

  // Handle www to apex domain redirect
  if (subdomain === "www") {
    return NextResponse.redirect(
      new URL(url.pathname, buildUrl("", host.replace("www.", ""), isLocalhost))
    );
  }

  // Handle app subdomain root path
  if (subdomain === "app" && url.pathname === "/") {
    if (session.user?.defaultWorkspace) {
      return NextResponse.redirect(
        new URL(
          getWorkspaceUrl(session.user.defaultWorkspace, host, isLocalhost)
        )
      );
    }
    // No default workspace, redirect to login
    return NextResponse.redirect(new URL(DEFAULT_PATHS.login, request.url));
  }

  // Handle auth routes
  if (AUTH_ROUTES.includes(url.pathname)) {
    // Redirect to app subdomain from main domain
    if (!subdomain) {
      return NextResponse.redirect(
        new URL(url.pathname, buildUrl("", `app.${host}`, isLocalhost))
      );
    }

    // Handle app subdomain auth routes
    if (subdomain === "app") {
      // Handle onboarding access
      if (url.pathname === DEFAULT_PATHS.onboarding) {
        if (session.user?.defaultWorkspace) {
          return NextResponse.redirect(
            new URL(
              getWorkspaceUrl(session.user.defaultWorkspace, host, isLocalhost)
            )
          );
        }
        if (!session.user) {
          return NextResponse.redirect(
            new URL(DEFAULT_PATHS.login, request.url)
          );
        }
      }

      // Handle logged-in user accessing auth pages
      if (
        (url.pathname === DEFAULT_PATHS.login ||
          url.pathname === DEFAULT_PATHS.signup) &&
        session.user
      ) {
        if (session.user.defaultWorkspace) {
          return NextResponse.redirect(
            new URL(
              getWorkspaceUrl(session.user.defaultWorkspace, host, isLocalhost)
            )
          );
        }
        return NextResponse.redirect(
          new URL(DEFAULT_PATHS.onboarding, request.url)
        );
      }
    }
  }

  // Handle root paths and custom subdomains
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    // Handle login path differently
    if (url.pathname === DEFAULT_PATHS.login) {
      if (session.user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    // Protect workspace routes
    if (!session.user) {
      return NextResponse.redirect(new URL(DEFAULT_PATHS.login, request.url));
    }

    // Rewrite workspace paths with subdomain as slug
    const newPath =
      url.pathname === "/" ? `/${subdomain}` : `/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Protect workspace routes on app subdomain
  if (
    subdomain === "app" &&
    url.pathname !== "/" &&
    !AUTH_ROUTES.includes(url.pathname)
  ) {
    if (!session.user) {
      return NextResponse.redirect(new URL(DEFAULT_PATHS.login, request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|[\\w-]+\\.\\w+).*)"],
};
