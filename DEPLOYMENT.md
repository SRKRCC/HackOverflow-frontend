# Cloudflare Pages CI/CD Setup

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Cloudflare Pages Project**: Create a new Pages project in Cloudflare dashboard

## Required Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

### Secrets:
```bash
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
VITE_API_BASE_URL
```

## Deployment

The `deploy.yml` workflow automatically:
- Builds the project on push to master
- Runs linting checks
- Deploys to Cloudflare Pages
- Can be triggered manually

### Triggers:
- **Push to master**: Production deployment
- **Manual**: From GitHub Actions tab