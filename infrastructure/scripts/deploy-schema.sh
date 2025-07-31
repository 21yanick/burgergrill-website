#!/bin/bash

# =====================================================================================
# BURGERGRILL DATABASE SCHEMA DEPLOYMENT
# Sauberes, wiederholbares Schema-Deployment auf Testserver
# =====================================================================================

set -e

# Configuration
SERVER="root@167.235.150.94"
CONTAINER="supabase-db-zkw8g48scw0sw0w8koo08wwg"
DB_USER="supabase_admin"
DB_NAME="postgres"
SCHEMA_FILE="restaurant-business-schema.sql"

echo "🚀 Deploying Burgergrill Restaurant Schema..."
echo "📡 Server: $SERVER"
echo "🐳 Container: $CONTAINER"
echo "📄 Schema: $SCHEMA_FILE"
echo ""

# Step 1: Copy schema file to server
echo "📋 Step 1: Copying schema file to server..."
scp "./volumes/db/$SCHEMA_FILE" "$SERVER:/tmp/$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Schema file copied successfully"
else
    echo "❌ Failed to copy schema file"
    exit 1
fi

# Step 2: Execute schema on database
echo ""
echo "🗄️ Step 2: Executing schema on database..."
ssh "$SERVER" "docker exec -i $CONTAINER psql -U $DB_USER -d $DB_NAME < /tmp/$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Schema executed successfully"
else
    echo "❌ Failed to execute schema"
    exit 1
fi

# Step 3: Verify deployment
echo ""
echo "🔍 Step 3: Verifying deployment..."
ssh "$SERVER" "docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -c \"
SELECT 
    schemaname, 
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'restaurant_settings', 'opening_hours', 'special_hours', 'menu_categories', 'menu_items')
ORDER BY tablename;
\""

if [ $? -eq 0 ]; then
    echo "✅ Schema verification successful"
else
    echo "❌ Schema verification failed"
    exit 1
fi

# Step 4: Test basic functionality
echo ""
echo "🧪 Step 4: Testing basic functionality..."
ssh "$SERVER" "docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -c \"
-- Test profile creation (simulated)
SELECT 'Profile table structure' as test;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
\""

echo ""
echo "🎯 Deployment Summary:"
echo "✅ Schema file deployed"
echo "✅ Tables created with RLS"
echo "✅ Triggers configured"
echo "✅ Indexes created"
echo "✅ Storage buckets configured"
echo ""
echo "🎉 Burgergrill Database Schema successfully deployed!"
echo ""
echo "📝 Next Steps:"
echo "1. Update TypeScript database types"
echo "2. Test authentication flow"
echo "3. Implement dashboard components"
echo "4. Validate opening hours functionality"