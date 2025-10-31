#!/bin/bash

echo "🔍 BM Agency Dashboard Status Check"
echo "===================================="

# Check if backend is running
echo -n "1. Checking backend server... "
if curl -s http://localhost:5000/api/v1/health > /dev/null 2>&1; then
    echo "✅ Running"
    echo "   Server: http://localhost:5000"
    echo "   Health: $(curl -s http://localhost:5000/api/v1/health | jq -r '.message // "OK"')"
else
    echo "❌ Not running"
    echo "   Please start the backend: cd Backend && npm run dev"
fi

echo ""

# Check database connection
echo -n "2. Checking database connection... "
if curl -s http://localhost:5000/api/v1/health | jq -r '.databaseStatus // "unknown"' 2>/dev/null | grep -q "connected"; then
    echo "✅ Connected"
else
    echo "❌ Not connected"
    echo "   Check your MongoDB connection string in Backend/.env"
fi

echo ""

# Check sample data
echo "3. Checking sample data in database..."

endpoints=("services" "articles" "realisations" "team" "testimonials" "products" "auth/users")
for endpoint in "${endpoints[@]}"; do
    count=$(curl -s "http://localhost:5000/api/v1/$endpoint" | jq '.results // .data | length' 2>/dev/null || echo "0")
    echo "   $endpoint: $count items"
done

echo ""

# Check frontend
echo -n "4. Checking frontend... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Running"
    echo "   Dashboard: http://localhost:3000/admin/dashboard"
else
    echo "❌ Not running"
    echo "   Please start the frontend: cd Frontend && npm run dev"
fi

echo ""

echo "📊 Dashboard Status Summary:"
echo "============================="

total_items=0
for endpoint in "${endpoints[@]}"; do
    count=$(curl -s "http://localhost:5000/api/v1/$endpoint" | jq '.results // .data | length' 2>/dev/null || echo "0")
    total_items=$((total_items + count))
done

if [ "$total_items" -gt 0 ]; then
    echo "✅ Dashboard should show dynamic data ($total_items total items)"
    echo "🔄 Refresh your browser to see updated data"
    echo ""
    echo "🎯 What you should see:"
    echo "   - Real numbers instead of zeros"
    echo "   - Actual articles, services, team members"
    echo "   - Pending approvals (if logged in as admin)"
    echo "   - Recent activity feed"
else
    echo "⚠️  Dashboard may show zeros - sample data not loaded"
    echo "   Run: node scripts/create-sample-content.js"
fi

echo ""
echo "🛠️  If you still see static data:"
echo "   1. Hard refresh browser (Ctrl+F5)"
echo "   2. Check browser console for errors"
echo "   3. Verify you're logged in as admin/editor"
echo "   4. Run this script again to check status"

echo ""
echo "✨ Quick Fix Commands:"
echo "   Backend: cd Backend && npm run dev"
echo "   Frontend: cd Frontend && npm run dev"
echo "   Sample Data: cd Backend && node scripts/create-sample-content.js"
