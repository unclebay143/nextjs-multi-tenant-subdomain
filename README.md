
# Multi-tenant Subdomain Application

A Next.js application that demonstrates multi-tenant architecture using both subdomain-based and path-based routing.

## Features

- 🏢 Multi-tenant workspaces
- 🔐 Workspace access control
- 🌐 Custom subdomain support
- 🔄 Workspace switching
- 💳 Subscription-based features (Free/Pro plans)
- 🛡️ Route protection
- 🔑 Authentication flow

## Getting Started

### Prerequisites

- Node.js 18+
- Ppnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd multi-tenant-subdomain
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```


## Architecture Decisions

### Middleware Optimization

The middleware is designed to handle only routing logic without database calls. All data-dependent checks are performed in server components:

- ✅ Middleware: Handles routing and basic session checks
- ✅ Server Components: Perform:
  - Workspace access validation
  - Subscription status checks
  - User membership verification
  - Feature flag enforcement

This approach:
- Reduces middleware complexity
- Improves response times
- Prevents unnecessary database load
- Centralizes access control logic

## Usage

### Accessing Workspaces

Workspaces can be accessed in two ways:

1. Subdomain-based (Pro plan):
   - `http://workspace-subdomain.localhost`

2. Path-based (Free plan):
   - `http://app.localhost/workspace-slug`

### Authentication Flow

1. Users are redirected to login if not authenticated
2. After login, users are directed to:
   - Their default workspace if set
   - Onboarding if no default workspace

### Workspace Features

- Workspace switching via dropdown
- Subscription status indicators
- Member role management
- Custom subdomain configuration (Pro plan)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication routes
│   └── (dashboard)/     # Protected workspace routes
├── util/
│   ├── workspace.ts     # Workspace management
│   ├── session.ts       # Authentication
│   └── params.ts        # URL parameter handling
└── middleware.ts        # Route protection & subdomain handling
```

## Technical Details

- Built with Next.js 15
- TypeScript for type safety
- Tailwind CSS for styling
- Server-side and client-side routing
- Middleware for route protection

## Development

### Local Setup

1. Add local domains to `/etc/hosts`:
```
127.0.0.1 localhost
127.0.0.1 app.localhost
127.0.0.1 acme.localhost
```

2. Run the development server:
```bash
pnpm run dev
```

<!-- ### Testing

```bash
pnpm run test
``` -->

## License

MIT