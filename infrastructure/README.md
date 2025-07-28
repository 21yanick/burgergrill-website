# Infrastructure Setup

**Self-hosted Supabase development stack with Docker Compose**

Provides complete backend infrastructure for the NextJS starter template.

## 🚀 Quick Start

```bash
cd infrastructure
docker compose up -d
```

**Services:** [API](http://localhost:55321) | [Studio](http://localhost:55323) | [Analytics](http://localhost:4000)

## 🐳 Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **Kong Gateway** | 55321 | API gateway and authentication |
| **Supabase Studio** | 55323 | Database management interface |
| **PostgreSQL** | 5432 | Main database (internal) |
| **Analytics** | 4000 | Usage analytics dashboard |

### Complete Stack
- **Authentication:** GoTrue auth server
- **Database:** PostgreSQL 15 with Row Level Security
- **Storage:** File storage and image processing
- **Realtime:** WebSocket subscriptions
- **Analytics:** Usage tracking and monitoring

## 🔧 Configuration

### Environment Setup
Copy and customize the environment configuration:

```bash
cp .env.example .env.local
```

### Required Variables
```env
# Database
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-32-chars-min

# Authentication Keys
ANON_KEY=your_anon_key
SERVICE_ROLE_KEY=your_service_role_key

# Services
KONG_HTTP_PORT=55321
STUDIO_PORT=55323
```

### Automatic Setup
The infrastructure automatically:
- Creates database tables and schemas
- Configures Row Level Security policies
- Sets up authentication flows
- Initializes sample data (optional)

## 📊 Database Schema

### Core Tables
```sql
-- Authentication (managed by Supabase)
auth.users                 -- User accounts
auth.sessions              -- Login sessions

-- Application tables
public.profiles            -- Extended user profiles
public.subscriptions       -- Payment subscriptions
```

### Schema Management
- **Initialization:** `volumes/db/*.sql` files run automatically
- **Migrations:** Add new `.sql` files to `volumes/db/`
- **Reset:** `docker compose down -v && docker compose up -d`

## 🛠️ Development Commands

### Service Management
```bash
# Start services
docker compose up -d

# Stop services  
docker compose down

# View logs
docker compose logs -f [service-name]

# Service status
docker compose ps
```

### Database Access
```bash
# PostgreSQL CLI
docker exec -it supabase-db psql -U postgres -d postgres

# Database reset (⚠️ deletes data)
docker compose down -v
docker compose up -d
```

### Health Checks
```bash
# API status
curl http://localhost:55321/health

# Studio access
curl http://localhost:55323

# Database connection
docker exec supabase-db pg_isready -U postgres
```

## 🔍 Service Details

### Kong API Gateway (Port 55321)
- Routes requests to appropriate services
- Handles JWT authentication
- Provides CORS and rate limiting
- Health endpoint: `/health`

### Supabase Studio (Port 55323)
- Database schema browser
- Table editor and SQL runner
- User management interface
- Authentication configuration

### PostgreSQL Database
- Internal port 5432 (not exposed)
- Accessed via Kong gateway or direct connection
- Automatic backups via Docker volumes
- Connection pooling with Supavisor

## 🚨 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check ports are free
netstat -tulpn | grep :55321
netstat -tulpn | grep :55323

# Restart Docker Desktop
# Then: docker compose up -d
```

**Database connection failed:**
```bash
# Check database logs
docker compose logs supabase-db

# Verify environment variables
docker compose logs kong
```

**Studio not accessible:**
```bash
# Restart studio service
docker compose restart studio

# Check studio logs
docker compose logs studio
```

### Performance Issues
```bash
# Check container resources
docker stats

# View service logs
docker compose logs --tail=50 -f
```

### Complete Reset
```bash
# Nuclear option - deletes all data
docker compose down -v
docker system prune -f
docker compose up -d
```

## 🔐 Security

### Development vs Production

**Development (current setup):**
- Demo JWT secrets (insecure)
- Auto-confirm user registration
- Permissive CORS settings
- Local-only access

**Production recommendations:**
1. Generate secure JWT secrets
2. Configure proper SMTP for email
3. Set up SSL/TLS termination
4. Configure firewall rules
5. Set up database backups

### JWT Key Management
The infrastructure uses demo JWT keys for development. For production:

```bash
# Generate new JWT secret
openssl rand -base64 32

# Update .env.local with new keys
# Restart services: docker compose restart
```

## 📈 Monitoring

### Container Health
```bash
# All service status
docker compose ps

# Resource usage
docker stats

# Service logs
docker compose logs [service-name]
```

### Database Monitoring
- **Studio Dashboard:** Real-time database metrics
- **Analytics Dashboard:** User and API statistics
- **Logs:** Structured logging via Vector

## 🚀 Production Deployment

### Infrastructure Migration
1. **Database:** Migrate to managed PostgreSQL
2. **Environment:** Set production secrets
3. **Networking:** Configure reverse proxy/load balancer
4. **Monitoring:** Set up external monitoring
5. **Backups:** Implement backup strategy

### Scaling Considerations
- **Connection Pooling:** Supavisor handles connection limits
- **Read Replicas:** For high-read workloads
- **Caching:** Redis for session/query caching
- **CDN:** For static asset delivery

---

**Status:** Development Ready ✅  
**Production:** Requires security hardening ⚠️  
**Support:** [Supabase Docs](https://supabase.com/docs)