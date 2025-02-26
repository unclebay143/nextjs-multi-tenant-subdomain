```markdown:/Users/unclebigbay/Desktop/1234/multi-tenant-subdomain/README.md
### Expected Behavior Matrix

#### Root Domain
| Path | Behavior |
|------|----------|
| [http://localhost/](http://localhost/) | Show marketing landing page |
| [http://localhost/login](http://localhost/login) | Redirect to `http://app.localhost/login` |
| [http://localhost/signup](http://localhost/signup) | Redirect to `http://app.localhost/signup` |
| [http://localhost/onboarding](http://localhost/onboarding) | Redirect to `http://app.localhost/onboarding` |


#### App Subdomain
| Path | User State | Behavior |
|------|------------|----------|
| [http://app.localhost/](http://app.localhost/) | Not logged in | Redirect to `http://app.localhost/login` |
| [http://app.localhost/](http://app.localhost/) | Logged in with default workspace (subdomain) | Redirect to `http://acme.localhost` |
| [http://app.localhost/](http://app.localhost/) | Logged in with default workspace (no subdomain) | Redirect to `http://app.localhost/startup-inc` |
| [http://app.localhost/login](http://app.localhost/login) | Not logged in | Show login page |
| [http://app.localhost/login](http://app.localhost/login) | Logged in with workspace | Redirect to workspace |
| [http://app.localhost/login](http://app.localhost/login) | Logged in without workspace | Redirect to onboarding |
| [http://app.localhost/signup](http://app.localhost/signup) | Has default workspace | Redirect to workspace |
| [http://app.localhost/signup](http://app.localhost/signup) | No default workspace | Show signup page |
| [http://app.localhost/onboarding](http://app.localhost/onboarding) | Has default workspace | Redirect to workspace |
| [http://app.localhost/onboarding](http://app.localhost/onboarding) | No default workspace | Show onboarding page |

#### Custom Subdomain
| Path | Behavior |
|------|----------|
| [http://acme.localhost/](http://acme.localhost/) | Rewrite to `/acme-corp` |
| [http://acme.localhost/settings](http://acme.localhost/settings) | Rewrite to `/acme-corp/settings` |
| [http://acme.localhost/any-path](http://acme.localhost/any-path) | Rewrite to `/acme-corp/any-path` |
| [http://invalid.localhost/](http://invalid.localhost/) | Redirect to 404 |
```