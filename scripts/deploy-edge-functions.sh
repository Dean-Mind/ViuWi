#!/bin/bash

# Deploy Supabase Edge Functions for Knowledge Base
# This script deploys all edge functions required for the knowledge base functionality

set -e

echo "🚀 Deploying Supabase Edge Functions for Knowledge Base..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "   supabase login"
    exit 1
fi

# Project reference (env or arg)
PROJECT_REF="${PROJECT_REF:-${1:-}}"
if [ -z "$PROJECT_REF" ]; then
  echo "❌ PROJECT_REF is not set. Provide via env or as the first arg."
  echo "   Example: PROJECT_REF=your-ref ./scripts/deploy-edge-functions.sh"
  echo "         or ./scripts/deploy-edge-functions.sh your-ref"
  exit 1
fi

echo "📋 Project Reference: $PROJECT_REF"
echo ""

# Deploy URL processing function
echo "🌐 Deploying process-url function..."
if supabase functions deploy process-url --project-ref $PROJECT_REF; then
    echo "✅ process-url deployed successfully"
else
    echo "❌ Failed to deploy process-url"
    exit 1
fi

echo ""

# Deploy system prompt generation function
echo "🤖 Deploying generate-system-prompt function..."
if supabase functions deploy generate-system-prompt --project-ref $PROJECT_REF; then
    echo "✅ generate-system-prompt deployed successfully"
else
    echo "❌ Failed to deploy generate-system-prompt"
    exit 1
fi

echo ""
echo "🎉 All edge functions deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Supabase Dashboard:"
echo "   - N8N_WEBHOOK_BASE_URL (for n8n webhook integration, e.g., https://n8ncloud.com/webhook)"
echo "2. Test the functions using the Supabase Dashboard"
echo "3. Update your application to use the knowledge base functionality"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
