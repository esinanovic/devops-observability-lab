echo "=== TEST COMPLET LOCAL ==="

echo "1. 🧪 Tests unitaires..."
node test.js && echo "✅ Tests OK" || echo "❌ Tests échoués"

echo -e "\n2. 🔍 ESLint..."
./node_modules/.bin/eslint . && echo "✅ ESLint OK" || echo "❌ ESLint échoué"

echo -e "\n3. 🐳 Docker build..."
docker build -q -t backend-test . && echo "✅ Docker build OK" || echo "❌ Docker build échoué"

echo -e "\n4. 🚀 Docker run..."
docker run --rm backend-test node -e "console.log('✅ App works')" && echo "✅ Docker run OK" || echo "❌ Docker run échoué"

