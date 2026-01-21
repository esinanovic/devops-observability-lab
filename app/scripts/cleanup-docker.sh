#!/bin/bash
set -e

echo "🧹 Starting Docker cleanup..."

# 1. Stop all running containers
echo "Stopping containers..."
docker stop $(docker ps -q) 2>/dev/null || true

# 2. Remove stopped containers
echo "Removing containers..."
docker rm $(docker ps -aq) 2>/dev/null || true

# 3. Remove dangling images
echo "Removing dangling images..."
docker image prune -f

# 4. Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# 5. Remove unused networks
echo "Removing unused networks..."
docker network prune -f

# 6. Remove builder cache (si vous utilisez BuildKit)
echo "Clearing build cache..."
docker builder prune -f

echo "✅ Cleanup complete!"

# Afficher l'espace libéré
echo ""
echo "📊 Docker disk usage:"
docker system df