#!/bin/sh

envsubst '${REACT_APP_REST_URL_SHORTENER} ${REACT_APP_REST_QR_GENERATOR} ${REACT_APP_GRPC_LINK_SHORTENER} ${REACT_APP_GRPC_QR_GENERATOR} ${REACT_APP_USER_MANAGEMENT} ${REACT_APP_ANALYTICS} ${API_GATEWAY_URL}'\
  < /usr/share/nginx/html/env-config.js \
  > /usr/share/nginx/html/env-config.tmp.js

mv /usr/share/nginx/html/env-config.tmp.js /usr/share/nginx/html/env-config.js

echo "Environment variables injected:"
cat /usr/share/nginx/html/env-config.js

exec nginx -g 'daemon off;'