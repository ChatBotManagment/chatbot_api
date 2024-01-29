
# Commands for building the provider_web app in staging environment
Write-Host "Building pink_web app for staging environment..."
git commit -am "deploy"
git push
ssh pinkstaging2 "node -v && cd /var/www/node-bots/chatbot_api && git reset --hard HEAD  && git pull && npm install && npm run build && truncate -s 0 /home/ubuntu/.pm2/logs/chatbot-api1-out.log  && sudo -u ubuntu pm2 restart chatbot_api1  && echo "$(Get-date) - node-bots/stg" >> log.log"
