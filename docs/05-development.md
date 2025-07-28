# 💻 Development Guide

**Daily development workflow for the NextJS starter template**

## 🚀 Getting Started

### Start Development Environment
```bash
# 1. Infrastructure
cd infrastructure && docker compose up -d

# 2. Template development
cd ../template
pnpm install && pnpm run dev
```

**Ready:** [App](http://localhost:3000) | [Database](http://localhost:55323)

## 📅 Daily Commands

### Core Development
```bash
pnpm run dev          # Next.js 15 development server (Turbopack)
pnpm run build        # Production build test
pnpm run start        # Production server test
pnpm run lint         # ESLint validation
pnpm run type-check   # TypeScript validation
```

### Quality Cycle
```bash
# Run all quality checks
pnpm run lint && pnpm run type-check && pnpm run build
```

### Infrastructure Management
```bash
cd infrastructure/
docker compose up -d      # Start all services
docker compose down       # Stop all services
docker compose ps         # Check service status
docker compose logs -f    # Follow logs
```

## 🏗️ Project Structure

### Template Organization
```
template/
├── app/                     # Next.js 15 App Router
│   ├── (auth)/             # Authentication pages
│   ├── (marketing)/        # Public pages  
│   ├── dashboard/          # Protected dashboard
│   └── api/               # API routes
├── components/             # React components
│   ├── auth/              # Authentication UI
│   ├── billing/           # Payment components
│   ├── layout/            # Header, footer, navigation
│   ├── theme/             # Dark/light mode
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and integrations
│   ├── auth/              # Authentication logic
│   ├── stripe/            # Payment integration
│   ├── supabase/          # Database client
│   ├── config.ts          # App configuration
│   └── utils.ts           # Helper functions
└── .env.local            # Environment variables
```

### Key Files
- **`lib/config.ts`** - Central configuration (branding, pricing, locale)
- **`lib/auth/server.ts`** - Server-side authentication helpers
- **`lib/stripe/config.ts`** - Payment configuration and helpers
- **`middleware.ts`** - Route protection and redirects

## 🛠️ Development Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop with hot reload
pnpm run dev
# → Edit files, changes appear instantly

# 3. Quality checks
pnpm run lint && pnpm run type-check

# 4. Test build
pnpm run build

# 5. Commit changes
git add . && git commit -m "feat: add new feature"
```

### Component Development
```bash
# Create new component
mkdir components/my-feature
touch components/my-feature/my-component.tsx
touch components/my-feature/index.ts

# Add to domain exports
echo "export { MyComponent } from './my-component'" >> components/my-feature/index.ts
```

### Database Development
```bash
# Add migration
echo "ALTER TABLE profiles ADD COLUMN new_field TEXT;" > infrastructure/volumes/db/03-new-migration.sql

# Apply migration (restart required)
cd infrastructure && docker compose restart

# Verify in Studio
open http://localhost:55323
```

## 🔧 Configuration

### App Configuration
Edit `lib/config.ts` to customize the template:

```typescript
export const siteConfig = {
  name: "Your App Name",
  description: "Your app description",
  currency: "USD" as const,
  locale: "en-US" as const,
  pricing: {
    starter: 9.99,
    pro: 19.99
  },
  contact: {
    email: "support@yourapp.com",
    company: "Your Company"
  }
}
```

### Environment Variables
Key variables in `.env.local`:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (auto-configured)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payments (configure with your keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Email (optional)
RESEND_API_KEY=re_...

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## 🧪 Testing & Quality

### Automated Quality (Git Hooks)
```bash
# Pre-commit hooks automatically run:
# - Prettier formatting
# - ESLint validation
# - TypeScript type checking

git commit  # → Triggers all quality checks
```

### Manual Quality Checks
```bash
# Code formatting
pnpm run format

# Linting with auto-fix
pnpm run lint --fix

# Type checking
pnpm run type-check

# Build test
pnpm run build
```

### Browser Testing
- **Authentication:** Sign up/login flows
- **Payments:** Stripe test card (4242 4242 4242 4242)
- **Responsive:** Mobile/tablet/desktop views
- **Theme:** Dark/light mode switching

## 🗄️ Database Development

### Schema Management
```bash
# View current schema
open http://localhost:55323  # → Tables tab

# Add new table
echo "CREATE TABLE my_table (id UUID PRIMARY KEY DEFAULT gen_random_uuid());" > infrastructure/volumes/db/03-my-table.sql

# Reset database (⚠️ deletes data)
cd infrastructure && docker compose down -v && docker compose up -d
```

### Direct Database Access
```bash
# PostgreSQL CLI
docker exec -it supabase-db psql -U postgres -d postgres

# Example queries
\dt                          # List tables
SELECT * FROM auth.users;    # View users
SELECT * FROM profiles;      # View profiles
```

## 🐛 Debugging

### Development Server Issues
```bash
# Clear Next.js cache
rm -rf .next && pnpm run dev

# Clear node_modules
rm -rf node_modules && pnpm install

# Check TypeScript errors
pnpm run type-check
```

### Infrastructure Issues
```bash
# Check service status
cd infrastructure && docker compose ps

# View service logs
docker compose logs supabase-db
docker compose logs kong

# Restart specific service
docker compose restart studio
```

### Authentication Issues
```bash
# Check JWT keys match
# 1. infrastructure/.env.local (ANON_KEY, SERVICE_ROLE_KEY)
# 2. template/.env.local (NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)

# Verify in Studio
open http://localhost:55323  # → Settings → API
```

## ⚡ Performance Tips

### Development Speed
- **Turbopack:** Enabled by default with `pnpm run dev`
- **Hot Reload:** Preserves React state on file changes
- **TypeScript:** Incremental compilation
- **Docker:** Keep services running between sessions

### Build Optimization
```bash
# Analyze bundle size
pnpm run build  # Shows build statistics in terminal

# Check build output
ls -la .next/static/chunks/
```

## 🔄 Git Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feature/payment-integration
# → Develop feature
# → Test thoroughly
git commit -m "feat: add payment integration"

# Bug fixes
git checkout -b fix/auth-redirect
# → Fix issue
git commit -m "fix: correct login redirect"
```

### Commit Convention
```bash
feat: add new feature
fix: bug fix
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## 🚀 Production Preparation

### Build Validation
```bash
# Test production build
pnpm run build && pnpm run start

# Check for errors
pnpm run lint && pnpm run type-check
```

### Environment Setup
1. **Database:** Configure production PostgreSQL
2. **Secrets:** Generate secure JWT secrets
3. **Payments:** Add Stripe live keys
4. **Domain:** Configure custom domain
5. **Monitoring:** Set up error tracking

---

**Development Stack:** Next.js 15 + React 19 + TypeScript ⚡  
**Infrastructure:** Docker + Supabase + PostgreSQL 🐳  
**Quality:** ESLint + Prettier + TypeScript + Git Hooks ✅