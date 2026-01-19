#!/bin/sh

echo "Generating runtime config..."

envsubst < /usr/share/nginx/html/config.template.js \
  > /usr/share/nginx/html/config.js

echo "Final config.js:"
cat /usr/share/nginx/html/config.js

exec "$@"
