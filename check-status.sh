#!/usr/bin/env bash
set -e

echo "🔍 Checking deployment status..."

# Check VM status
echo "📦 Checking Vagrant VM status:"
cd "$(dirname "$0")/infra"
vagrant status | grep "running" || echo "❌ VM not running. Start with 'cd infra && vagrant up'"

# Check API availability
echo -e "\n🌐 Checking API status:"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [[ $HEALTH_RESPONSE -eq 200 ]]; then
  echo "✅ API is accessible at http://localhost:3000"
  echo -e "\n📊 API Health details:"
  curl -s http://localhost:3000/health
else
  echo "❌ API is not accessible. HTTP response: $HEALTH_RESPONSE"
fi

# Check PM2 status in VM
echo -e "\n🔄 Checking PM2 process status:"
SSH_KEY="$(dirname "$0")/infra/.vagrant/machines/default/virtualbox/private_key"
if [ -f "$SSH_KEY" ]; then
  ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no vagrant@127.0.0.1 -p 2222 "pm2 list" 
else
  echo "❌ SSH key not found. VM may not be running or Vagrant might need to be reinitialized."
fi

echo -e "\n✅ Status check completed."
