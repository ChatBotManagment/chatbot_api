
# Commands for building the provider_web app in staging environment
echo "Building pink_web app for staging environment..."
ssh pinkstaging2 "node -v && cd /var/www/node-bots/chatbot_api && git pull && npm install && npm run build && pm2 restart chatbot_api1 && truncate -s 0 /home/ubuntu/.pm2/logs/chatbot-api1-out.log  && echo "$(Get-date) - node-bots/stg" >> log.log"
