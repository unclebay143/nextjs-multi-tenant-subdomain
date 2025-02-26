# Routing Behavior Documentation

## Domain Types

- Root domain: `localhost`
- App subdomain: `app.localhost`
- Custom subdomain: `{workspace}.localhost`

## Authentication States

### Unauthenticated User

1. Root domain (`localhost`)
   - `/` → Redirects to `app.localhost/login`
   - `/login` → Redirects to `app.localhost/login`
   - `/signup` → Redirects to `app.localhost/signup`

2. App subdomain (`app.localhost`)
   - `/` → Redirects to `/login`
   - `/login` → Shows login page
   - `/signup` → Shows signup page
   - `/{workspace}` → Redirects to `/login`

3. Custom subdomain (`{workspace}.localhost`)
   - `/` → Redirects to `/login`
   - Any other path → Redirects to `/login`

### Authenticated User (No Default Workspace)

1. Root domain (`localhost`)
   - Any path → Redirects to `app.localhost/onboarding`

2. App subdomain (`app.localhost`)
   - `/` → Redirects to `/onboarding`
   - `/login` → Redirects to `/onboarding`
   - `/signup` → Redirects to `/onboarding`
   - `/onboarding` → Shows onboarding page
   - `/{workspace}` → Shows workspace if user is a member

3. Custom subdomain (`{workspace}.localhost`)
   - Any path → Shows workspace if user is a member

### Authenticated User (With Default Workspace)

1. Root domain (`localhost`)
   - Any path → Redirects to default workspace URL

2. App subdomain (`app.localhost`)
   - `/` → Redirects to default workspace URL
   - `/login` → Redirects to default workspace URL
   - `/signup` → Redirects to default workspace URL
   - `/{workspace}` → Shows workspace if user is a member

3. Custom subdomain (`{workspace}.localhost`)
   - Any path → Shows workspace if user is a member

## Workspace Access Rules

### Free Plan
- Can only access via `app.localhost/{workspace}`
- Custom subdomain returns 404

### Pro Plan
- Can access via both:
  - `app.localhost/{workspace}`
  - `{workspace}.localhost`

### Expired Subscription (Free Plan Behavior)
- Can access via `app.localhost/{workspace}`
- Custom subdomain returns 404