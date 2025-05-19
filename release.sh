#!/usr/bin/env bash
set -e

echo "🚀 Starting release process..."

# Navigate to API directory
cd "$(dirname "$0")/api"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

# Run build
echo "🔨 Building application..."
npm run build

# Generate new version based on date and create git tag
VERSION=$(date +'%Y.%m.%d-%H%M%S')
echo "🏷️  Creating tag v$VERSION..."
git tag "v$VERSION"
git push --tags

# Update version with standard-version
echo "📝 Updating version with standard-version..."
npx standard-version --release-as minor --skip.tag

# Deploy with Ansible
echo "🚀 Deploying with Ansible..."
cd ..
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

echo "✅ Release process completed successfully!"
