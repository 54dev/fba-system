#!/bin/bash

echo "🔍 Checking running containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 Checking if nginx is forwarding correctly..."
curl -I http://localhost/api/login || echo "❌ Cannot reach /api/login via nginx"

echo ""
echo "🔍 Checking backend container..."
docker exec -it fba_backend curl -I http://localhost:8000/api/login || echo "❌ Backend route /api/login unreachable inside backend"

echo ""
echo "🔍 Checking frontend dev server..."
curl -I http://localhost:3000/ || echo "❌ Frontend not reachable on :3000"

echo ""
echo "🔍 Checking if frontend wrongly serves API (should be 404 here):"
curl -I http://localhost:3000/api/login

echo ""
echo "Done ✔"

