
# Commands for building the provider_web app in staging environment
Write-Host "Building pink_web app for staging environment..."
ssh pinkstaging2 "node -v && cd /var/www/node-bots/chatbot_api && git pull && npm install --only=production && npm run build && echo "$(Get-date) - node-bots/stg" >> log.log"
