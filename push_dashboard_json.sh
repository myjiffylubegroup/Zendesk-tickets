#!/bin/bash

# Ensure we’re in the repo root
echo "Switching to repo root..."
cd /opt/render/project/src || exit 1

# Run the dashboard generator script
python generate_ticket_dashboard.py || exit 1

echo "Generated ticket_store_summary.json"

# Copy JSON into React public folder
echo "Copying JSON into frontend/public/"
mkdir -p frontend/public
cp ticket_store_summary.json frontend/public/ticket_store_summary.json || exit 1


# Git config (only needed once if this runs inside a stateless container)
git config --global user.name "Render Bot"
git config --global user.email "noreply@render.com"

# Commit and push

echo "Staging and committing updated JSON..."
git add frontend/public/ticket_store_summary.json

git commit -m "🤖 Auto-update ticket_store_summary.json from cron" || echo "Nothing to commit"
git push origin main || echo "Push failed (e.g., no changes or no permissions)"

echo "✅ Dashboard JSON pushed to main. Trigger frontend redeploy."
